import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import {
  productRestocks,
  suppliers,
} from 'src/core/drizzle/schema/sales.schema';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import { CreateSupplierDto } from '../dto/create-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  private async ensureSupplierExists(id: number) {
    const [ existing ] = await this.db
      .select({ count: sql`COUNT(*)` })
      .from(suppliers)
      .where(eq(suppliers.id, id));
      
    if (Number(existing.count) === 0) {
      throw new NotFoundException(`Supplier #${id} not found`);
    }
  }

  async addSupplier(dto: CreateSupplierDto) {
    const [ existing ] = await this.db
      .select()
      .from(suppliers)
      .where(eq(suppliers.phone, dto.phone));

    if (existing?.id) {
      throw new BadRequestException(
        `Supplier with phone ${dto.phone} already exists!`,
      );
    }

    await this.db.insert(suppliers).values(dto);

    return { message: `Supplier created successfully!` };
  }

  async getOneSupplier(id: number) {
    // 1) Make sure supplier exists
    await this.ensureSupplierExists(id);

    // 2) Fetch supplier + nested restocks
    const [row] = await this.db
      .select({
        id: suppliers.id,
        name: suppliers.name,
        phone: suppliers.phone,
        location: suppliers.location,
        email: suppliers.email,
        createdAt: suppliers.createdAt,
        updatedAt: suppliers.updatedAt,

        restocks: sql`
            coalesce(
              (
                select 
                  json_agg(row_to_json(pr.*) order by pr.restock_date desc)
                from ${productRestocks} pr
                where pr.supplier_id = ${suppliers.id}
              ),
              '[]'
            )
          `.as('restocks'),
      })
      .from(suppliers)
      .where(eq(suppliers.id, id))
      .limit(1);

    return row;
  }

  async getAllSuppliers(): Promise<
    Array<{
      id: number;
      name: string;
      phone: string;
      location: string | null;
      email: string | null;
      createdAt: Date;
      updatedAt: Date;
      restockCount: number;
      totalQuantity: number;
      totalAmount: number;
    }>
  > {
    const rows = await this.db
      .select({
        id: suppliers.id,
        name: suppliers.name,
        phone: suppliers.phone,
        location: suppliers.location,
        email: suppliers.email,
        createdAt: suppliers.createdAt,
        updatedAt: suppliers.updatedAt,
        restockCount: sql`COUNT(${productRestocks.id})`.as('restockCount'),
        totalQuantity: sql`COALESCE(SUM(${productRestocks.qty}), 0)`.as(
          'totalQuantity',
        ),
        totalAmount: sql`COALESCE(SUM(${productRestocks.total}), 0)`.as(
          'totalAmount',
        ),
      })
      .from(suppliers)
      .leftJoin(productRestocks, eq(productRestocks.supplierId, suppliers.id))
      .groupBy(suppliers.id);

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      location: r.location,
      email: r.email,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      restockCount: Number(r.restockCount),
      totalQuantity: Number(r.totalQuantity),
      totalAmount: Number(r.totalAmount),
    }));
  }

  async updateSupplier(id: number, dto: UpdateSupplierDto) {
    await this.ensureSupplierExists(id);

    // if phone is changing, enforce uniqueness
    if (dto.phone) {
      const [{ dup }] = await this.db
        .select({ dup: sql`COUNT(*)` })
        .from(suppliers)
        .where(
          and(eq(suppliers.phone, dto.phone), sql`${suppliers.id} <> ${id}`),
        );
      if (Number(dup) > 0) {
        throw new ConflictException(
          `Another supplier with phone ${dto.phone} already exists`,
        );
      }
    }

    const [row] = await this.db
      .update(suppliers)
      .set(dto)
      .where(eq(suppliers.id, id))
      .returning();
    if (!row) {
      throw new ConflictException(`Failed to update supplier #${id}`);
    }
    return { message: `Supplier #${id} updated successfully!` };
  }

  async removeSupplier(id: number) {
    await this.ensureSupplierExists(id);
    const { rowCount } = await this.db
      .delete(suppliers)
      .where(eq(suppliers.id, id));
    if (!rowCount) {
      throw new ConflictException(`Failed to delete supplier #${id}`);
    }
    return { message: `Supplier #${id} deleted successfully` };
  }
}
