import { integer, pgTable, real, serial, timestamp } from 'drizzle-orm/pg-core';
import { product } from '../../ims';
import { sales } from './sales.schema';

export const salesItems = pgTable('sales_items', {
  sales_items_id: serial('sales_item_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  sales_id: integer('sales_id').references(() => sales.sales_id),
  quantity: integer('quantity'),
  total_price: real('total_price'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
