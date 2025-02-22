import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { productDetails } from './productDetails.schema';
import { supplier } from './supplier.schema';

export const productStatus = pgEnum('product_status', [
  'Unavailable',
  'Sold',
  'Available',
  'Returned',
  'Pending Payment',
  'On Order',
  'In Service',
  'Awaiting Service',
  'Return Requested',
  'Retired',
]);

export const product = pgTable('product', {
  product_id: serial('product_id').primaryKey(),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  p_details_id: integer('p_details_id').references(
    () => productDetails.p_details_id,
  ),
  price: real('price').default(0),
  discount: integer('discount'),
  is_serialize: boolean('is_serialize').default(false),
  itemStatus: productStatus('product_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
