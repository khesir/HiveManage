import { employee } from '@/drizzle/schema/ems/schema/employee.schema';
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { service } from './service.schema';

export const assignedEmployees = pgTable('assigned_employees', {
  assigned_employee_id: serial('assigned_employee_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  is_leader: boolean('is_leader'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
