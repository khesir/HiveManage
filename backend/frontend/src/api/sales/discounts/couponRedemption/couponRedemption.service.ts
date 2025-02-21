import { and, eq, isNull, asc, desc, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { discount } from '@/drizzle/schema/ims';
import { customer } from '@/drizzle/schema/customer';
import { couponredemptions } from '@/drizzle/schema/ims/schema/discount/couponredeem';

export class CouponRedemptionService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createCouponRedemption(data: object) {
    await this.db.insert(couponredemptions).values(data);
  }

  async getAllCouponRedemption(sort: string, limit: number, offset: number) {
    const conditions = [isNull(couponredemptions.deleted_at)];

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(couponredemptions)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(couponredemptions)
      .leftJoin(
        discount,
        eq(discount.discount_id, couponredemptions.discount_id),
      )
      .leftJoin(
        customer,
        eq(customer.customer_id, couponredemptions.customer_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(couponredemptions.created_at)
          : desc(couponredemptions.created_at),
      )
      .limit(limit)
      .offset(offset);
    const couponredemptionWithDetails = result.map((row) => ({
      ...row.couponredemptions,
      discount: {
        ...row.discount,
      },
      customer: {
        ...row.customer,
      },
    }));

    return { totalData, couponredemptionWithDetails };
  }

  async getCouponRedemptionById(couponredemptions_id: number) {
    const result = await this.db
      .select()
      .from(couponredemptions)
      .leftJoin(
        discount,
        eq(discount.discount_id, couponredemptions.discount_id),
      )
      .leftJoin(
        customer,
        eq(customer.customer_id, couponredemptions.customer_id),
      )
      .where(
        eq(
          couponredemptions.couponredemptions_id,
          Number(couponredemptions_id),
        ),
      );

    const couponredemptionsWithDetails = result.map((row) => ({
      ...row.couponredemptions,
      discount: {
        ...row.discount,
        customer: {
          ...row.customer,
        },
      },
    }));

    return couponredemptionsWithDetails;
  }

  async updateCouponRedemption(data: object, paramsId: number) {
    await this.db
      .update(couponredemptions)
      .set(data)
      .where(eq(couponredemptions.couponredemptions_id, paramsId));
  }

  async deleteCouponRedemption(paramsId: number): Promise<void> {
    await this.db
      .update(couponredemptions)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(couponredemptions.couponredemptions_id, paramsId));
  }
}
