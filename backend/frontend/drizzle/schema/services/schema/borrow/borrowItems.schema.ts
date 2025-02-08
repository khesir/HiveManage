import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { borrow } from './borrow.schema';
import { product } from '@/drizzle/schema/ims';

export const borrowItemStatusEnum = pgEnum('borrowStatusEnum', [
  'Requested',
  'Approved',
  'Borrowed',
  'Returned',
  'Overdue',
  'Rejected',
  'Cancelled',
  'Lost',
  'Damaged',
]);

export const borrowItems = pgTable('borrow_items', {
  borrow_item_id: serial('borrow_item_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  borrow_id: integer('borrow_id').references(() => borrow.borrow_id),
  status: borrowItemStatusEnum('borrow_item_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
