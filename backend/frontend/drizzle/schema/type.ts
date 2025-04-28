import { pgTable } from 'drizzle-orm/pg-core';
import {
  employee,
  roles,
  personalInformation,
  employmentInformation,
  department,
  designation,
} from './ems';
import { product, category, supplier, order, orderProduct } from './ims';
import {
  tickets,
  ticketType,
  service,
  service_Type,
  assignedEmployees,
} from './services';
import { sales, salesItems } from './sales';
import { payment } from './payment';
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
  service,
  service_Type,
  tickets,
  ticketType,
  assignedEmployees,

  sales,
  salesItems,

  payment,

  // Inventory
  product,
  category,
  supplier,
  order,
  orderProduct,

  inquiry,
  customerGroup,
  customer,
} as const;
