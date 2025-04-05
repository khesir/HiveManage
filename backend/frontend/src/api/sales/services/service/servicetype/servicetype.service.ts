import { eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { service_Type } from '@/drizzle/schema/services';
import { CreateServiceType } from './servicetype.model';

export class ServiceTypeService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createServiceType(data: CreateServiceType) {
    await this.db.insert(service_Type).values(data);
  }

  async getAllServiceType() {
    const result = await this.db
      .select()
      .from(service_Type)
      .where(isNull(service_Type.deleted_at));
    return result;
  }

  async getServiceTypeById(paramsId: number) {
    const result = await this.db
      .select()
      .from(service_Type)
      .where(eq(service_Type.service_type_id, paramsId));
    return result[0];
  }

  async updateServiceType(data: object, paramsId: number) {
    await this.db
      .update(service_Type)
      .set(data)
      .where(eq(service_Type.service_type_id, paramsId));
  }

  async deleteServiceType(paramsId: number): Promise<void> {
    await this.db
      .update(service_Type)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(service_Type.service_type_id, paramsId));
  }
}
