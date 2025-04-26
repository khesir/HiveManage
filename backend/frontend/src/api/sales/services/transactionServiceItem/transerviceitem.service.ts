import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { service } from '@/drizzle/schema/services';
import { CreateTranServiceItem } from './transerviceitem.model';
import { transactionserviceItem } from '@/drizzle/schema/ims/schema/service/transactionServiceItem';
import { serviceRecord } from '@/drizzle/schema/ims/schema/service/serviceRecord.schema';

export class TranServiceItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createTranServiceItem(data: CreateTranServiceItem) {
    await this.db.insert(transactionserviceItem).values(data);
  }

  async getAllTranServiceItem(
    service_record_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(transactionserviceItem.deleted_at)];

    if (service_record_id !== undefined && !isNaN(Number(service_record_id))) {
      conditions.push(
        eq(transactionserviceItem.service_record_id, Number(service_record_id)),
      );
    }

    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(transactionserviceItem)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(transactionserviceItem)
      .leftJoin(
        serviceRecord,
        eq(
          serviceRecord.service_record_id,
          transactionserviceItem.service_record_id,
        ),
      )
      .leftJoin(
        service,
        eq(service.service_id, transactionserviceItem.service_id),
      )
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(transactionserviceItem.created_at)
          : desc(transactionserviceItem.created_at),
      )
      .limit(limit)
      .offset(offset);

    const transactionserviceItemWithDetails = result.map((row) => ({
      ...row.transaction_service_Item,
      service_record: {
        ...row.service_record,
      },
      service: {
        ...row.service,
      },
    }));

    return { totalData, transactionserviceItemWithDetails };
  }

  async getTranServiceItemById(transaction_service_Record: number) {
    const result = await this.db
      .select()
      .from(transactionserviceItem)
      .leftJoin(
        serviceRecord,
        eq(
          serviceRecord.service_record_id,
          transactionserviceItem.service_record_id,
        ),
      )
      .leftJoin(
        service,
        eq(service.service_id, transactionserviceItem.service_id),
      )
      .where(
        eq(
          transactionserviceItem.transaction_service_Record,
          Number(transaction_service_Record),
        ),
      );

    const transactionserviceItemWithDetails = result.map((row) => ({
      ...row.transaction_service_Item,
      service_record: {
        ...row.service_record,
      },
      service: {
        ...row.service,
      },
    }));

    return transactionserviceItemWithDetails;
  }

  async updateTranServiceItem(data: object, paramsId: number) {
    await this.db
      .update(transactionserviceItem)
      .set(data)
      .where(eq(transactionserviceItem.transaction_service_Record, paramsId));
  }

  async deleteTranServiceItem(paramsId: number): Promise<void> {
    await this.db
      .update(transactionserviceItem)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(transactionserviceItem.transaction_service_Record, paramsId));
  }
}
