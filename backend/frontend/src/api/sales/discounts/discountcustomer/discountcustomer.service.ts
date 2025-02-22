import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import {
  discount,
  discountCustomer,
  discountProducts,
} from '@/drizzle/schema/ims';
import { customer, customerGroup } from '@/drizzle/schema/customer';

export class DiscountCustomerService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createDiscountCustomer(data: object) {
    await this.db.insert(discountCustomer).values(data);
  }

  async getAllDiscountCustomer(sort: string, limit: number, offset: number) {
    const conditions = [isNull(discountCustomer.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(discountCustomer)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(discountCustomer)
      .leftJoin(
        customer,
        eq(customer.customer_id, discountCustomer.customer_id),
      )
      .leftJoin(
        customerGroup,
        eq(customerGroup.customer_group_id, discountCustomer.customer_group_id),
      )
      .leftJoin(
        discount,
        eq(discount.discount_id, discountCustomer.discount_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(discountCustomer.created_at)
          : desc(discountCustomer.created_at),
      )
      .limit(limit)
      .offset(offset);
    const discountcustomerWithDetails = result.map((row) => ({
      ...row.discount_c,
      customer: {
        ...row.customer,
        customer_group: {
          ...row.customer_group,
        },
        discount: {
          ...row.discount,
        },
      },
    }));

    return { totalData, discountcustomerWithDetails };
  }

  async getDiscountCustomerById(discount_customer_id: number) {
    const result = await this.db
      .select()
      .from(discountCustomer)
      .leftJoin(
        customer,
        eq(customer.customer_id, discountCustomer.customer_id),
      )
      .leftJoin(
        customerGroup,
        eq(customerGroup.customer_group_id, discountCustomer.customer_group_id),
      )
      .leftJoin(
        discount,
        eq(discount.discount_id, discountCustomer.discount_id),
      )
      .where(
        eq(discountCustomer.discount_customer_id, Number(discount_customer_id)),
      );

    const discountcustomersWithDetails = result.map((row) => ({
      ...row.discount_c,
      customer: {
        ...row.customer,
        customer_group: {
          ...row.customer_group,
        },
        discount: {
          ...row.discount,
        },
      },
    }));

    return discountcustomersWithDetails;
  }

  async updateDiscountCustomer(data: object, paramsId: number) {
    await this.db
      .update(discountProducts)
      .set(data)
      .where(eq(discountProducts.discount_product_id, paramsId));
  }

  async deleteDiscountCustomer(paramsId: number): Promise<void> {
    await this.db
      .update(discountProducts)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(discountProducts.discount_product_id, paramsId));
  }
}
