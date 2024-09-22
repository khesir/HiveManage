import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { inquiry } from '@/drizzle/drizzle.schema';

export class InquiryService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createInquiry(data: object) {
    await this.db.insert(inquiry).values(data);
  }

  async getAllInquiry(
    inquiry_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (inquiry_id) {
        const result = await this.db
          .select()
          .from(inquiry)
          .where(
            and(
              eq(inquiry.inquiry_id, Number(inquiry_id)),
              isNull(inquiry.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(inquiry)
          .where(isNull(inquiry.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching inquiry: ', error);
      throw new Error('Error fetching inquiry');
    }
  }

  async getInquiryById(paramsId: number) {
    const result = await this.db
      .select()
      .from(inquiry)
      .where(eq(inquiry.inquiry_id, paramsId));
    return result[0];
  }

  async updateInquiry(data: object, paramsId: number) {
    await this.db
      .update(inquiry)
      .set(data)
      .where(eq(inquiry.inquiry_id, paramsId));
  }

  async deleteInquiry(paramsId: number): Promise<void> {
    await this.db
      .update(inquiry)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(inquiry.inquiry_id, paramsId));
  }
}
