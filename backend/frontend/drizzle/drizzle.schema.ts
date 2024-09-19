import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  mysqlEnum,
  date,
  float,
  decimal,
  boolean,
} from 'drizzle-orm/mysql-core';
// ===================== EMPLOYEE AND ITS INFORMATION INFORMATION =========================
export const employee = mysqlTable('employee', {
  employee_id: int('employee_id').primaryKey().autoincrement(),
  uuid: varchar('uuid', { length: 255 }),
  firstname: varchar('firstname', { length: 255 }),
  middlename: varchar('middlename', { length: 255 }),
  lastname: varchar('lastname', { length: 255 }),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Personal Information Table
export const personalInformation = mysqlTable('personal_info', {
  personal_information_id: int('personal_information_id')
    .primaryKey()
    .autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  birthday: varchar('birthday', { length: 255 }),
  gender: mysqlEnum('gender', ['Male', 'Female', 'Others']),
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
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Identification Financial Information Table
export const financialInformation = mysqlTable('financial_info', {
  financial_id: int('financial_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  pag_ibig_id: varchar('pag_ibig_id', { length: 255 }),
  sss_id: varchar('sss_id', { length: 255 }),
  philhealth_id: varchar('philhealth_id', { length: 255 }),
  tin: varchar('tin', { length: 255 }),
  bank_account_number: varchar('bank_account_number', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Salary Information Table
export const salaryInformation = mysqlTable('salary_info', {
  salary_information_id: int('salary_information_id')
    .primaryKey()
    .autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  payroll_frequency: mysqlEnum('payroll_frequency', [
    'Daily',
    'Weekly',
    'Bi Weekly',
    'Semi Monthly',
    'Monthly',
  ]),
  base_salary: int('base_salary'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Employment Information Table
export const employmentInformation = mysqlTable('employment_info', {
  employment_information_id: int('employment_information_id')
    .primaryKey()
    .autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  hireDate: timestamp('hireDate').defaultNow(),
  department_id: int('department_id').references(
    () => department.department_id,
  ),
  designation_id: int('designation_id').references(
    () => designation.designation_id,
  ),
  employee_type: mysqlEnum('employee_type', [
    'Regular',
    'Probationary',
    'Contractual',
    'Seasonal',
    'Temporary',
  ]),
  employee_status: mysqlEnum('employee_status', [
    'Active',
    'OnLeave',
    'Terminated',
    'Resigned',
    'Suspended',
    'Retired',
    'Inactive',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//  =======================================================================================
// =============================== COMPANY FEATURES ======================================

// Department Table
export const department = mysqlTable('department', {
  department_id: int('department_id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Designation Table
export const designation = mysqlTable('designation', {
  designation_id: int('designation_id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Activity Log Table
export const activityLog = mysqlTable('activity_log', {
  activity_id: int('activity_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  action: varchar('action', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  deleted_at: timestamp('deleted_at'),
});

export const leaveRequest = mysqlTable('leave_request', {
  leave_request_id: int('leave_request_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  title: varchar('title', { length: 255 }),
  content: varchar('content', { length: 255 }),
  date_of_leave: date('date_of_leave'),
  date_of_return: date('date_of_return'),
  status: varchar('status', { length: 255 }),
  comment: varchar('comment', { length: 255 }),
  leaveType: mysqlEnum('leaveType', [
    'Sick Leave',
    'Vacation Leave',
    'Personal Leave',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

export const leaveLimit = mysqlTable('leave_limit', {
  leave_limit_id: int('leave_limit_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  limit_count: int('limit_count'),
  leaveType: mysqlEnum('leaveType', [
    'Sick Leave',
    'Vacation Leave',
    'Personal Leave',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//  =======================================================================================
// ==================================== PAYROLL ===========================================

export const payroll = mysqlTable('payroll', {
  payroll_id: int('payroll_id').primaryKey().autoincrement(),
  start: date('start'),
  end: date('end'),
  pay_date: date('pay_date'),
  payroll_finished: date('payroll_finished'),
  status: mysqlEnum('approvalStatus', ['Active', 'Inactive', 'Inprogress']),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// On Payroll Table
export const onPayroll = mysqlTable('on_payroll', {
  on_payroll_id: int('on_payroll_id').primaryKey().autoincrement(),
  payroll_id: int('payroll_id').references(() => payroll.payroll_id),
  employee_id: int('employee_id').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Payroll Approval Table
export const payrollApproval = mysqlTable('payroll_approval', {
  payroll_approval_id: int('payroll_approval_id').primaryKey().autoincrement(),
  on_payroll_id: int('on_payroll_id').references(() => onPayroll.on_payroll_id),
  signatory_id: int('signatory_id').references(() => signatory.signatory_id),
  approval_status: mysqlEnum('approvalstatus', [
    'Approved',
    'Pending',
    'Rejected',
  ]),
  approval_date: date('approval_date'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Payroll Reports Table
export const payrollReports = mysqlTable('payroll_reports', {
  payroll_report: int('payroll_report').primaryKey().autoincrement(),
  on_payroll_id: int('on_payroll_id').references(() => onPayroll.on_payroll_id),
  netpay: float('netpay'),
  grosspay: float('grosspay'),
  total_deductions: float('total_deductions'),
  total_benefits: float('total_benefits'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Signatory Table
export const signatory = mysqlTable('signatory', {
  signatory_id: int('signatory_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  signatory_name: varchar('signatory_name', { length: 255 }),
  role: varchar('role', { length: 255 }),
  permission_level: int('permission_level'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//  =======================================================================================
// =============================== EMPLOYEE PERFORMANCE ===================================

// Deductions Table
export const deductions = mysqlTable('deductions', {
  deduction_id: int('deduction_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  start: date('start'),
  end: date('end'),
  deduction_type: varchar('deduction_type', { length: 255 }),
  amount: float('amount'),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Benefits Table
export const benefits = mysqlTable('benefits', {
  benefits_id: int('benefits_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  start: date('start'),
  end: date('end'),
  benefits_type: varchar('benefits_type', { length: 255 }),
  amount: float('amount'),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Adjustments Table
export const adjustments = mysqlTable('adjustments', {
  adjustments_id: int('adjustments_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  remarks: varchar('remarks', { length: 255 }),
  adjustments_type: varchar('adjustments_type', { length: 255 }),
  amount: float('amount'),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Additional Pay Table
export const additionalPay = mysqlTable('additional_pay', {
  additional_pay_id: int('additional_pay_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  additional_pay_type: varchar('additional_pay_type', { length: 255 }),
  amount: float('amount'),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

// Attendance Table
export const attendance = mysqlTable('attendance', {
  attendance_id: int('attendance_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  date: date('date'),
  clock_in: date('clock_in'),
  clock_out: date('clock_out'),
  hoursWorked: decimal('hoursWorked', { precision: 10, scale: 2 }),
  status: mysqlEnum('attendance_status', [
    'Present',
    'Absent',
    'Late',
    'Early Leave',
    'Paid Leave',
  ]),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});
//  =======================================================================================
// ===================================== JOB ORDER ======================================

//JobOrder
export const jobOrder = mysqlTable('joborder', {
  job_order_id: int('job_order_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  service_id: int('service_id').references(() => service.service_id),
  steps: varchar('steps', { length: 255 }),
  required_items: varchar('required_items', { length: 255 }),
  status: mysqlEnum('status', [
    'Pending',
    'In Progress',
    'Completed',
    'On Hold',
    'Cancelled',
    'Awaiting Approval',
    'Approved',
    'Rejected',
    'Closed',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//Reports
export const reports = mysqlTable('reports', {
  reports_id: int('reports_id').primaryKey().autoincrement(),
  job_order_id: int('job_order_id').references(() => jobOrder.job_order_id),
  remarks: varchar('remarks', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});
//  =======================================================================================
// ==================================== SERVICE ======================================

//Reserve
export const reserve = mysqlTable('reserve', {
  reserve_id: int('reserve_id').primaryKey().autoincrement(),
  sales_id: int('sales_id').references(() => sales.sales_id),
  service_id: int('service_id').references(() => service.service_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//Borrow
export const borrow = mysqlTable('borrow', {
  borrow_id: int('borrow_id').primaryKey().autoincrement(),
  sales_id: int('sales_id').references(() => sales.sales_id),
  service_id: int('service_id').references(() => service.service_id),
  item_id: int('item_id').references(() => item.item_id),
  borrow_date: date('borrow_date'),
  return_data: date('return_date'),
  status: mysqlEnum('status', [
    'Requested',
    'Approved',
    'Borrowed',
    'Returned',
    'Overdue',
    'Rejected',
    'Cancelled',
    'Lost',
    'Damaged',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//Service
export const service = mysqlTable('service', {
  service_id: int('service_id').primaryKey().autoincrement(),
  sales_id: int('sales_id').references(() => sales.sales_id),
  service_title: varchar('service_title', { length: 255 }),
  service_type: mysqlEnum('service_type', [
    'Repair',
    'Sell',
    'Buy',
    'Borrow',
    'Return',
    'Exchange',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//  =======================================================================================
// ==================================== SALES ======================================

//SalesItems
export const sales_items = mysqlTable('sales_items', {
  sales_items_id: int('sales_item_id').primaryKey().autoincrement(),
  sales_id: int('sales_id').references(() => sales.sales_id),
  item_id: int('item_id').references(() => item.item_id),
  quantity: int('quantity'),
  is_service_item: boolean('is_service_item'),
  total_price: decimal('total_price', { precision: 50, scale: 2 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//Sales
export const sales = mysqlTable('sales', {
  sales_id: int('sales_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  customer_id: int('customer_id').references(() => customer.customer_id),
  total_amount: decimal('total_price', { precision: 50, scale: 2 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//Payment

export const payment = mysqlTable('payment', {
  payment_id: int('payment_id').primaryKey().autoincrement(),
  sales_id: int('sales_id').references(() => sales.sales_id),
  amount: decimal('total_price', { precision: 50, scale: 2 }),
  payment_date: date('payment_date'),
  payment_method: mysqlEnum('payment_method', [
    'Cash',
    'Card',
    'Online Payment',
  ]),
  payment_status: mysqlEnum('payment_status', [
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
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//Receipt
export const receipt = mysqlTable('receipt', {
  receipt_id: int('receipt_id').primaryKey().autoincrement(),
  sales_id: int('sales_id').references(() => sales.sales_id),
  payment_id: int('payment_id').references(() => payment.payment_id),
  issued_date: date('issued_data'),
  total_amount: decimal('total_price', { precision: 50, scale: 2 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});
//  =======================================================================================
// =================================== INVENTORY ==========================================

//Item
export const item = mysqlTable('item', {
  item_id: int('item_id').primaryKey().autoincrement(),
  product_id: int('product_id').references(() => product.product_id),
  stock: float('stock'),
  re_order_level: float('re_order_level'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//Product
export const product = mysqlTable('product', {
  product_id: int('product_id').primaryKey().autoincrement(),
  category_id: int('category_id').references(() => category.category_id), // Ensure category.category_id exists
  supplier_id: int('supplier_id').references(() => supplier.supplier_id), // Ensure supplier.supplier_id exists
  name: varchar('name', { length: 255 }),
  description: varchar('description', { length: 255 }),
  price: decimal('price', { precision: 10, scale: 2 }), // Ensure scale is defined if needed
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//Category
export const category = mysqlTable('category', {
  category_id: int('category_id').primaryKey().autoincrement(), // Primary key with auto-increment
  name: varchar('name', { length: 255 }), // Category name, up to 255 characters
  content: varchar('content', { length: 255 }), // Additional information about the category, up to 255 characters
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});

//Supplier
export const supplier = mysqlTable('supplier', {
  supplier_id: int('supplier_id').primaryKey().autoincrement(), // Primary key with auto-increment
  name: varchar('name', { length: 255 }), // Supplier name, up to 255 characters
  contact_number: varchar('contact_number', { length: 255 }), // Supplier contact number, up to 255 characters
  remarks: varchar('remarks', { length: 255 }), // Additional remarks, up to 255 characters
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Order
export const order = mysqlTable('order', {
  order_id: int('order_id').primaryKey().autoincrement(), // Primary key with auto-increment
  product_id: int('product_id').references(() => product.product_id), // Foreign key reference to the product table
  items_ordered: int('items_ordered'), // Number of items ordered
  expected_arrival: date('expected_arrival'), // Expected arrival date
  status: mysqlEnum('status', [
    // Enum for order status
    'Pending',
    'Processing',
    'Delivered',
    'Cancelled',
    'Return',
    'Shipped',
  ]),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Arrived_Items
export const arrived_Items = mysqlTable('arrived_Items', {
  arrived_Items_id: int('arrived_Items_id').primaryKey().autoincrement(),
  order_id: int('order_id').references(() => order.order_id), // Foreign key reference to the order table
  filePath: varchar('filePath', { length: 255 }), // File path, up to 255 characters
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});
//  =======================================================================================
// =================================== Service ==========================================

//  =======================================================================================
// =================================== Customer ==========================================

//Channel Participants
export const participants = mysqlTable('participants', {
  participants_id: int('participants_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  channel_id: int('channel_id').references(() => channel.channel_id),
  is_private: boolean('is_private'),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Channel
export const channel = mysqlTable('channel', {
  channel_id: int('channel_id').primaryKey().autoincrement(),
  inquiry_id: int('inquiry_id').references(() => inquiry.inquiry_id),
  channel_name: varchar('channel_name', { length: 255 }),
  is_private: boolean('is_private'),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Message
export const message = mysqlTable('message', {
  message_id: int('message_id').primaryKey().autoincrement(),
  inquiry_id: int('inquiry_id').references(() => inquiry.inquiry_id),
  sender_id: int('sender_id'),
  sender_type: mysqlEnum('sender_type', [
    'User',
    'Admin',
    'Customer Support',
    'Supplier',
    'Employee',
    'Manager',
  ]),
  content: varchar('content', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Inquiry
export const inquiry = mysqlTable('inquiry', {
  inquiry_id: int('inquiry_id').primaryKey().autoincrement(),
  customer_id: int('customer_id').references(() => customer.customer_id),
  inquiryTitle: varchar('inquiryTitle', { length: 255 }),
  inquiry_type: mysqlEnum('sender_type', [
    'Product',
    'Pricing',
    'Order Status',
    'Technical Support',
    'Billing',
    'Complaint',
    'Feedback',
    'Return/Refund',
  ]),
  created_at: timestamp('created_at').defaultNow(), // Timestamp for creation
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(), // Timestamp for last update
  deleted_at: timestamp('deleted_at'), // Timestamp for deletion, nullable
});

//Customer
export const customer = mysqlTable('customer', {
  customer_id: int('customer_id').primaryKey().autoincrement(),
  firstname: varchar('firstname', { length: 255 }),
  lastname: varchar('lastname', { length: 255 }),
  contact_phone: varchar('contact_phone', { length: 255 }),
  socials: varchar('socials', { length: 255 }),
  address_line: varchar('address_line', { length: 255 }),
  barangay: varchar('barangay', { length: 255 }),
  province: varchar('province', { length: 255 }),
  standing: mysqlEnum('standing', [
    'Active',
    'Inactive',
    'Pending',
    'Suspended',
    'Banned',
    'VIP',
    'Delinquent',
    'Prospect',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
  deleted_at: timestamp('deleted_at'),
});
//  =======================================================================================
// =================================== PARTORDER ==========================================
