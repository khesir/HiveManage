import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const discountType = pgEnum('discount_type', [
  'Percentage Discount',
  'Fixed Amount Discount',
  'BOGO (Buy x, Get y Free)',
  'Bulk Discount',
  'Seasonal Discount',
  'Clearance Sale',
  'Loyalty Discount',
  'First-Time Buyer Discount',
  'Referral Discount',
  'Birthday Discount',
  'Employee Discount',
  'Cash Payment',
  'Coupon',
]);

export const discount = pgTable('discount', {
  discount_id: serial('discount_id').primaryKey(),
  discount_name: varchar('discount_name'),
  discount_type: discountType('discount_type').notNull(),
  discount_value: real('discoun_value'),
  coupon_code: varchar('coupon_code'),
  is_single_use: boolean('is_single_use'),
  max_redemption: integer('max_redemption'),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  is_active: boolean('is_active'),
  min_purchase_amount: real('min_purchase_amount'),
  max_discount_amount: real('max_discount_amount'),
  usage_limit: integer('usage_limit'),
  times_used: integer('time_used'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
