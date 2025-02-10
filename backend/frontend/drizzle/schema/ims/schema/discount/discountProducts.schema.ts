import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { category } from '../product/category.schema';
import { product } from '../product/product.schema';

export const discountProducts = pgTable('discount_p', {
  discount_product_id: serial('discount_p_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  category_id: integer('cateogry_id').references(() => category.category_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
