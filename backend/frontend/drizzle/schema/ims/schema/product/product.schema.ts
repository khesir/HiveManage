import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const productStatus = pgEnum('product_status', [
  'Unavailable',
  'Available',
  'Discontinued',
]);

export const product = pgTable('product', {
  product_id: serial('product_id').primaryKey(),

  name: varchar('name'),
  img_url: varchar('img_url'),
  is_serialize: boolean('is_serialize').default(false),
  status: productStatus('product_status').notNull(),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
