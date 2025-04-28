import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { serviceRecord } from './serviceRecord.schema';
import { service } from '@/drizzle/schema/services';

export const transactionserviceItem = pgTable('transaction_service_Item', {
  transaction_service_Record: serial('transaction_service_Record').primaryKey(),
  service_record_id: integer('service_record_id').references(
    () => serviceRecord.service_record_id,
  ),
  service_id: integer('service_id').references(() => service.service_id),
  quantity: integer('qty').default(0),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
