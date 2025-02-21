import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { product } from '../product/product.schema';
import { discount } from './discount.schema';
import { category } from '../product/category.schema';

export const discountProducts = pgTable('discount_p', {
  discount_product_id: serial('discount_p_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  discount_id: integer('discount_id').references(() => discount.discount_id),
  category_id: integer('categor_id').references(() => category.category_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
