import {
  boolean,
  decimal,
  integer,
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

  re_order_level: integer('re_order_level').default(0),

  selling_price: decimal('selling_price', { precision: 50, scale: 2 }),

  total_quantity: integer('total_quantity').default(0).notNull(),
  sale_quantity: integer('sale_quantity').default(0),
  service_quantity: integer('service_quantity').default(0),
  rent_quantity: integer('rent_quantity').default(0),
  damage_quantity: integer('damage_quantity').default(0),
  sold_quantity: integer('sold_quantity').default(0),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
