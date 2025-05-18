import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { service, transactionServiceItems } from '@/drizzle/schema/services';
import { CreateTranServiceItem } from './transerviceitem.model';
import { serviceRecord } from '@/drizzle/schema/ims/schema/service/serviceRecord.schema';

export class TranServiceItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createTranServiceItem(data: CreateTranServiceItem) {
    await this.db.insert(transactionServiceItems).values(data);
  }

  async getAllTranServiceItem(sort: string, limit: number, offset: number) {
    const conditions = [isNull(transactionServiceItems.deleted_at)];

    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(transactionServiceItems)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(transactionServiceItems)
      .leftJoin(
        serviceRecord,
        eq(
          serviceRecord.service_record_id,
          transactionServiceItems.service_item_id,
        ),
      )
      .leftJoin(
        service,
        eq(service.service_id, transactionServiceItems.service_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(transactionServiceItems.created_at)
          : desc(transactionServiceItems.created_at),
      )
      .limit(limit)
      .offset(offset);

    const transactionServiceItemsWithDetails = result.map((row) => ({
      ...row.transaction_service_item,
      service_record: {
        ...row.service_record,
      },
      service: {
        ...row.service,
      },
    }));

    return { totalData, transactionServiceItemsWithDetails };
  }

  async getTranServiceItemById(transaction_service_Record: number) {
    const result = await this.db
      .select()
      .from(transactionServiceItems)
      .leftJoin(
        serviceRecord,
        eq(
          serviceRecord.service_record_id,
          transactionServiceItems.service_item_id,
        ),
      )
      .leftJoin(
        service,
        eq(service.service_id, transactionServiceItems.service_id),
      )
      .where(
        eq(
          transactionServiceItems.service_item_id,
          Number(transaction_service_Record),
        ),
      );

    const transactionServiceItemsWithDetails = result.map((row) => ({
      ...row.transaction_service_item,
      service_record: {
        ...row.service_record,
      },
      service: {
        ...row.service,
      },
    }));

    return transactionServiceItemsWithDetails;
  }

  async updateTranServiceItem(data: object, paramsId: number) {
    await this.db
      .update(transactionServiceItems)
      .set(data)
      .where(eq(transactionServiceItems.transaction_service_item_id, paramsId));
  }

  async deleteTranServiceItem(paramsId: number): Promise<void> {
    await this.db
      .update(transactionServiceItems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(transactionServiceItems.transaction_service_item_id, paramsId));
  }
}
