import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { category } from './category.schema';
import { product } from './product.schema';

export const productCategory = pgTable('product_categories', {
  product_category_id: serial('p_category_id').primaryKey(),
  category_id: integer('category_id').references(() => category.category_id),
  product_id: integer('product_id').references(() => product.product_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
