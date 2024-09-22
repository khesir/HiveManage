import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { and, eq, isNull } from 'drizzle-orm';
import { participants } from '@/drizzle/drizzle.schema';

export class ParticipantsService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createParticipants(data: object) {
    await this.db.insert(participants).values(data);
  }

  async getAllParticipants(
    participants_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (participants_id) {
        const result = await this.db
          .select()
          .from(participants)
          .where(
            and(
              eq(participants.participants_id, Number(participants_id)),
              isNull(participants.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(participants)
          .where(isNull(participants.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching participant: ', error);
      throw new Error('Error fetching participants');
    }
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
