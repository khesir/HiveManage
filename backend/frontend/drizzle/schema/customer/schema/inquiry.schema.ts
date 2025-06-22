import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { customer } from './customer.schema';

export const inquiryTypeEnum = pgEnum('inquiry_type', [
  'Product',
  'Pricing',
  'Order Status',
  'Technical Support',
  'Billing',
  'Complaint',
  'Feedback',
  'Return/Refund',
]);

export const inquiry = pgTable('inquiry', {
  inquiry_id: serial('inquiry_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  inquiryTitle: varchar('inquiryTitle', { length: 255 }),
  inquiry_type: inquiryTypeEnum('inquiry_type').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
