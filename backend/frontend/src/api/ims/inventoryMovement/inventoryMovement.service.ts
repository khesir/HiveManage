import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { inventoryMovement } from '@/drizzle/schema/ims/schema/product/inventoryMovement.schema';
import { CreateInventoryMovement } from './inventoryMovement.model';
import { product } from '@/drizzle/schema/ims';

export class InventoryMovementService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createInventoryMovement(data: CreateInventoryMovement) {
    await this.db.insert(inventoryMovement).values(data);
  }

  async getAllInventoryMovement(
    product_id: string | undefined,
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(inventoryMovement.deleted_at)];

    if (product_id) {
      conditions.push(eq(inventoryMovement.product_id, Number(product_id)));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(inventoryMovement)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(inventoryMovement)
      .leftJoin(product, eq(product.product_id, inventoryMovement.product_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(inventoryMovement.created_at)
          : desc(inventoryMovement.created_at),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const inventoryMovementWithDetails = result.map((row) => ({
      ...row.inventory_movement,
      product: {
        ...row.product,
      },
    }));

    return { totalData, inventoryMovementWithDetails };
  }

  async getInventoryMovementById(inventory_movement_id: number) {
    const result = await this.db
      .select()
      .from(inventoryMovement)
      .leftJoin(product, eq(product.product_id, inventoryMovement.product_id))
      .where(
        eq(
          inventoryMovement.inventory_movement_id,
          Number(inventory_movement_id),
        ),
      );

    const inventoryMovementWithDetails = result.map((row) => ({
      ...row.inventory_movement,
      product: {
        ...row.product,
      },
    }));
    return inventoryMovementWithDetails;
  }

  async updateInventoryMovement(data: object, paramsId: number) {
    await this.db
      .update(inventoryMovement)
      .set(data)
      .where(eq(inventoryMovement.inventory_movement_id, Number(paramsId)));
  }

  async deleteInventoryMovement(paramsId: number): Promise<void> {
    await this.db
      .update(inventoryMovement)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(inventoryMovement.inventory_movement_id, paramsId));
  }
}
