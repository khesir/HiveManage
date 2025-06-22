import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { employee } from '../../ems';

export const employeeLog = pgTable('employeeLog', {
  employee_logs_id: serial('employee_logs_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  action: varchar('action', { length: 255 }),
  performed_by: integer('performed_by').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
