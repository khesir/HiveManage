import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { serviceItem } from './serviceItems.schema';
import { productRecord } from '../..';
import { employee } from '@/drizzle/schema/ems';

export const recordStatus = pgEnum('service_record_status', [
  'Pending',
  'Confirmed',
  'Declined',
  'Added',
]);

export const serviceRecord = pgTable('service_record', {
  service_record_id: serial('service_record_id').primaryKey(),
  product_record_id: integer('product_record_id').references(
    () => productRecord.product_record_id,
  ),
  service_item_id: integer('service_item_id').references(
    () => serviceItem.service_item_id,
  ),
  quantity: integer('quantity').notNull(),
  status: recordStatus('status').notNull(),
  handled_by: integer('employee_id').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
