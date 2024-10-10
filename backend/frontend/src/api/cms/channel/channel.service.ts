import { and, eq, isNull } from 'drizzle-orm';
import { channel } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ChannelService {
  private db: PostgresJsDatabase;

  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async createChannel(data: object) {
    await this.db.insert(channel).values(data);
  }

  async getAllChannel(
    channel_id: string | undefined,
    limit: number,
    offset: number,
  ) {
    try {
      if (channel_id) {
        const result = await this.db
          .select()
          .from(channel)
          .where(
            and(
              eq(channel.channel_id, Number(channel_id)),
              isNull(channel.deleted_at),
            ),
          )
          .limit(limit)
          .offset(offset);
        return result;
      } else {
        const result = await this.db
          .select()
          .from(channel)
          .where(isNull(channel.deleted_at))
          .limit(limit)
          .offset(offset);
        return result;
      }
    } catch (error) {
      console.error('Error fetching channel: ', error);
      throw new Error('Error fetching channels');
    }
  }

  async getChannelById(paramsId: number) {
    const result = await this.db
      .select()
      .from(channel)
      .where(eq(channel.channel_id, paramsId));
    return result[0];
  }

  async updateChannel(data: object, paramsId: number) {
    await this.db
      .update(channel)
      .set(data)
      .where(eq(channel.channel_id, paramsId));
  }

  async deleteChannel(paramsId: number): Promise<void> {
    await this.db
      .update(channel)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(channel.channel_id, paramsId));
  }
}
