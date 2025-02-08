import { employee } from '@/drizzle/schema/ems/schema/employee.schema';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { jobOrder } from './jobOrder.schema';

export const assignedEmployees = pgTable('assigned_employees', {
  assigned_employee_id: serial('assigned_employee_id').primaryKey(),
  job_order_id: integer('job_order_id').references(() => jobOrder.job_order_id),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  assigned_by: varchar('assigned_by', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
