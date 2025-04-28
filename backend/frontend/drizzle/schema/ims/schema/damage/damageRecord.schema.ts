import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { product } from '../..';
import { serviceRecord } from '../service/serviceRecord.schema';
import { damageItem } from './damageItems.schema';
import { employee } from '@/drizzle/schema/ems';

export const damageRecord = pgTable('damage_record', {
  damage_record_id: serial('damage_record_id').primaryKey(),
  service_record_id: integer('service_record_id').references(
    () => serviceRecord.service_record_id,
  ),
  product_id: integer('product_id').references(() => product.product_id),
  damage_item_id: integer('damage_item_id').references(
    () => damageItem.damage_item_id,
  ),
  quantity: integer('quantity').default(0),
  handled_by: integer('employee_id').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
