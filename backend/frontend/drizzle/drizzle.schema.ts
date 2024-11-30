import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

//=========================================================================================
//========================================= ENUMS =======================================

export const employeeTypeEnum = pgEnum('employee_type', [
  'Regular',
  'Probationary',
  'Contractual',
  'Seasonal',
  'Temporary',
]);
export const employeeStatusEnum = pgEnum('employee_status', [
  'Active',
  'OnLeave',
  'Terminated',
  'Resigned',
  'Suspended',
  'Retired',
  'Inactive',
]);

export const jobOrderStatusEnum = pgEnum('joborder_status', [
  'Pending',
  'In Progress',
  'Completed',
  'On Hold',
  'Cancelled',
  'Awaiting Approval',
  'Approved',
  'Rejected',
  'Closed',
]);

export const borrowStatusEnum = pgEnum('borrow_status', [
  'Requested',
  'Approved',
  'Borrowed',
  'Returned',
  'Overdue',
  'Rejected',
  'Cancelled',
  'Lost',
  'Damaged',
]);

export const serviceStatus = pgEnum('service_status', ['Active', 'Inactive']);
export const paymentStatusEnum = pgEnum('payment_status', [
  'Pending',
  'Completed',
  'Failed',
  'Cancelled',
  'Refunded',
  'Partially Refunded',
  'Overdue',
  'Processing',
  'Declined',
  'Authorized',
]);
export const orderStatusEnum = pgEnum('order_status', [
  'Pending',
  'Processing',
  'Delivered',
  'Cancelled',
  'Return',
  'Shipped',
]);
export const paymentMethodEnum = pgEnum('payment_method', [
  'Cash',
  'Card',
  'Online Payment',
]);

export const inquiryTypeEnum = pgEnum('inquiry_type', [
  'Product',
  'Pricing',
  'Order Status',
  'Technical Support',
  'Billing',
  'Complaint',
  'Feedback',
  'Return/Refund',
]);
export const customerStandingEnum = pgEnum('standing', [
  'Active',
  'Inactive',
  'Pending',
  'Suspended',
  'Banned',
  'VIP',
  'Delinquent',
  'Prospect',
]);
export const genderEnum = pgEnum('gender', ['Male', 'Female', 'Others']);

export const conditionItemEnu = pgEnum('condition_item', [
  'New',
  'Used',
  'Broken',
]);

export const remarktickets_status = pgEnum('remarktickets_status', [
  'Open',
  'In Progress',
  'Resolved',
  'Closed',
  'Pending',
  'Rejected',
]);

export const salesitemTypeEnum = pgEnum('salesitemTypeEnum', [
  'Sales',
  'Joborder',
  'Borrow',
  'Purchase',
  'Exchange',
]);

export const joborderTypeStatusEnum = pgEnum('joborderTypeStatusEnum', [
  'Available',
  'Not Available',
]);

export const reserveStatusEnum = pgEnum('reserveStatusEnum', [
  'Reserved',
  'Confirmed',
  'Cancelled',
  'Pending',
  'Completed',
]);

export const salesItemStatusEnum = pgEnum('salesItemStatusEnum', [
  'Available',
  'Out of Stock',
  'Discontinued',
  'Pending',
  'Sold',
]);

export const entityTypeEnum = pgEnum('entityTypeEnums', [
  'Employee',
  'JobOrder',
  'Sales',
  'Service',
  'Inventory',
  'Order',
]);

export const conditionItemEnum = pgEnum('condition_item', [
  'New',
  'Used',
  'Broken',
]);

export const conditionEnum = pgEnum('condition_supplier', [
  'Active',
  'Inactive',
  'Pending Approval',
  'Verified',
  'Unverified',
  'Suspended',
  'Preferred',
  'Blacklisted',
  'Under Review',
  'Archived',
]);

export const itemTypeEnum = pgEnum('item_type', ['Batch', 'Serialized']);

export const itemConditionsEnum = pgEnum('item_condition', [
  'New',
  'Old',
  'Damage',
  'Refurbished',
  'Used',
  'Antique',
  'Repaired',
]);

export const itemStatusEnum = pgEnum('item_status', [
  'On Stock',
  'Sold',
  'Depleted',
]);

// ===================== EMPLOYEE AND ITS INFORMATION INFORMATION =========================
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

