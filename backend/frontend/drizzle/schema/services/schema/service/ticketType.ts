import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const ticketType = pgTable('ticketType', {
  ticket_type_id: serial('ticket_type_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
