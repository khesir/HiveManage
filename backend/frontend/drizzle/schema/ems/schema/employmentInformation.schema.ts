import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { employee } from './employee.schema';
import { department } from './department.schema';
import { designation } from './designation.schema';

export const employmentInfoType = pgEnum('employmentInfo_Type', [
  'Regular',
  'Probationary',
  'Contractual',
  'Seasonal',
  'Temporary',
]);

export const employmentInfoStatus = pgEnum('employmentInfo_Status', [
  'Active',
  'On Leave',
  'Terminated',
  'Resigned',
  'Suspended',
  'Retired',
  'Inactive',
]);

export const employmentInformation = pgTable('employment_info', {
  employment_info_id: serial('employment_info_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  hireDate: varchar('hireDate'),
  department_id: integer('department_id').references(
    () => department.department_id,
  ),
  designation_id: integer('designation_id').references(
    () => designation.designation_id,
  ),
  employee_type: varchar('employee_type'),
  employee_status: varchar('employee_status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
