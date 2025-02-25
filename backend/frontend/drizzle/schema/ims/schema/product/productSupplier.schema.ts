import { pgTable, integer, serial, timestamp } from 'drizzle-orm/pg-core';
import { product } from './product.schema';
import { supplier } from './supplier.schema';

export const productCategory = pgTable('product_suppliers', {
  product_supplier_id: serial('p_supplier_id').primaryKey(),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  product_id: integer('product_id').references(() => product.product_id),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
