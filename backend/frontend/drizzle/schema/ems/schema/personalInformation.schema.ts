import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { employee } from './employee.schema';

export const personalInformation = pgTable('personal_info', {
  personal_info_id: serial('personal_info_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  birthday: varchar('birthday', { length: 255 }),
  sex: varchar('sex'),
  phone: varchar('phone', { length: 255 }),
  address_line: varchar('address_line', { length: 255 }),
  postal_code: varchar('postal_code', { length: 255 }),
  emergency_contact_name: varchar('emergency_contact_name', { length: 255 }),
  emergency_contact_phone: varchar('emergency_contact_phone', { length: 255 }),
  emergency_contact_relationship: varchar('emergency_contact_relationship', {
    length: 255,
  }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
