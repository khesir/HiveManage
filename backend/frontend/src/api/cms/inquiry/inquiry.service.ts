import { and, eq, isNull } from 'drizzle-orm';
import { inquiry, SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateInquiry } from './inquiry.model';

export class InquiryService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createInquiry(data: CreateInquiry) {
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
