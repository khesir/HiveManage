import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { CreateSerialize, UpdateSerialize } from './serialize.model';
import { SchemaType } from '@/drizzle/schema/type';
import { product, serializeProduct, supplier } from '@/drizzle/schema/ims';

export class SerializeItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSerializeItem(data: CreateSerialize) {
    await this.db
      .insert(serializeProduct)
      .values({ ...data, warranty_date: new Date(Date.now()).toISOString() });
  }

  async getAllSerializedProducts(
    product_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
    status: string | undefined,
    purpose: string | undefined,
  ) {
    const conditions = [isNull(serializeProduct.deleted_at)];

    if (product_id) {
      conditions.push(eq(serializeProduct.product_id, Number(product_id)));
    }
    if (status) {
      const validStatuses = [
        'Sold',
        'Rented',
        'Reserve',
        'Available',
        'In Service',
        'On Order',
        'Returned',
        'Damage',
        'Retired',
      ] as const;
      if (validStatuses.includes(status as (typeof validStatuses)[number])) {
        conditions.push(
          eq(serializeProduct.status, status as (typeof validStatuses)[number]),
        );
      }
    }
    if (purpose) {
      conditions.push(
        eq(serializeProduct.purpose, purpose as 'Rent' | 'Service' | 'Sales'),
      );
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(serializeProduct)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(serializeProduct)
      .leftJoin(product, eq(product.product_id, serializeProduct.product_id))
      .leftJoin(
        supplier,
        eq(supplier.supplier_id, serializeProduct.supplier_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(serializeProduct.serial_id)
          : desc(serializeProduct.serial_id),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;
    const serializedproductsWithDetails = result.map((row) => ({
      ...row.serialized_product,
      product: row.product,
      supplier: row.supplier,
    }));

    return { totalData, serializedproductsWithDetails };
  }

  async getSerializedProductsById(serial_id: number) {
    const result = await this.db
      .select()
      .from(serializeProduct)
      .leftJoin(product, eq(product.product_id, serializeProduct.product_id))
      .where(eq(serializeProduct.serial_id, Number(serial_id)));

    const serializedproductsWithDetails = result.map((row) => ({
      ...row.serialized_product,
      product: {
        ...row.product,
      },
      supplier: {
        row,
      },
    }));
    return serializedproductsWithDetails;
  }

  async updateSerializeItem(data: UpdateSerialize, paramsId: number) {
    await this.db.transaction(async (tx) => {
      // Fetch existing serialized product
      const serializeData = await tx
        .select()
        .from(serializeProduct)
        .where(eq(serializeProduct.serial_id, paramsId));

      if (!serializeData.length) throw new Error('Serialized item not found');

      const existing = serializeData[0];
      const selectedProductId = data.product_id ?? existing.product_id;

      if (existing.purpose !== data.purpose) {
        const productData = await tx
          .select()
          .from(product)
          .where(eq(product.product_id, selectedProductId!));

        if (!productData.length) throw new Error('Product not found');

        const productRow = productData[0];

        const updates: Partial<typeof product.$inferInsert> = {
          service_quantity: productRow.service_quantity ?? 0,
          rent_quantity: productRow.rent_quantity ?? 0,
          sale_quantity: productRow.sale_quantity ?? 0,
        };

        // Decrement from previous purpose
        switch (existing.purpose) {
          case 'Rent':
            updates.rent_quantity = Math.max(
              (updates.rent_quantity ?? 0) - 1,
              0,
            );
            break;
          case 'Service':
            updates.service_quantity = Math.max(
              (updates.service_quantity ?? 0) - 1,
              0,
            );
            break;
          case 'Sales':
            updates.sale_quantity = Math.max(
              (updates.sale_quantity ?? 0) - 1,
              0,
            );
            break;
        }

        // Increment to new purpose
        switch (data.purpose) {
          case 'Rent':
            updates.rent_quantity = (updates.rent_quantity ?? 0) + 1;
            break;
          case 'Service':
            updates.service_quantity = (updates.service_quantity ?? 0) + 1;
            break;
          case 'Sales':
            updates.sale_quantity = (updates.sale_quantity ?? 0) + 1;
            break;
        }

        // Update product quantities
        await tx
          .update(product)
          .set({
            rent_quantity: updates.rent_quantity,
            service_quantity: updates.service_quantity,
            sale_quantity: updates.sale_quantity,
          })
          .where(eq(product.product_id, selectedProductId!));
      }
      await tx
        .update(serializeProduct)
        .set({ ...data })
        .where(eq(serializeProduct.serial_id, Number(paramsId)));
    });
  }

  async deleteSerializeItem(paramsId: number): Promise<void> {
    await this.db
      .update(serializeProduct)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(serializeProduct.serial_id, paramsId));
  }
}
