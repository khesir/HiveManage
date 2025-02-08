import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const supplier = pgTable('supplier', {
  supplier_id: serial('supplier_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  contact_number: varchar('contact_number', { length: 255 }),
  remarks: varchar('remarks', { length: 255 }),
  relationship: varchar('relationship'),
  profile_link: varchar('remark'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
