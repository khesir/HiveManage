import { pgTable } from 'drizzle-orm/pg-core';
import { payment, receipt } from '../drizzle.schema';
import { inquiry } from './customer/schema/inquiry.schema';
import {
  employee,
  roles,
  personalInformation,
  employmentInformation,
  department,
  designation,
} from './ems';
import {
  product,
  category,
  supplier,
  order,
  orderItem,
  discount,
  discountCustomer,
  discountProducts,
} from './ims';
import {
  jobOrder,
  reports,
  jobordertype,
  reserve,
  borrow,
  borrowItems,
  reserveItems,
} from './services';
import { sales, salesItems } from './sales';

export type SchemaType = {
  [key: string]: ReturnType<typeof pgTable>;
};
export const schema: SchemaType = {
  // EMS
  employee,

  roles,
  personalInformation,
  employmentInformation,

  // Company Feature
  department,
  designation,
  // Job Order
  jobOrder,
  reports,
  jobordertype,

  //Services
  reserve,
  reserveItems,

  borrow,
  borrowItems,

  sales,
  salesItems,

  payment,
  receipt,

  // Inventory
  product,
  category,
  supplier,
  order,
  orderItem,

  discount,
  discountCustomer,
  discountProducts,

  inquiry,
} as const;
