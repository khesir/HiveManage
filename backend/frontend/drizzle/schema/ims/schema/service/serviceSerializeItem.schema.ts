import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { serviceItem } from './serviceItems.schema';
import { serializeProduct } from '../..';

export const recordStatus = pgEnum('record_status', ['Sold', 'Available']);

export const serviceRecord = pgTable('service_serilize_record', {
  service_serilize_record_id: serial('service_serilize_record_id').primaryKey(),
  serial_id: integer('serial_id').references(() => serializeProduct.serial_id),
  service_item_id: integer('service_item_id').references(
    () => serviceItem.service_type_id,
  ),
  quantity: integer('qty').default(0),
  status: recordStatus('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
