import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { customerGroup } from './customerGroup.schema';

export const customerStandingEnum = pgEnum('customer_standing', [
  'Active',
  'Inactive',
  'Pending',
  'Suspended',
  'Banned',
  'VIP',
  'Delinquent',
  'Prospect',
]);

export const customer = pgTable('customer', {
  customer_id: serial('customer_id').primaryKey(),
  firstname: varchar('firstname', { length: 255 }),
  middlename: varchar('middlename', { length: 255 }),
  lastname: varchar('lastname', { length: 255 }),
  contact_phone: varchar('contact_phone', { length: 255 }),
  socials: jsonb('socials').default([]),
  address_line: varchar('address_line', { length: 255 }),
  barangay: varchar('barangay', { length: 255 }),
  province: varchar('province', { length: 255 }),
  email: varchar('email', { length: 255 }),
  standing: customerStandingEnum('customer_standing').notNull(),
  customer_group_id: integer('customer_group').references(
    () => customerGroup.customer_group_id,
  ),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
