import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { serializeProduct } from '../product/serializeProducts.schema';
import { damageRecord } from './damageRecord.schema';

export const damageRecordStatus = pgEnum('damage_record_status', [
  'Pending',
  'Confirmed',
  'Returned',
  'Added',
]);

export const serializedserviceRecord = pgTable('service_serialize_record', {
  service_serilize_record_id: serial('service_serilize_record_id').primaryKey(),
  serial_id: integer('serial_id').references(() => serializeProduct.serial_id),
  damage_record_id: integer('damage_Record').references(
    () => damageRecord.damage_record_id,
  ),
  quantity: integer('qty').default(0),
  status: damageRecordStatus('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
