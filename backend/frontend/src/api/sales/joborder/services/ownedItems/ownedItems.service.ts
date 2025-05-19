import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { service } from '@/drizzle/schema/services';
import { CreateOwnedServiceItems } from './ownedItems.model';
import { serviceOwnedItems } from '@/drizzle/schema/services/schema/service/serviceOwnedItems.schema';

export class OwnedServiceItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createOwnedServiceItems(data: CreateOwnedServiceItems) {
    await this.db.insert(serviceOwnedItems).values(data);
  }

  async getAllOwnedServiceItems(
    sort: string,
    limit: number,
    offset: number,
    service_id: string,
  ) {
    const conditions = [isNull(serviceOwnedItems.deleted_at)];
    if (service_id) {
      conditions.push(eq(serviceOwnedItems.service_id, Number(service_id)));
    }
    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(serviceOwnedItems)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(serviceOwnedItems)
      .leftJoin(service, eq(service.service_id, serviceOwnedItems.service_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(serviceOwnedItems.created_at)
          : desc(serviceOwnedItems.created_at),
      )
      .limit(limit)
      .offset(offset);

    const serviceOwnedItemsWithDetails = result.map((row) => ({
      ...row.service_owned_items,
      service: {
        ...row.service,
      },
    }));

    return { totalData, serviceOwnedItemsWithDetails };
  }

  async getOwnedServiceItemsById(transaction_service_Record: number) {
    const result = await this.db
      .select()
      .from(serviceOwnedItems)
      .leftJoin(service, eq(service.service_id, serviceOwnedItems.service_id))
      .where(
        eq(
          serviceOwnedItems.service_owned_id,
          Number(transaction_service_Record),
        ),
      );

    const serviceOwnedItemsWithDetails = result.map((row) => ({
      ...row.service_owned_items,
      service: {
        ...row.service,
      },
    }));

    return serviceOwnedItemsWithDetails;
  }

  async updateOwnedServiceItems(data: object, paramsId: number) {
    await this.db
      .update(serviceOwnedItems)
      .set(data)
      .where(eq(serviceOwnedItems.service_owned_id, paramsId));
  }

  async deleteOwnedServiceItems(paramsId: number): Promise<void> {
    await this.db
      .update(serviceOwnedItems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(serviceOwnedItems.service_owned_id, paramsId));
  }
}
