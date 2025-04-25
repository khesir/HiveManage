import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { serviceItem } from '@/drizzle/schema/ims/schema/service/serviceItems.schema';
import { service } from './service.schema';

export const transaction_service_status = pgEnum('transaction_service_status', [
  'Pending',
  'Returned',
]);

export const transactionServiceItems = pgTable('transaction_service_item', {
  transaction_service_item_id: serial(
    'transaction_service_item_id',
  ).primaryKey(),
  service_id: integer('service_ud').references(() => service.service_id),
  service_item_id: integer('service_item').references(
    () => serviceItem.service_item_id,
  ),
  quantity: integer('quantity'),
  status: transaction_service_status('status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
