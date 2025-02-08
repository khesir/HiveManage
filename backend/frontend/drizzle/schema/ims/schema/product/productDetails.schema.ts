import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { category } from './category.schema';

export const productDetails = pgTable('product_details', {
  product_details_id: serial('product_details_id').primaryKey(),
  category_id: integer('category_id').references(() => category.category_id),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  img_url: varchar('img_url'),
  external_serial_code: varchar('external_serial_code', { length: 255 }),
  warranty_date: timestamp('warranty_date'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
