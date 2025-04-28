import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { product } from '../..';

export const damageItem = pgTable('damage_item', {
  damage_item_id: serial('damage_item_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  quantity: integer('quantity').default(0),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
