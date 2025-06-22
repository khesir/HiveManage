import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { position } from './position.schema';

export const employee = pgTable('employee', {
  employee_id: serial('employee_id').primaryKey(),
  position_id: integer('position_id').references(() => position.position_id),
  firstname: varchar('firstname', { length: 255 }),
  middlename: varchar('middlename', { length: 255 }),
  lastname: varchar('lastname', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  profile_link: varchar('profile_link'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