// Roles
export const roles = pgTable('roles', {
  role_id: serial('role_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const position = pgTable('position', {
  position_id: serial('position_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Employee Roles
export const employee_roles = pgTable('employee_roles', {
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

// Personal Information Table
export const personalInformation = pgTable('personal_info', {
  personal_information_id: serial('personal_information_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  birthday: varchar('birthday', { length: 255 }),
  sex: varchar('sex'),
  phone: varchar('phone', { length: 255 }),
  address_line: varchar('address_line', { length: 255 }),
  postal_code: varchar('postal_code', { length: 255 }),
  emergency_contact_name: varchar('emergency_contact_name', { length: 255 }),
  emergency_contact_phone: varchar('emergency_contact_phone', { length: 255 }),
  emergency_contact_relationship: varchar('emergency_contact_relationship', {
    length: 255,
  }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Employment Information Table
export const employmentInformation = pgTable('employment_info', {
  employment_information_id: serial('employment_information_id').primaryKey(),
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

//  =======================================================================================
// =============================== COMPANY FEATURES ======================================

// Department Table
export const department = pgTable('department', {
  department_id: serial('department_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Designation Table
export const designation = pgTable('designation', {
  designation_id: serial('designation_id').primaryKey(),
  title: varchar('title', { length: 255 }),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Audit Log Table
export const auditLog = pgTable('auditLog', {
  auditlog_id: serial('auditlog_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  entity_id: integer('entity_id'),
  entity_type: entityTypeEnum('entity_type').notNull(),
  action: varchar('action', { length: 255 }),
  change: jsonb('change'),
  created_at: timestamp('created_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
});

//  =======================================================================================
// ===================================== JOB ORDER ======================================

//JobOrder
export const jobOrder = pgTable('joborder', {
  job_order_id: serial('job_order_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  uuid: varchar('uuid', { length: 255 }),
  fee: integer('fee'),
  joborder_status: jobOrderStatusEnum('joborder_status').notNull(),
  total_cost_price: real('total_cost_price'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Reports
export const reports = pgTable('reports', {
  reports_id: serial('reports_id').primaryKey(),
  job_order_id: integer('job_order_id').references(() => jobOrder.job_order_id),
  reports_title: varchar('reports_title', { length: 255 }),
  remarks: varchar('remarks', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Job Order Type
export const jobordertype = pgTable('jobordertype', {
  joborder_type_id: serial('joborder_type_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  joborder_types_status: varchar('status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Job Order Services
export const joborder_services = pgTable('joborder_services', {
  joborder_services_id: serial('joservices_id').primaryKey(),
  joborder_types_id: integer('jotypes_id').references(
    () => jobordertype.joborder_type_id,
  ),
  job_order_id: integer('job_order_id').references(() => jobOrder.job_order_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Assigned Employees
export const assignedemployees = pgTable('assignedemployees', {
  assigned_employee_id: serial('assigned_employee_id').primaryKey(),
  job_order_id: integer('job_order_id').references(() => jobOrder.job_order_id),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  assigned_by: varchar('assigned_by', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Remark Tickets
export const remarktickets = pgTable('remarktickets', {
  remark_id: serial('remark_id').primaryKey(),
  remark_type_id: integer('remark_type_id').references(
    () => remarktype.remark_type_id,
  ),
  job_order_id: integer('job_order_id').references(() => jobOrder.job_order_id),
  title: varchar('title'),
  description: varchar('description', { length: 255 }),
  content: integer('content').references(() => remarkcontent.remarkcontent_id),
  remarktickets_status: remarktickets_status('remarktickets_status').notNull(),
  created_by: integer('created_by').references(() => employee.employee_id),
  deadline: varchar('deadline'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Remark Items
export const remarkitems = pgTable('remarkitems', {
  remark_items_id: serial('remark_items_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  remark_id: integer('remark_id').references(() => remarktickets.remark_id),
  remark_status: varchar('remark_status'),
  quantity: real('quantity'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Remark Reports
export const remarkreports = pgTable('remarkreports', {
  remark_reports_id: serial('remark_reports_id').primaryKey(),
  reports_id: integer('reports_id').references(() => reports.reports_id),
  remark_id: integer('remark_id').references(() => remarktickets.remark_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Remark Type
export const remarktype = pgTable('remarktype', {
  remark_type_id: serial('remark_type_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Remark Assigned
export const remarkassigned = pgTable('remarkassigned', {
  remarkassigned_id: serial('remarkassigned_id').primaryKey(),
  remark_id: integer('remark_id').references(() => remarktickets.remark_id),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Remark Content
export const remarkcontent = pgTable('remarkcontent', {
  remarkcontent_id: serial('remarkcontent_id').primaryKey(),
  name: varchar('name'),
  markdown: varchar('markdown'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
//  =======================================================================================
// ==================================== SERVICE ======================================

//Reserve
export const reserve = pgTable('reserve', {
  reserve_id: serial('reserve_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  product_id: integer('product_id').references(() => product.product_id),
  reserve_status: reserveStatusEnum('reserve_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Borrow
export const borrow = pgTable('borrow', {
  borrow_id: serial('borrow_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  sales_item_id: integer('sales_item_id').references(
    () => sales_items.sales_items_id,
  ),
  borrow_date: varchar('borrow_date'),
  return_date: varchar('return_date'),
  fee: integer('fee'),
  status: borrowStatusEnum('borrow_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Service
export const service = pgTable('service', {
  service_id: serial('service_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  service_title: varchar('service_title', { length: 255 }),
  service_description: varchar('service_description', { length: 255 }),
  service_status: serviceStatus('service_status'),
  has_reservation: boolean('has_reservation'),
  has_sales_item: boolean('has_sales_item'),
  has_borrow: boolean('has_borrow'),
  has_job_order: boolean('has_job_order'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//SalesItems
export const sales_items = pgTable('sales_items', {
  sales_items_id: serial('sales_item_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  service_id: integer('service_id').references(() => service.service_id),
  quantity: integer('quantity'),
  sales_item_type: salesitemTypeEnum('sales_item_type').notNull(),
  total_price: real('total_price'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Payment
export const payment = pgTable('payment', {
  payment_id: serial('payment_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  amount: real('total_price'),
  payment_date: varchar('payment_date'),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  payment_status: paymentStatusEnum('payment_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Receipt
export const receipt = pgTable('receipt', {
  receipt_id: serial('receipt_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  payment_id: integer('payment_id').references(() => payment.payment_id),
  issued_date: varchar('issued_data'),
  total_amount: real('total_price'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//  =======================================================================================
// =================================== INVENTORY ==========================================

//Product
export const product = pgTable('product', {
  product_id: serial('product_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  img_url: varchar('img_url'),
  stock_limit: integer('stock_limit'),
  total_stock: integer('total_stock').default(0),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Product Variant Supplier
export const prdvariantsupp = pgTable('prdvariantsupp', {
  prdvariantsupp_id: serial('prdvariantsupp_id').primaryKey(),
  variant_id: integer('variants_id').references(() => variant.variant_id),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  supply_price: real('supplier_price').default(0),
  minimum_order_quan: integer('minimum_order_quan').default(0),
  lead_time_days: varchar('lead_time_days').default('1 days'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Product Variant
export const variant = pgTable('variant', {
  variant_id: serial('variant_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  img_url: varchar('img_url'),
  variant_name: varchar('variant_name'),
  attribute: jsonb('attribute'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
// Inventory Record
export const item_record = pgTable('item_record', {
  item_record_id: serial('item_record_id').primaryKey(),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  product_id: integer('product_id').references(() => product.product_id),
  ordered_qty: integer('ordered_qty').default(0),
  total_stock: integer('stock').default(0),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const item = pgTable('item', {
  item_id: serial('item_id').primaryKey(),
  item_record_id: integer('item_record_id').references(
    () => item_record.item_record_id,
  ),
  variant_id: integer('variant_id').references(() => variant.variant_id),
  item_type: varchar('item_type').notNull(),
  item_status: varchar('item_status').notNull(),
  ordered_qty: integer('ordered_qty').default(0),
  quantity: integer('quantity').default(0),
  reorder_level: integer('reorder_level').default(0),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const batchItems = pgTable('batch_items', {
  batch_item_id: serial('batch_item_id').primaryKey(),
  item_id: integer('item_id').references(() => item.item_id),
  batch_number: varchar('batch_number').notNull(),
  condition: varchar('condition').notNull(),
  status: varchar('status').notNull(),
  quantity: integer('quantity').default(0),
  reserved_quantity: integer('reserved_quantity').default(0),
  pending_quantity: integer('pending_quantity').default(0),
  unit_price: integer('unit_price').default(0),
  selling_price: integer('selling_price').default(0),
  production_date: varchar('production_date'),
  expiration_date: varchar('expiration_date'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const serializeItems = pgTable('serialized_items', {
  serialized_item_id: serial('batch_item_id').primaryKey(),
  item_id: integer('item_id').references(() => item.item_id),
  serial_number: varchar('serial_number').notNull(),
  condition: varchar('condition').notNull(),
  status: varchar('status').notNull(),
  unit_price: integer('unit_price').default(0),
  selling_price: integer('selling_price').default(0),
  warranty_expiry_date: varchar('warranty_expiry_date'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const stocksLogs = pgTable('stock_logs', {
  stock_log_id: serial('stock_logs_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  quantity: integer('quantity'),
  movement_type: varchar('movement_type'),
  action: varchar('action'),
  created_at: timestamp('created_at').defaultNow(),
});

//Product
export const product_category = pgTable('product_category', {
  product_category_id: serial('product_category_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  category_id: integer('category_id').references(() => category.category_id),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Category
export const category = pgTable('category', {
  category_id: serial('category_id').primaryKey(),
  name: varchar('name', { length: 255 }), // Category name, up to 255 characters
  content: varchar('content', { length: 255 }), // Additional information about the category, up to 255 characters
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Supplier
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

//Order
export const order = pgTable('order', {
  order_id: serial('order_id').primaryKey(),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  ordered_value: integer('ordered_value'),
  expected_arrival: varchar('expected_arrival'),
  status: varchar('status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const orderLogs = pgTable('orderLogs', {
  order_logs_id: serial('order_logs_id').primaryKey(),
  order_id: integer('order_id').references(() => order.order_id),
  title: varchar('title'),
  message: varchar('message'),
  create_at: timestamp('created_at').defaultNow(),
});

export const orderItemTracking = pgTable('orderItemTracking', {
  tracking_id: serial('tracking_id').primaryKey(),
  orderItem_id: integer('orderItem_id')
    .references(() => orderItem.orderItem_id)
    .notNull(),
  condition: varchar('condition'),
  status: varchar('status'),
  quantity: integer('quantity').notNull(),
  isStocked: boolean('isStocked').default(false),
  remarks: text('remarks'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

//Order Item
export const orderItem = pgTable('orderItem', {
  orderItem_id: serial('orderItem_id').primaryKey(),
  order_id: integer('order_id').references(() => order.order_id),
  variant_id: integer('variant_id').references(() => variant.variant_id),
  quantity: integer('quantity').default(1),
  item_type: varchar('item_type').notNull(),
  price: decimal('price', { precision: 50, scale: 2 }),
  status: varchar('status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
//  =======================================================================================
// =================================== Service ==========================================

//  =======================================================================================
// =================================== Customer ==========================================

//Inquiry
export const inquiry = pgTable('inquiry', {
  inquiry_id: serial('inquiry_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  inquiryTitle: varchar('inquiryTitle', { length: 255 }),
  inquiry_type: inquiryTypeEnum('inquiry_type').notNull(),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), //111111111111111111111111111111 Timestamp for deletion, nullable
});

//Customer
export const customer = pgTable('customer', {
  customer_id: serial('customer_id').primaryKey(),
  firstname: varchar('firstname', { length: 255 }),
  middlename: varchar('middlename', { length: 255 }),
  lastname: varchar('lastname', { length: 255 }),
  contact_phone: varchar('contact_phone', { length: 255 }),
  socials: jsonb('socials').default([]),
  address_line: varchar('address_line', { length: 255 }),
  barangay: varchar('barangay', { length: 255 }),
  province: varchar('province', { length: 255 }),
  email: varchar('email', { length: 255 }),
  standing: customerStandingEnum('standing').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//  =======================================================================================
// =================================== PARTORDER ==========================================

// ===================================Query Schema ========================================
export type SchemaType = {
  [key: string]: ReturnType<typeof pgTable>;
};
export const schema: SchemaType = {
  // EMS
  employee,
  employee_roles,
  roles,
  personalInformation,
  employmentInformation,

  // Company Feature
  department,
  designation,
  auditLog,
  // Job Order
  jobOrder,
  reports,
  jobordertype,
  joborder_services,
  assignedemployees,
  remarktickets,
  remarktype,
  remarkitems,
  remarkreports,
  remarkassigned,
  remarkcontent,

  //Services
  reserve,
  borrow,
  service,
  sales_items,
  payment,
  receipt,

  // Inventory
  stocksLogs,
  product,
  prdvariantsupp,
  variant,
  category,
  supplier,
  order,
  orderItem,
  item,
  item_record,
  product_category,

  inquiry,
} as const;
