import { and, eq, isNull } from 'drizzle-orm';
import { message } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateMessage } from './message.model';

export class MessageService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createMessage(data: CreateMessage) {
    await this.db.insert(message).values(data);
  }

  async getAllMessage(
    message_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (message_id) {
        const result = await this.db
          .select()
          .from(message)
          .where(
            and(
              eq(message.message_id, Number(message_id)),
              isNull(message.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(message)
          .where(isNull(message.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching message: ', error);
      throw new Error('Error fetching messages');
    }
  }

  async getMessageById(paramsId: number) {
    const result = await this.db
      .select()
      .from(message)
      .where(eq(message.message_id, paramsId));
    return result[0];
  }

  async updateMessage(data: object, paramsId: number) {
    await this.db
      .update(message)
      .set(data)
      .where(eq(message.message_id, paramsId));
  }

  async deleteMessage(paramsId: number): Promise<void> {
    await this.db
      .update(message)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(message.message_id, paramsId));
  }
}
