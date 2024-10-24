import { eq, isNull } from 'drizzle-orm';
import { participants } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ParticipantsService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createParticipants(data: object) {
    await this.db.insert(participants).values(data);
  }

  async getAllParticipants(limit: number, offset: number) {
    const result = await this.db
      .select()
      .from(participants)
      .where(isNull(participants.deleted_at))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async getParticipantsById(paramsId: number) {
    const result = await this.db
      .select()
      .from(participants)
      .where(eq(participants.participants_id, paramsId));
    return result[0];
  }

  async updateParticipants(data: object, paramsId: number) {
    await this.db
      .update(participants)
      .set(data)
      .where(eq(participants.participants_id, paramsId));
  }

  async deleteParticipants(paramsId: number): Promise<void> {
    await this.db
      .update(participants)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(participants.participants_id, paramsId));
  }
}
