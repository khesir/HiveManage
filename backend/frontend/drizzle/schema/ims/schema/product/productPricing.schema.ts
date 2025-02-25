import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { product } from './product.schema';
import { serializeProducts } from './serializeProducts.schema';

export const productCategory = pgTable('product_pricings', {
  product_pricing_id: serial('p_pricing_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  serialized_id: integer('serial_id').references(
    () => serializeProducts.serial_id,
  ),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
