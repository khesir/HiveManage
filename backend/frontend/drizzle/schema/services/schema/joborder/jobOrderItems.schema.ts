import {
  integer,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { jobOrder } from './jobOrder.schema';
import { product } from '@/drizzle/schema/ims';

export const jobOrderItem = pgTable('job_order_items', {
  job_order_item_id: serial('job_order_item_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  job_order_id: integer('job_order_id').references(() => jobOrder.job_order_id),
  status: varchar('status'),
  quantity: real('quantity'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
