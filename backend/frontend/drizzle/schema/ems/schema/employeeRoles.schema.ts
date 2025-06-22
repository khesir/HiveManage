import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { employee } from './employee.schema';
import { roles } from './roles.schema';

export const employeeRoles = pgTable('employee_roles', {
  employee_roles_id: serial('employee_roles_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  role_id: integer('role_id').references(() => roles.role_id),
  user_id: varchar('user_id'),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
