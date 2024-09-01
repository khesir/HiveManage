import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  mysqlEnum,
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

export const leaveLimit = mysqlTable('leave_limit', {
  leave_limit_id: int('leave_limit_id').primaryKey().autoincrement(),
  employee_id: int('employee_id').references(() => employee.employee_id), // Foreign key reference
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
// =============================== COMPANY PROFILING ======================================

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
//  =======================================================================================
// ==================================== PAYROLL ===========================================

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
