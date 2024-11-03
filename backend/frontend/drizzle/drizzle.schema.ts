import {
  boolean,
  date,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

//=========================================================================================
//========================================= ENUMS =======================================
export const payrollFrequencyEnum = pgEnum('payroll_frequency', [
  'Daily',
  'Weekly',
  'Bi Weekly',
  'Semi Monthly',
  'Monthly',
]);
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
export const leaveRequestTypeEnum = pgEnum('leave_request_type', [
  'Sick Leave',
  'Vacation Leave',
  'Personal Leave',
]);

export const leaveLimitTypeEnum = pgEnum('leave_limit_type', [
  'Sick Leave',
  'Vacation Leave',
  'Personal Leave',
]);
export const payrollStatusEnum = pgEnum('payroll_status', [
  'Active',
  'Inactive',
  'Inprogress',
]);

export const approvalStatusEnum = pgEnum('approval_status', [
  'Approved',
  'Pending',
  'Rejected',
]);

export const attendanceStatusEnum = pgEnum('attendance_status', [
  'Present',
  'Absent',
  'Late',
  'Early Leave',
  'Paid Leave',
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
export const senderTypeEnum = pgEnum('sender_type', [
  'User',
  'Admin',
  'Customer Support',
  'Supplier',
  'Employee',
  'Manager',
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

export const TagItemEnu = pgEnum('tag_item', ['New', 'Used', 'Broken']);

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

export const TagItemEnum = pgEnum('tag_item', ['New', 'Used', 'Broken']);

export const TagEnum = pgEnum('tag_supplier', [
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
// ===================== EMPLOYEE AND ITS INFORMATION INFORMATION =========================
export const employee = pgTable('employee', {
  employee_id: serial('employee_id').primaryKey(),
  employee_role_id: integer('employee_role_id').references(
    () => employee_role.employee_role_id,
  ),
  firstname: varchar('firstname', { length: 255 }),
  middlename: varchar('middlename', { length: 255 }),
  lastname: varchar('lastname', { length: 255 }),
  email: varchar('email', { length: 255 }),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Employee Role
export const employee_role = pgTable('employee_role', {
  employee_role_id: serial('employee_role_id').primaryKey(),
  name: varchar('name', { length: 255 }),
  access_level: integer('access_level'),
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
  gender: genderEnum('gender'),
  phone: varchar('phone', { length: 255 }),
  email: varchar('email', { length: 255 }),
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

// Identification Financial Information Table
export const financialInformation = pgTable('financial_info', {
  financial_id: serial('financial_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  pag_ibig_id: varchar('pag_ibig_id', { length: 255 }),
  sss_id: varchar('sss_id', { length: 255 }),
  philhealth_id: varchar('philhealth_id', { length: 255 }),
  tin: varchar('tin', { length: 255 }),
  bank_account_number: varchar('bank_account_number', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Salary Information Table
export const salaryInformation = pgTable('salary_info', {
  salary_information_id: serial('salary_information_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  payroll_frequency: payrollFrequencyEnum('payroll_frequency').notNull(),
  base_salary: integer('base_salary'),
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
  hireDate: timestamp('hireDate').defaultNow(),
  department_id: integer('department_id').references(
    () => department.department_id,
  ),
  designation_id: integer('designation_id').references(
    () => designation.designation_id,
  ),
  employee_type: employeeTypeEnum('employee_type').notNull(),
  employee_status: employeeStatusEnum('employee_status').notNull(),
  message: varchar('message', { length: 255 }),
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

export const leaveRequest = pgTable('leave_request', {
  leave_request_id: serial('leave_request_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  title: varchar('title', { length: 255 }),
  content: varchar('content', { length: 255 }),
  date_of_leave: varchar('date_of_leave'),
  date_of_return: varchar('date_of_return'),
  status: varchar('status', { length: 255 }),
  comment: varchar('comment', { length: 255 }),
  leaveType: leaveRequestTypeEnum('leave_request_type').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const leaveLimit = pgTable('leave_limit', {
  leave_limit_id: serial('leave_limit_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  limit_count: real('limit_count').default(10.1),
  leaveType: leaveLimitTypeEnum('leave_limit_type').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//  =======================================================================================
// ==================================== PAYROLL ===========================================

export const payroll = pgTable('payroll', {
  payroll_id: serial('payroll_id').primaryKey(),
  start: varchar('start'),
  end: varchar('end'),
  pay_date: varchar('pay_date'),
  payroll_finished: varchar('payroll_finished'),
  signatory_id: integer('signatory_id').references(
    () => signatory.signatory_id,
  ),
  status: payrollStatusEnum('payroll_status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// On Payroll Table
export const onPayroll = pgTable('on_payroll', {
  on_payroll_id: serial('on_payroll_id').primaryKey(),
  payroll_id: integer('payroll_id').references(() => payroll.payroll_id),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Payroll Approval Table
export const payrollApproval = pgTable('payroll_approval', {
  payroll_approval_id: serial('payroll_approval_id').primaryKey(),
  on_payroll_id: integer('on_payroll_id').references(
    () => onPayroll.on_payroll_id,
  ),
  approval_status: approvalStatusEnum('approval_status').notNull(),
  approval_date: varchar('approval_date'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Payroll Reports Table
export const payrollReports = pgTable('payroll_reports', {
  payroll_report: serial('payroll_report').primaryKey(),
  on_payroll_id: integer('on_payroll_id').references(
    () => onPayroll.on_payroll_id,
  ),
  netpay: real('netpay'),
  grosspay: real('grosspay'),
  total_deductions: real('total_deductions'),
  total_benefits: real('total_benefits'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Signatory Table
export const signatory = pgTable('signatory', {
  signatory_id: serial('signatory_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  signatory_name: varchar('signatory_name', { length: 255 }),
  role: varchar('role', { length: 255 }),
  permission_level: integer('permission_level'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//  =======================================================================================
// =============================== EMPLOYEE PERFORMANCE ===================================

// Deductions Table
export const deductions = pgTable('deductions', {
  deduction_id: serial('deduction_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  name: varchar('name', { length: 255 }),
  start: varchar('start'),
  end: varchar('end'),
  frequency: varchar('frequency'),
  deduction_type: varchar('deduction_type', { length: 255 }),
  amount: real('amount'),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Benefits Table
export const benefits = pgTable('benefits', {
  benefits_id: serial('benefits_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  name: varchar('name', { length: 255 }),
  start: date('start'),
  end: date('end'),
  frequency: varchar('frequency'),
  benefits_type: varchar('benefits_type', { length: 255 }),
  amount: real('amount'),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Adjustments Table
export const adjustments = pgTable('adjustments', {
  adjustments_id: serial('adjustments_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  name: varchar('name', { length: 255 }),
  remarks: varchar('remarks', { length: 255 }),
  adjustments_type: varchar('adjustments_type', { length: 255 }),
  amount: real('amount'),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Additional Pay Table
export const additionalPay = pgTable('additional_pay', {
  additional_pay_id: serial('additional_pay_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  name: varchar('name', { length: 255 }),
  additional_pay_type: varchar('additional_pay_type', { length: 255 }),
  amount: real('amount'),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

// Attendance Table
export const attendance = pgTable('attendance', {
  attendance_id: serial('attendance_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  date: varchar('date'),
  clock_in: varchar('clock_in'),
  clock_out: varchar('clock_out'),
  hoursWorked: real('hoursWorked'),
  status: attendanceStatusEnum('attendance_status').notNull(),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
//  =======================================================================================
// ===================================== JOB ORDER ======================================

//JobOrder
export const jobOrder = pgTable('joborder', {
  job_order_id: serial('job_order_id').primaryKey(),
  joborder_type_id: integer('joborder_type_id').references(
    () => jobordertype.joborder_type_id,
  ),
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
  fee: integer('fee'),
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
  item_id: integer('item_id').references(() => item.item_id),
  remark_id: integer('remark_id').references(() => remarktickets.remark_id),
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
  items_id: integer('item_id').references(() => item.item_id),
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
  item_id: integer('item_id').references(() => item.item_id),
  service_id: integer('service_id').references(() => service.service_id),
  quantity: integer('quantity'),
  sales_item_type: salesitemTypeEnum('sales_item_type').notNull(),
  total_price: decimal('total_price', { precision: 50, scale: 2 }),
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

//Item
export const item = pgTable('item', {
  item_id: serial('item_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  stock: integer('stock'),
  price: decimal('price', { precision: 10, scale: 2 }),
  on_listing: boolean('on_listing'),
  re_order_level: integer('re_order_level'),
  tag: TagItemEnu('tag'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Item Supplier
export const inventory_record = pgTable('inventory_record', {
  inventory_record_id: serial('inventory_record_id').primaryKey(),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  item_id: integer('item_id').references(() => item.item_id),
  tag: TagEnum('tag').notNull(),
  stock: integer('stock'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Price History
export const price_history = pgTable('price_history', {
  price_history_id: serial('price_history_id').primaryKey(),
  item_id: integer('item_id').references(() => item.item_id),
  price: decimal('price', { precision: 10, scale: 2 }),
  change_date: timestamp('change_date').defaultNow(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

export const stocksLogs = pgTable('stock_logs', {
  stock_log_id: serial('stock_logs_id').primaryKey(),
  item_id: integer('item_id').references(() => item.item_id),
  quantity: integer('quantity'),
  movement_type: varchar('movement_type'),
  action: varchar('action'),
  created_at: timestamp('created_at').defaultNow(),
});

//Product
export const product = pgTable('product', {
  product_id: serial('product_id').primaryKey(),
  category_id: integer('category_id').references(() => category.category_id), // Ensure category.category_id exists
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id), // Ensure supplier.supplier_id exists
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  price: real('price'), // Ensure scale is defined if needed
  img_url: varchar('img_url'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Product Attachment
export const product_attachment = pgTable('product_attachment', {
  product_attachment_id: serial('product_attachment_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id), // Ensure supplier.supplier_id exists
  filePath: varchar('filePath', { length: 255 }), // File path, up to 255 characters
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Product
export const product_category = pgTable('product_category', {
  product_category_id: serial('product_category_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id), // Ensure category.category_id exists
  category_id: integer('category_id').references(() => category.category_id), // Ensure supplier.supplier_id exists
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});

//Category
export const category = pgTable('category', {
  category_id: serial('category_id').primaryKey(), // Primary key with auto-increment
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
  supplier_id: serial('supplier_id').primaryKey(), // Primary key with auto-increment
  name: varchar('name', { length: 255 }), // Supplier name, up to 255 characters
  contact_number: varchar('contact_number', { length: 255 }), // Supplier contact number, up to 255 characters
  remarks: varchar('remarks', { length: 255 }), // Additional remarks, up to 255 characters
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Order
export const order = pgTable('order', {
  order_id: serial('order_id').primaryKey(), // Primary key with auto-increment
  product_id: integer('product_id').references(() => product.product_id), // Foreign key reference to the product table
  items_ordered: integer('items_ordered'), // Number of items ordered
  expected_arrival: varchar('expected_arrival'), // Expected arrival date
  status: orderStatusEnum('order_status').notNull(),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Order Item
export const orderItem = pgTable('orderItem', {
  orderItem_id: serial('orderItem_id').primaryKey(),
  order_id: integer('order_id').references(() => order.order_id),
  product_id: integer('product_id').references(() => product.product_id),
  quantity: integer('quantity'),
  price: decimal('price', { precision: 50, scale: 2 }),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Arrived_Items
export const arrived_Items = pgTable('arrived_items', {
  arrived_Items_id: serial('arrived_Items_id').primaryKey(),
  order_id: integer('order_id').references(() => order.order_id), // Foreign key reference to the order table
  filePath: varchar('filePath', { length: 255 }), // File path, up to 255 characters
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});
//  =======================================================================================
// =================================== Service ==========================================

//  =======================================================================================
// =================================== Customer ==========================================

//Channel Participants
export const participants = pgTable('participants', {
  participants_id: serial('participants_id').primaryKey(),
  employee_id: integer('employee_id').references(() => employee.employee_id),
  channel_id: integer('channel_id').references(() => channel.channel_id),
  is_private: boolean('is_private'),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Channel
export const channel = pgTable('channel', {
  channel_id: serial('channel_id').primaryKey(),
  inquiry_id: integer('inquiry_id').references(() => inquiry.inquiry_id),
  channel_name: varchar('channel_name', { length: 255 }),
  is_private: boolean('is_private'),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Message
export const message = pgTable('message', {
  message_id: serial('message_id').primaryKey(),
  inquiry_id: integer('inquiry_id').references(() => inquiry.inquiry_id),
  sender_id: integer('sender_id'),
  sender_type: senderTypeEnum('sender_type').notNull(),
  content: varchar('content', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

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
  employee_role,
  personalInformation,
  financialInformation,
  salaryInformation,
  employmentInformation,

  // Company Feature
  department,
  designation,
  auditLog,
  leaveLimit,
  leaveRequest,

  // Payroll
  payroll,
  onPayroll,
  payrollApproval,
  signatory,
  payrollReports,

  // Performance Tracker
  deductions,
  benefits,
  adjustments,
  additionalPay,
  attendance,

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
  item,
  stocksLogs,
  product,
  product_attachment,
  category,
  supplier,
  order,
  orderItem,
  arrived_Items,
  inventory_record,
  price_history,
  product_category,

  // Chat System and Inquiry
  participants,
  channel,
  customer,
  inquiry,
  message,
} as const;
