import { product } from '@/drizzle/schema/ims';
import { jobOrder, jobOrderItem } from '@/drizzle/schema/services';
import { SchemaType } from '@/drizzle/schema/type';
import { and, eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class JobOrderItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createJobOrderItem(data: object) {
    await this.db.insert(jobOrderItem).values(data);
  }

  async getAllJobOrderItem(
    product_id: string | undefined,
    job_order_id: string | undefined,
  ) {
    const conditions = [isNull(jobOrderItem.deleted_at)];
    if (product_id) {
      conditions.push(eq(jobOrderItem.product_id, Number(product_id)));
    }
    if (job_order_id) {
      conditions.push(eq(jobOrderItem.job_order_id, Number(job_order_id)));
    }

    const result = await this.db
      .select()
      .from(jobOrderItem)
      .leftJoin(product, eq(product.product_id, jobOrderItem.product_id))
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, jobOrderItem.job_order_id))
      .where(and(...conditions));

    const joborderitemDetails = result.map((row) => ({
      job_order_item_id: row.job_order_items.job_order_item_id,
      product: {
        product_id: row.product?.product_id,
        supplier_id: row.product?.supplier_id,
        product_details_id: row.product?.p_details_id,
        price: row.product?.price,
        discount: row.product?.discount,
        is_serialize: row.product?.is_serialize,
        status: row.product?.itemStatus,
      },
      jobOrder: {
        job_order_id: row.job_order?.job_order_id,
        jobordertype_id: row.job_order?.job_order_type_id,
        uuid: row.job_order?.uuid,
        description: row.job_order?.description,
        fee: row.job_order?.fee,
        customer_id: row.job_order?.customer_id,
        status: row.job_order?.joborder_status,
        total_price_cost: row.job_order?.total_cost_price,
      },
      status: row.job_order_items.status,
    }));

    return joborderitemDetails;
  }

  async getAllJobOrderItemByID(
    product_id: string | undefined,
    job_order_id: string | undefined,
  ) {
    const conditions = [isNull(jobOrderItem.deleted_at)];
    if (product_id) {
      conditions.push(eq(jobOrderItem.product_id, Number(product_id)));
    }
    if (job_order_id) {
      conditions.push(eq(jobOrderItem.job_order_id, Number(job_order_id)));
    }

    const result = await this.db
      .select()
      .from(jobOrderItem)
      .leftJoin(product, eq(product.product_id, jobOrderItem.product_id))
      .leftJoin(jobOrder, eq(jobOrder.job_order_id, jobOrderItem.job_order_id))
      .where(and(...conditions));

    const joborderitemDetails = result.map((row) => ({
      job_order_item_id: row.job_order_items.job_order_item_id,
      product: {
        product_id: row.product?.product_id,
        supplier_id: row.product?.supplier_id,
        product_details_id: row.product?.p_details_id,
        price: row.product?.price,
        discount: row.product?.discount,
        is_serialize: row.product?.is_serialize,
        status: row.product?.itemStatus,
      },
      jobOrder: {
        job_order_id: row.job_order?.job_order_id,
        jobordertype_id: row.job_order?.job_order_type_id,
        uuid: row.job_order?.uuid,
        description: row.job_order?.description,
        fee: row.job_order?.fee,
        customer_id: row.job_order?.customer_id,
        status: row.job_order?.joborder_status,
        total_price_cost: row.job_order?.total_cost_price,
      },
      status: row.job_order_items.status,
    }));

    return joborderitemDetails;
  }

  async updateJobOrderItem(data: object, paramsId: number) {
    await this.db
      .update(jobOrderItem)
      .set(data)
      .where(eq(jobOrderItem.job_order_item_id, paramsId));
  }

  async deleteJobOrderItem(paramsId: number): Promise<void> {
    await this.db
      .update(jobOrderItem)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(jobOrderItem.job_order_item_id, paramsId));
  }
}
