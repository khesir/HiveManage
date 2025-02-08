import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const customerGroup = pgTable('customer_group', {
  customer_group_id: serial('customer_group_id').primaryKey(),
  firstname: varchar('name', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
