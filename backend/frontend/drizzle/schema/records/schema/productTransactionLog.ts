import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { product, productRecord, serializeProduct } from '../../ims';
import { employee } from '../../ems';

export const ProductTransLog = pgTable('ProductTransLog', {
  product_transaction_id: serial('product_transaction_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  product_record_id: integer('product_record_id').references(
    () => productRecord.product_record_id,
  ),
  serial_id: integer('serial_id').references(() => serializeProduct.serial_id),
  action: varchar('action', { length: 255 }),
  quantity: integer('quantity'),
  performed_by: integer('performed_by').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
