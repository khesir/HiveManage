import { pgTable } from 'drizzle-orm/pg-core';
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
  orderProduct,
  discount,
  discountCustomer,
  discountProducts,
} from './ims';
import {
  jobOrder,
  reports,
  jobOrderType,
  reserve,
  borrow,
  borrowItems,
  reserveItems,
} from './services';
import { sales, salesItems } from './sales';
import { payment, receipt } from './payment';
import { inquiry, customerGroup, customer } from './customer';

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
  jobOrderType,

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
  orderProduct,

  discount,
  discountCustomer,
  discountProducts,

  inquiry,
  customerGroup,
  customer,
} as const;
