import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  mysqlEnum,
  date,
  float,
  decimal,
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
});

// Personal Information Table
export const personalInformation = mysqlTable('personal_information', {
  personal_information_id: int('personal_information_id')
    .primaryKey()
    .autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  birthday: varchar('birthday', { length: 255 }),
  gender: mysqlEnum('gender', ['male', 'female', 'others']),
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
});

// Identification Financial Information Table
export const financialInformation = mysqlTable('financial_information', {
  financial_id: int('financial_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  pag_ibig_id: varchar('pag_ibig_id', { length: 255 }),
  sss_id: varchar('sss_id', { length: 255 }),
  philhealth_id: varchar('philhealth_id', { length: 255 }),
  tin: varchar('tin', { length: 255 }),
  bank_account_number: varchar('bank_account_number', { length: 255 }),
});

// Salary Information Table
export const salaryInformation = mysqlTable('salary_information', {
  salary_information_id: int('salary_information_id')
    .primaryKey()
    .autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  payroll_frequency: mysqlEnum('payroll_frequency', [
    'daily',
    'weekly',
    'biWeekly',
    'semiMonthly',
    'monthly',
  ]),
  base_salary: int('base_salary'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
});

// Employment Information Table
export const employmentInformation = mysqlTable('employment_information', {
  employment_information_id: int('employment_information_id')
    .primaryKey()
    .autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  hireDate: timestamp('hireDate').defaultNow(),
  department_id: int('department_id'),
  designation_id: int('designation_id'),
  employee_type: mysqlEnum('employee_type', [
    'regular',
    'probationary',
    'contractual',
    'seasonal',
    'temporary',
  ]),
  employee_status: mysqlEnum('employee_status', [
    'active',
    'onLeave',
    'terminated',
    'resigned',
    'suspended',
    'retired',
    'inactive',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
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
});

// Designation Table
export const designation = mysqlTable('designation', {
  designation_id: int('designation_id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }),
  status: varchar('status', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
});

// Activity Log Table
export const activityLog = mysqlTable('activity_log', {
  activity_id: int('activity_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  action: varchar('action', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
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
    'sick_leave',
    'vacation_leave',
    'personal_leave',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
});

export const leaveLimit = mysqlTable('leave_limit', {
  leave_limit_id: int('leave_limit_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id),
  limit_count: int('limit_count'),
  leaveType: mysqlEnum('leaveType', [
    'sick_leave',
    'vacation_leave',
    'personal_leave',
  ]),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
});

//  =======================================================================================
// ==================================== PAYROLL ===========================================

export const payroll = mysqlTable('payroll', {
  payroll_id: int('payroll_id').primaryKey().autoincrement(),
  start: date('start'),
  end: date('end'),
  pay_date: date('pay_date'),
  payroll_finished: date('payroll_finished'),
  status: mysqlEnum('approvalStatus', ['active', 'inactive', 'inprogress']),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
});

// On Payroll Table
export const onPayroll = mysqlTable('on_payroll', {
  on_payroll_id: int('on_payroll_id').primaryKey().autoincrement(),
  payroll_id: int('payroll_id').references(() => payroll.payroll_id),
  employee_id: int('employee_id').references(() => employee.employee_id),
});

// Payroll Approval Table
export const payrollApproval = mysqlTable('payroll_approval', {
  payroll_approval_id: int('payroll_approval_id').primaryKey().autoincrement(),
  on_payroll_id: int('on_payroll_id').references(() => onPayroll.on_payroll_id),
  signatory_id: int('signatory_id').references(() => signatory.signatory_id),
  approval_status: mysqlEnum('approvalstatus', [
    'approved',
    'pending',
    'rejected',
  ]),
  approval_date: date('approval_date'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
});

// Payroll Reports Table
export const payrollReports = mysqlTable('payroll_reports', {
  payroll_report: int('payroll_report').primaryKey().autoincrement(),
  on_payroll_id: int('on_payroll_id').references(() => onPayroll.on_payroll_id),
  netpay: float('netpay'),
  grosspay: float('grosspay'),
  total_deductions: float('total_deductions'),
  total_benefits: float('total_benefits'),
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
    'present',
    'absent',
    'late',
    'early_leave',
    'paid_leave',
  ]),
  description: varchar('description', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated').defaultNow().onUpdateNow(),
});
//  =======================================================================================
// ===================================== SALES ======================================

//  =======================================================================================
// ==================================== SERVICES ======================================

//  =======================================================================================
// =================================== INVENTORY ==========================================

//  =======================================================================================
// =================================== PARTORDER ==========================================

//  =======================================================================================
// =================================== PARTORDER ==========================================

//  =======================================================================================
// =================================== PARTORDER ==========================================
