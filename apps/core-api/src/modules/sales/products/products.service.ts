import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DRIZZLE_CLIENT } from 'src/core/drizzle/drizzle.module';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
  customer,
  productCatalog,
  customProductModels,
  salesOrder,
  salesOrderItem,
  productInventory,
  productCategories,
  salesProjects,
  salesStaff,
} from 'src/core/drizzle/schema/sales.schema';
import { desc, eq, inArray, or, sql } from 'drizzle-orm';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE_CLIENT) private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async create(image: string, dto: CreateProductDto) {
    const [product] = await this.db
      .select({ name: productCatalog.name, sku: productCatalog.sku })
      .from(productCatalog)
      .where(
        or(eq(productCatalog.name, dto.name), eq(productCatalog.sku, dto.sku)),
      )
      .limit(1);

    if (product?.name || product?.sku) {
      throw new BadRequestException(
        'Product with same name or sku cannot be created!',
      );
    }

    if (dto.type === 'ready-made') {
      const existing = await this.db
        .select({ id: productInventory.id })
        .from(productInventory)
        .where(eq(productInventory.id, dto.itemId))
        .limit(1);
      if (!existing.length) {
        throw new BadRequestException(
          `No inventory item with ID #${dto.itemId}`,
        );
      }
    }

    // insert the catalog row
    const [cat] = await this.db
      .insert(productCatalog)
      .values({ ...dto, image })
      .returning({ id: productCatalog.id });
    const catalogId = cat.id;

    // if it's custom or both, write the models
    if (
      (dto.type === 'custom') &&
      Array.isArray(dto.models)
    ) {
      const rows = dto.models.map((m) => ({
        productId: catalogId,
        name: m.name,
        charge: m.charge,
      }));
      await this.db.insert(customProductModels).values(rows);
    }

    return { message: `Product added to catalog successfully!` };
  }

  async findAll() {
    const rows = await this.db
      .select({
        id: productCatalog.id,
        name: productCatalog.name,
        image: productCatalog.image,
        sku: productCatalog.sku,
        category: productCatalog.categoryName,
        price: productCatalog.sellingPrice,
        stock: productInventory.stock,
        type: productCatalog.type,
        enabled: productCatalog.enabled,
        status: sql`
            CASE 
    WHEN ${productCatalog.type} IN ('ready-made')
      AND ${productInventory.id} IS NOT NULL 
    THEN
      CASE 
        WHEN ${productInventory.stock} > ${productInventory.minStock} 
        THEN 'In stock'
        ELSE 'Out of stock'
      END

    ELSE
      CASE 
        -- Pick any tailor whose active‐project count is below some threshold (e.g. 5)
        WHEN (
          SELECT COUNT(*) 
          FROM ${salesProjects}
          WHERE 
            ${salesProjects.tailorId} = (
              SELECT id 
              FROM ${salesStaff}
              WHERE ${salesStaff.status} = 'active' 
              LIMIT 1  -- you could pick a specific staff or average across all
            )
            AND ${salesProjects.status} != 'completed'
        ) < 5
        THEN 'Available'
        ELSE 'Unavailable'
      END
  END
        `.as('status'),
      })
      .from(productCatalog)
      .leftJoin(
        productInventory,
        eq(productCatalog.itemId, productInventory.id),
      );

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      image: r.image,
      sku: r.sku,
      category: r.category,
      price: parseFloat(r.price),
      stock: r.stock,
      type: r.type,
      status: r.status,
      enabled: r.enabled,
    }));
  }

  async findOne(id: number) {
  const [row] = await this.db
    .select({
      // ─── product + inventory ───────────────────────────────
      id:        productCatalog.id,
      name:      productCatalog.name,
      sku:       productCatalog.sku,
      barcode:   productCatalog.barcode,
      image:     productCatalog.image,
      category:  productCatalog.categoryName,
      price:     productCatalog.sellingPrice,
      stock:     productInventory.stock,
      minQty:    productInventory.minStock,
      type:      productCatalog.type,
      enabled:   productCatalog.enabled,

      status: sql`
        CASE
          WHEN ${productCatalog.type} IN ('ready-made')
            AND ${productInventory.id} IS NOT NULL
          THEN
            CASE WHEN ${productInventory.stock} > ${productInventory.minStock}
              THEN 'In stock' ELSE 'Out of stock' END
          ELSE
            CASE WHEN (
              SELECT COUNT(*) FROM ${salesProjects}
              WHERE ${salesProjects.tailorId} = (
                SELECT id FROM ${salesStaff}
                WHERE ${salesStaff.status} = 'active' LIMIT 1
              )
              AND ${salesProjects.status} != 'completed'
            ) < 5 THEN 'Available' ELSE 'Unavailable' END
        END
      `.as('status'),

      inStock: sql`${productInventory.stock} > ${productInventory.minStock}`.as('inStock'),

      // ─── 10 most recent orders ─────────────────────────────
      recentOrders: sql`
        coalesce((
          SELECT json_agg(ro ORDER BY ro."orderedAt" DESC)
          FROM (
            SELECT
              so.id             AS "orderId",
              so."created_at"   AS "orderedAt",
              so."customer_id"  AS "customerId",
              c.name            AS "customerName",
              soi.qty           AS qty,
              soi."base_price"  AS "unitPrice",
              soi."model_price"  AS "modelPrice",
              soi."item_total"  AS "itemTotal"
            FROM ${salesOrderItem} AS soi
            JOIN ${salesOrder}   AS so ON so.id = soi."orderId"
            JOIN ${customer}     AS c  ON c.id  = so."customer_id"
            WHERE soi."catelog_id" = ${productCatalog.id}
            LIMIT 10
          ) AS ro
        ), '[]')
      `.as('recentOrders'),

      // ─── top 5 customers ────────────────────────────────────
      topCustomers: sql`
        coalesce((
          SELECT json_agg(tc)
          FROM (
            SELECT
              so."customer_id"               AS "customerId",
              c.name                         AS "customerName",
              sum(soi.qty)                   AS "totalQty",
              count(DISTINCT soi."orderId")  AS "orderCount"
            FROM ${salesOrderItem} AS soi
            JOIN ${salesOrder}   AS so ON so.id = soi."orderId"
            JOIN ${customer}     AS c  ON c.id  = so."customer_id"
            WHERE soi."catelog_id" = ${productCatalog.id}
            GROUP BY so."customer_id", c.name
            ORDER BY sum(soi.qty) DESC, count(DISTINCT soi."orderId") DESC
            LIMIT 5
          ) AS tc
        ), '[]')
      `.as('topCustomers'),

      // ─── custom models ─────────────────────────────────────
      models: sql`
        coalesce((
          SELECT json_agg(m ORDER BY m.created_at)
          FROM ${customProductModels} AS m
          WHERE m.product_id = ${productCatalog.id}
        ), '[]')
      `.as('models'),
    })
    .from(productCatalog)
    .leftJoin(
      productInventory,
      eq(productInventory.id, productCatalog.itemId),
    )
    .where(eq(productCatalog.id, id))
    .limit(1)

  if (!row) {
    throw new NotFoundException(`Product #${id} not found`)
  }

  return {
    id:           row.id,
    name:         row.name,
    sku:          row.sku,
    barcode:      row.barcode,
    image:        row.image,
    category:     row.category,
    price:        row.price,
    stock:        row.stock,
    minQty:       row.minQty,
    type:         row.type,
    enabled:      row.enabled,
    status:       row.status as string,
    inStock:      row.inStock as boolean,
    recentOrders: row.recentOrders as Array<{
      orderId: number
      orderedAt: Date
      customerId: number
      customerName: string
      qty: number
      unitPrice: string
      itemTotal: string
    }>,
    topCustomers: row.topCustomers as Array<{
      customerId: number
      customerName: string
      totalQty: number
      orderCount: number
    }>,
    models: row.models as Array<{
      id: number
      productId: number
      name: string
      charge: string
      created_at: Date
      updated_at: Date
    }>,
  }
}


  private async checkIfProductExist(id: number) {
    const [product] = await this.db
      .select({ id: productCatalog.id })
      .from(productCatalog)
      .where(eq(productCatalog.id, id));

    if (!product.id) {
      throw new NotFoundException(`Product #${id} not found !`);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.checkIfProductExist(id);
    const update = await this.db
      .update(productCatalog)
      .set(updateProductDto)
      .where(eq(productCatalog.id, id))
      .returning({ id: productCatalog.id });

    if (!update || !(update.length > 0)) {
      throw new ConflictException(`Failed to update product #${id} !`);
    }

    return { message: `Product #${id} updated successfully!` };
  }

  async disable(id: number) {
    await this.checkIfProductExist(id);

    await this.db
      .update(productCatalog)
      .set({ enabled: false })
      .where(eq(productCatalog.id, id));

    return { message: `Product #${id} disabled successfully!` };
  }

  async enable(id: number) {
    await this.checkIfProductExist(id);

    await this.db
      .update(productCatalog)
      .set({ enabled: true })
      .where(eq(productCatalog.id, id));

    return { message: `Product #${id} enabled successfully!` };
  }

  async listActiveProductsGrouped() {
    // 1. Load all enabled products with their type
    const rawProducts = await this.db
      .select({
        id: productCatalog.id,
        image: productCatalog.image,
        name: productCatalog.name,
        price: productCatalog.sellingPrice,
        category: productCatalog.categoryName,
        sku: productCatalog.barcode,
        type: productCatalog.type, // <-- include type
      })
      .from(productCatalog)
      .where(eq(productCatalog.enabled, true));

    // 2. Filter IDs for those that support custom models
    const withModelsIds = rawProducts
      .filter((p) => p.type === 'custom')
      .map((p) => p.id);

    // 3. Load all models for those products
    const rawModels = withModelsIds.length
      ? await this.db
          .select({
            id: customProductModels.id,
            productId: customProductModels.productId,
            name: customProductModels.name,
            charge: customProductModels.charge,
          })
          .from(customProductModels)
          .where(inArray(customProductModels.productId, withModelsIds))
      : [];

    // 4. Group models by productId
    const modelsByProduct = rawModels.reduce<Record<number, typeof rawModels>>(
      (acc, m) => {
        (acc[m.productId] ||= []).push({
          id: m.id,
          productId: m.productId,
          name: m.name,
          charge: m.charge,
        });
        return acc;
      },
      {},
    );

    // 5. Group products into categories, attaching models[]
    const grouped: Record<string, any[]> = {};
    for (const p of rawProducts) {
      grouped[p.category] ||= [];
      grouped[p.category].push({
        id: p.id,
        name: p.name,
        price: p.price,
        sku: p.sku,
        image: p.image,
        type: p.type,
        models: modelsByProduct[p.id] || [], // <-- attach models array
      });
    }

    // 6. Return as array of { category, items }
    return Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }));
  }

  async listAllProducts() {
    return await this.db
      .select({
        id: productCatalog.id,
        image: productCatalog.image,
        name: productCatalog.name,
        price: productCatalog.sellingPrice,
        category: productCatalog.categoryName,
        sku: productCatalog.barcode,
        type: productCatalog.type,
      })
      .from(productCatalog)
      .where(eq(productCatalog.enabled, true));
  }

  async listAllCatagories() {
    return await this.db
      .select({
        id: productCategories.id,
        name: productCategories.name,
      })
      .from(productCategories);
  }

  async addNewCategory(name: string) {
    try {
      const cat = await this.db
        .select({ name: productCategories.name })
        .from(productCategories)
        .where(eq(productCategories.name, name));
      if (cat.length > 0) {
        throw new BadRequestException(
          'Category already exists! Please select that',
        );
      }
      await this.db.insert(productCategories).values({ name });
      return { message: 'category added successfully!' };
    } catch (error) {
      console.log(error.stack);
      throw new ConflictException('Failed to add new category');
    }
  }
}
