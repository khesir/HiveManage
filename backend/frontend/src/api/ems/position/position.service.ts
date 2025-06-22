import { eq, isNull } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreatePosition, UpdatePosition } from './position.model';
import { position } from '@/drizzle/schema/ems';
import { SchemaType } from '@/drizzle/schema/type';

export class PositionService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createPosition(data: CreatePosition) {
    await this.db.insert(position).values(data);
  }

  async getAllPosition(limit: number, offset: number) {
    const result = await this.db
      .select()
      .from(position)
      .where(isNull(position.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getPositionById(paramsId: number) {
    const result = await this.db
      .select()
      .from(position)
      .where(eq(position.position_id, paramsId));
    return result[0];
  }

  async updatePosition(data: UpdatePosition, paramsId: number) {
    await this.db
      .update(position)
      .set(data)
      .where(eq(position.position_id, paramsId));
  }

  async deletePosition(paramsId: number): Promise<void> {
    await this.db
      .update(position)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(position.position_id, paramsId));
  }
}
