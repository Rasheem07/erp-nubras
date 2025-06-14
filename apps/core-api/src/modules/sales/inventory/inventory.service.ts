import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  customProductModels,
  product,
  productCatalog,
  productCategories,
  productInventory,
  productRestocks,
  suppliers,
} from 'src/core/drizzle/schema/sales.schema';
import { eq, or, sql } from 'drizzle-orm';
import { CreateRestockDto } from './dto/create-restock.dto';
import { join } from 'path';
import { S3Service } from 'src/shared/s3/s3.service';
import * as bwipjs from 'bwip-js';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
    private readonly s3: S3Service,
  ) {}

  private async ensureExists(id: number) {
    const [{ count }] = await this.db
      .select({ count: sql`COUNT(*)` })
      .from(productInventory)
      .where(eq(productInventory.id, id));
    if (Number(count) === 0) {
      throw new NotFoundException(`Inventory item #${id} not found`);
    }
  }

  private async generateUniqueSku(name: string): Promise<string> {
    // 1) Build a “slug” from the name: uppercase, alphanumeric + hyphens
    const slug = name
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, '') // strip special chars
      .trim()
      .replace(/\s+/g, '-') // spaces → hyphens
      .slice(0, 10); // take first 10 chars

    let sku = slug;
    let conflict = true;

    // 2) Loop until we find an unused SKU
    while (conflict) {
      // Check for existing SKU
      const [{ count }] = await this.db
        .select({ count: sql`COUNT(*)` })
        .from(productCatalog)
        .where(eq(productCatalog.sku, sku));

      if (Number(count) === 0) {
        conflict = false; // it’s unique!
      } else {
        // Append a random 4-digit suffix (keeps total ≤ 15 chars)
        const suffix = Math.floor(1000 + Math.random() * 9000).toString();
        sku = (slug + '-' + suffix).slice(0, 15);
      }
    }

    return sku;
  }

  private async generateUniqueBarcode(): Promise<string> {
    let code: string;
    let conflict = true;

    while (conflict) {
      // e.g. "651831234567_4821"  (Date.now()%1e8 + 4 random digits)
      const tsPart = (Date.now() % 100_000_000).toString().padStart(8, '0');
      const randPart = Math.floor(Math.random() * 10_000)
        .toString()
        .padStart(4, '0');
      code = `${tsPart}${randPart}`;

      const [{ count }] = await this.db
        .select({ count: sql`COUNT(*)` })
        .from(productInventory)
        .where(eq(productInventory.barcode, code));
      conflict = Number(count) > 0;
    }

    return code;
  }

  private async renderBarcodeImage(code: string): Promise<string> {
    // Render a PNG buffer
    const png = await bwipjs.toBuffer({
      bcid: 'code128', // barcode type
      text: code,
      scale: 3, // 3x scaling
      height: 10, // bars height, in mm
      includetext: true, // show code below bars
      textxalign: 'center',
    });

    const imageUrl = await this.s3.uploadBuffer(
      png,
      `barcode-${code}.png`,
      'barcodes',
      'image/png',
    );

    // Return a URL path your front-end can hit
    return imageUrl;
  }

  async create(image: string, dto: CreateInventoryDto) {
    // Validate unique inventory name/sku
    const [existing] = await this.db
      .select({ id: productInventory.id })
      .from(productInventory)
      .where(
        or(
          eq(productInventory.name, dto.name),
          eq(productInventory.sku, dto.sku),
        ),
      );
    if (existing) {
      throw new BadRequestException('Inventory with same name or SKU exists');
    }

    // Validate reorderPoint ≥ minStock
    if (dto.minStock != null && dto.reorderPoint < dto.minStock) {
      throw new BadRequestException('Reorder point must be ≥ minStock');
    }

    // Validate supplier (if provided)
    if (dto.supplierId) {
      const [{ count }] = await this.db
        .select({ count: sql`COUNT(*)` })
        .from(suppliers)
        .where(eq(suppliers.id, dto.supplierId));
      if (Number(count) === 0) {
        throw new NotFoundException(`Supplier #${dto.supplierId} not found`);
      }
    }

    // Validate category exists for catalog FK
    const [{ count: catCount }] = await this.db
      .select({ count: sql`COUNT(*)` })
      .from(productCategories)
      .where(eq(productCategories.name, dto.categoryName));
    if (Number(catCount) === 0) {
      throw new BadRequestException(`Category "${dto.categoryName}" not found`);
    }

    if (!dto.barcode) {
      dto.barcode = await this.generateUniqueBarcode();
    }

    if (!dto.sku) {
      dto.sku = await this.generateUniqueSku(dto.name);
    }

    const barcodeImageUrl = await this.renderBarcodeImage(dto.barcode);

    return this.db.transaction(async (tx) => {
      // 1) Insert inventory
      const [inv] = await tx
        .insert(productInventory)
        .values({
          name: dto.name,
          sku: dto.sku,
          category: dto.category,
          uom: dto.uom,
          description: dto.description,
          cost: dto.cost,
          stock: dto.stock,
          minStock: dto.minStock,
          reorderPoint: dto.reorderPoint,
          supplierId: dto.supplierId,
          barcode: dto.barcode,
          barcodeImageUrl: barcodeImageUrl,
          weight: dto.weight,
          notes: dto.notes,
        })
        .returning({ id: productInventory.id });
      const inventoryId = inv.id;

      // 2) Insert catalog entry
      const [cat] = await tx
        .insert(productCatalog)
        .values({
          type: dto.type,
          name: dto.name,
          sku: dto.sku,
          barcode: dto.barcode,
          itemId: inventoryId,
          sellingPrice: dto.sellingPrice,
          image: image,
          description: dto.description,
          enabled: dto.enabled,
          categoryName: dto.categoryName,
        })
        .returning({ id: productCatalog.id });
      const catalogId = cat.id;

      // 3) If custom/both, insert models
      if (
        (dto.type === 'custom') &&
        Array.isArray(dto.models)
      ) {
        const modelRows = dto.models.map((m) => ({
          productId: catalogId,
          name: m.name,
          charge: m.charge,
        }));
        await tx.insert(customProductModels).values(modelRows);
      }

      return { message: 'Inventory & catalog created successfully!' };
    });
  }

  async findAll() {
    return this.db.select().from(productInventory);
  }

  async findOne(id: number) {
    await this.ensureExists(id);

    const [row] = await this.db
      .select({
        // ——— Inventory fields ———
        id: productInventory.id,
        name: productInventory.name,
        sku: productInventory.sku,
        category: productInventory.category,
        uom: productInventory.uom,
        description: productInventory.description,
        cost: productInventory.cost,
        stock: productInventory.stock,
        minStock: productInventory.minStock,
        reorderPoint: productInventory.reorderPoint,
        barcode: productInventory.barcode,
        barcodeImageUrl: productInventory.barcodeImageUrl,
        supplierId: productInventory.supplierId,
        weight: productInventory.weight,
        notes: productInventory.notes,
        createdAt: productInventory.createdAt,
        updatedAt: productInventory.updatedAt,

        // ——— Catalog object ———
        catalog: sql`
        (
          SELECT row_to_json(pc)
          FROM ${productCatalog} AS pc
          WHERE pc.item_id = ${id}
        )
      `.as('catalog'),

        // ——— Models array ———
        models: sql`
        COALESCE(
          (
            SELECT json_agg(row_to_json(m) ORDER BY m.created_at)
            FROM sales_schema.custom_product_models AS m
            WHERE m.product_id = (
              SELECT pc2.id
              FROM sales_schema.product_catelog AS pc2
              WHERE pc2.item_id = ${productInventory.id}
            )
          ),
          '[]'
        )
      `.as('models'),

        // ——— Restocks array ———
        restocks: sql`
        COALESCE(
          (
            SELECT json_agg(row_to_json(pr) ORDER BY pr.restock_date DESC)
            FROM sales_schema.product_restocks AS pr
            WHERE pr.item_id = ${productInventory.id}
          ),
          '[]'
        )
      `.as('restocks'),
      })
      .from(productInventory)
      .where(eq(productInventory.id, id));

    return row;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    await this.ensureExists(id);
    const [{ id: updatedId }] = await this.db
      .update(productInventory)
      .set(updateInventoryDto)
      .where(eq(productInventory.id, id))
      .returning({ id: productInventory.id });

    if (!updatedId) {
      throw new ConflictException('Failed to update inventory item');
    }

    return { message: `Inventory item #${id} updated successfully!` };
  }

  async remove(id: number) {
    const { rowCount } = await this.db
      .delete(productInventory)
      .where(eq(productInventory.id, id));

    if (!rowCount || rowCount === 0) {
      throw new NotFoundException(`Inventory item #${id} not found!`);
    }

    return { message: `Inventory item #${id} deleted successfully!` };
  }

  async restock(dto: CreateRestockDto) {
    const [{ id }] = await this.db
      .select({ id: productInventory.id })
      .from(productInventory)
      .where(eq(productInventory.id, dto.itemId));

    if (!id) {
      throw new NotFoundException(`Inventory item #${dto.itemId} not found!`);
    }

    await this.db.transaction(async (tx) => {
      const [{ id: restockId }] = await tx
        .insert(productRestocks)
        .values(dto)
        .returning({ id: productRestocks.id });
      if (!restockId) {
        throw new ConflictException(
          `Failed to restock inventory item #${dto.itemId}`,
        );
      }
      await tx
        .update(productInventory)
        .set({ stock: sql`${productInventory.stock} + ${dto.qty}` })
        .where(eq(productInventory.id, id));
    });

    return { message: `Inventory item #${id} restocked successfully!` };
  }
}
