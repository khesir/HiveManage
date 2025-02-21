import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { payment } from './payment.schema';

export const receipt = pgTable('receipt', {
  receipt_id: serial('receipt_id').primaryKey(),
  payment_id: integer('payment_id').references(() => payment.payment_id),
  issued_date: varchar('issued_data'),
  total_amount: integer('total_amount'),
  receipt_dl_link: varchar('receipt_dl_link'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
