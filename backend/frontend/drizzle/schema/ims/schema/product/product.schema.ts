import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { productDetails } from './productDetails.schema';

export const productStatus = pgEnum('product_status', [
  'Unavailable',
  'Available',
]);

export const product = pgTable('products', {
  product_id: serial('product_id').primaryKey(),
  p_details_id: integer('p_details_id').references(
    () => productDetails.p_details_id,
  ),
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
