import { faker } from '@faker-js/faker';
import {
  employee,
  personalInformation,
  financialInformation,
  salaryInformation,
  employmentInformation,
  department,
  designation,
  auditLog,
  leaveLimit,
  leaveRequest,
  payroll,
  onPayroll,
  payrollApproval,
  signatory,
  payrollReports,
  deductions,
  benefits,
  adjustments,
  additionalPay,
  attendance,
  product,
  category,
  supplier,
  order,
  arrived_Items,
  item,
  sales_items,
  payment,
  receipt,
  service,
  reserve,
  borrow,
  jobOrder,
  reports,
  participants,
  channel,
  inquiry,
  message,
  customer,
  stocksLogs,
  assignedemployees,
  remarktickets,
  jobordertype,
  product_attachment,
  orderItem,
  SchemaType,
  // other schemas...
} from './drizzle.schema';
import log from '../lib/logger';
import { db, pool } from './pool';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// ===================== EMPLOYEE AND ITS INFORMATION INFORMATION =========================

async function seedEmployees(db: PostgresJsDatabase<SchemaType>) {
  const employeeStatus: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];
  const employees = Array.from({ length: 50 }).map(() => ({
    firstname: faker.person.firstName(),
    middlename: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(employeeStatus),
  }));

  await db.insert(employee).values(employees);
  log.info('Employee records seeded successfully.');
}

async function seedPersonalInformations(db: PostgresJsDatabase<SchemaType>) {
  const allowedGenders: ('Male' | 'Female' | 'Others')[] = [
    'Male',
    'Female',
    'Others',
  ];
  const allowedRelationships: ('Parent' | 'Sibling' | 'Friend')[] = [
    'Parent',
    'Sibling',
    'Friend',
  ];
  const employees = await db.select().from(employee);

  const personalInfos = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    birthday: faker.date
      .birthdate({ min: 18, max: 65, mode: 'age' })
      .toISOString(),
    gender: faker.helpers.arrayElement(allowedGenders),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    address_line: faker.location.streetAddress(),
    postal_code: faker.location.zipCode(),
    emergency_contact_name: faker.person.firstName(),
    emergency_contact_phone: faker.phone.number(),
    emergency_contact_relationship:
      faker.helpers.arrayElement(allowedRelationships),
  }));

  await db.insert(personalInformation).values(personalInfos);
}

async function seedFinancialInformations(db: PostgresJsDatabase<SchemaType>) {
  const employees = await db.select().from(employee);

  const financialInfos = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    pag_ibig_id: faker.string.numeric({ length: 12 }),
    sss_id: faker.string.numeric({ length: 10 }),
    philhealth_id: faker.string.numeric({ length: 12 }),
    tin: faker.string.numeric({ length: 9 }),
    bank_account_number: faker.finance.accountNumber(),
  }));

  await db.insert(financialInformation).values(financialInfos);
  log.info('Financial Information records seeded successfully.');
}

async function seedSalaryInformations(db: PostgresJsDatabase<SchemaType>) {
  const allowedFrequencies: (
    | 'Daily'
    | 'Weekly'
    | 'Bi Weekly'
    | 'Semi Monthly'
    | 'Monthly'
  )[] = ['Daily', 'Weekly', 'Bi Weekly', 'Semi Monthly', 'Monthly'];
  const employees = await db.select().from(employee);

  const salaryInfos = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    payroll_frequency: faker.helpers.arrayElement(allowedFrequencies),
    base_salary: faker.number.int({ min: 20000, max: 100000 }),
  }));

  await db.insert(salaryInformation).values(salaryInfos);
  log.info('Salary Information records seeded successfully.');
}

async function seedEmploymentInformations(db: PostgresJsDatabase<SchemaType>) {
  const allowedEmployeeTypes: (
    | 'Regular'
    | 'Probationary'
    | 'Contractual'
    | 'Seasonal'
    | 'Temporary'
  )[] = ['Regular', 'Probationary', 'Contractual', 'Seasonal', 'Temporary'];

  const allowedEmployeeStatuses: (
    | 'Active'
    | 'OnLeave'
    | 'Terminated'
    | 'Resigned'
    | 'Suspended'
    | 'Retired'
    | 'Inactive'
  )[] = [
    'Active',
    'OnLeave',
    'Terminated',
    'Resigned',
    'Suspended',
    'Retired',
    'Inactive',
  ];
  const employees = await db.select().from(employee);
  const departments = await db.select().from(department);
  const designations = await db.select().from(designation);

  const employmentInfos = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    department_id: faker.helpers.arrayElement(departments).department_id,
    designation_id: faker.helpers.arrayElement(designations).designation_id,
    employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
    employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
    message: faker.lorem.sentence(),
  }));

  await db.insert(employmentInformation).values(employmentInfos);
  log.info('Employee Information records seeded successfully.');
}

//  =======================================================================================
// =============================== COMPANY FEATURES ======================================

async function seedDepartments(db: PostgresJsDatabase<SchemaType>) {
  const departmentStatuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  const departments = Array.from({ length: 10 }).map(() => ({
    name: faker.commerce.department(),
    status: faker.helpers.arrayElement(departmentStatuses),
  }));

  await db.insert(department).values(departments);
  log.info('Department records seeded successfully.');
}

async function seedDesignations(db: PostgresJsDatabase<SchemaType>) {
  const designationStatuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  const designations = Array.from({ length: 10 }).map(() => ({
    title: faker.person.jobTitle(),
    status: faker.helpers.arrayElement(designationStatuses),
  }));

  await db.insert(designation).values(designations);
  log.info('Designations records seeded successfully.');
}

async function seedAuditLogs(db: PostgresJsDatabase<SchemaType>) {
  const employees = await db.select().from(employee);

  const entity_type: (
    | 'Employee'
    | 'JobOrder'
    | 'Sales'
    | 'Service'
    | 'Inventory'
    | 'Order'
  )[] = ['Employee', 'JobOrder', 'Sales', 'Service', 'Inventory', 'Order'];

  const auditlogs = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    entity_id: faker.number.int({ min: 1, max: 12 }),
    entity_type: faker.helpers.arrayElement(entity_type),
    action: faker.lorem.sentence(),
    change: {
      Employee: faker.person.fullName(),
      JobOrder: faker.commerce.product(),
      Sales: faker.commerce.price(),
      Service: faker.internet.url(),
      Inventory: faker.commerce.product(),
      Order: faker.commerce.productName(),
    },
  }));

  await db.insert(auditLog).values(auditlogs);
  log.info('Audit Logs records seeded successfully.');
}

async function seedLeaveLimits(db: PostgresJsDatabase<SchemaType>) {
  const employees = await db.select().from(employee);
  const leaveTypes: ('Sick Leave' | 'Vacation Leave' | 'Personal Leave')[] = [
    'Sick Leave',
    'Vacation Leave',
    'Personal Leave',
  ];
  const leaveLimits = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    limit_count: faker.number.float({ min: 0, max: 100, multipleOf: 0.01 }),
    leaveType: faker.helpers.arrayElement(leaveTypes),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(leaveLimit).values(leaveLimits);
  log.info('Leave Limit records seeded successfully.');
}

async function seedLeaveRequests(db: PostgresJsDatabase<SchemaType>) {
  const leaveTypes: ('Sick Leave' | 'Vacation Leave' | 'Personal Leave')[] = [
    'Sick Leave',
    'Vacation Leave',
    'Personal Leave',
  ];
  const statuses: ('Pending' | 'Approved' | 'Rejected')[] = [
    'Pending',
    'Approved',
    'Rejected',
  ];
  const employees = await db.select().from(employee);

  const leaveRequests = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    date_of_leave: faker.date.past().toISOString(),
    date_of_return: faker.date.future().toISOString(),
    status: faker.helpers.arrayElement(statuses),
    comment: faker.lorem.sentence(),
    leaveType: faker.helpers.arrayElement(leaveTypes),
  }));

  await db.insert(leaveRequest).values(leaveRequests);
  log.info('Leave Request records seeded successfully.');
}

//  =======================================================================================
// ==================================== PAYROLL ===========================================

async function seedPayrolls(db: PostgresJsDatabase<SchemaType>) {
  const statuses: ('Active' | 'Inactive' | 'Inprogress')[] = [
    'Active',
    'Inactive',
    'Inprogress',
  ];

  const payrolls = Array.from({ length: 50 }).map(() => ({
    start: faker.date.past().toISOString(),
    end: faker.date.future().toISOString(),
    pay_date: faker.date.future().toISOString(),
    status: faker.helpers.arrayElement(statuses),
  }));

  await db.insert(payroll).values(payrolls);

  log.info('Payroll records seeded successfully.');
}

async function seedOnPayrolls(db: PostgresJsDatabase<SchemaType>) {
  const payrollIDs = await db
    .select({ payroll_id: payroll.payroll_id })
    .from(payroll);
  const employeeIDs = await db
    .select({ employee_id: employee.employee_id })
    .from(employee);

  // Generate records for the `on_payroll` table
  const onPayrollRecords = Array.from({ length: 50 }).map(() => ({
    payroll_id: faker.helpers.arrayElement(payrollIDs).payroll_id,
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
  }));

  await db.insert(onPayroll).values(onPayrollRecords);
  log.info('On Payroll records seeded successfully.');
}

async function seedSignatory(db: PostgresJsDatabase<SchemaType>) {
  const employees = await db.select().from(employee);

  const signatoryRecords = Array.from({ length: 10 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    signatory_name: faker.person.fullName(),
    role: faker.person.jobTitle(),
    permission_level: faker.number.int({ min: 1, max: 5 }),
  }));

  await db.insert(signatory).values(signatoryRecords);
  log.info('Signatory records seeded successfully.');
}

async function seedPayrollApprovals(db: PostgresJsDatabase<SchemaType>) {
  const onPayrolls = await db.select().from(onPayroll);
  const signatories = await db.select().from(signatory);
  const approvalStatuses: ('Approved' | 'Pending' | 'Rejected')[] = [
    'Approved',
    'Pending',
    'Rejected',
  ];
  const payrollApprovalRecords = Array.from({ length: 50 }).map(() => ({
    on_payroll_id: faker.helpers.arrayElement(onPayrolls).on_payroll_id,
    signatory_id: faker.helpers.arrayElement(signatories).signatory_id,
    approval_status: faker.helpers.arrayElement(approvalStatuses),
    approval_date: faker.date.past().toISOString(),
  }));

  await db.insert(payrollApproval).values(payrollApprovalRecords);
  log.info('Payroll approval records seeded successfully.');
}

async function seedPayrollReportRecords(db: PostgresJsDatabase<SchemaType>) {
  const onpayrolls = await db.select().from(onPayroll);

  const payrollReportRecords = Array.from({ length: 50 }).map(() => ({
    on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
    netpay: parseFloat(faker.finance.amount({ min: 2000, max: 5000, dec: 2 })),
    grosspay: parseFloat(
      faker.finance.amount({ min: 3000, max: 7000, dec: 2 }),
    ),
    total_deductions: parseFloat(
      faker.finance.amount({ min: 500, max: 2000, dec: 2 }),
    ),
    total_benefits: parseFloat(
      faker.finance.amount({ min: 100, max: 1000, dec: 2 }),
    ),
  }));

  await db.insert(payrollReports).values(payrollReportRecords);

  log.info('Payroll Report records seeded successfully.');
}

//  =======================================================================================
// =============================== EMPLOYEE PERFORMANCE ===================================
async function seedDeductions(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);
  const allowedFrequencies: (
    | 'Daily'
    | 'Weekly'
    | 'Bi Weekly'
    | 'Semi Monthly'
    | 'Monthly'
  )[] = ['Daily', 'Weekly', 'Bi Weekly', 'Semi Monthly', 'Monthly'];

  const deductionTypes: ('Bonus' | 'Comission' | 'Overtime' | 'Other')[] = [
    'Bonus',
    'Comission',
    'Overtime',
    'Other',
  ];
  const deductionRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    name: faker.finance.accountName(),
    start: faker.date.past().toISOString(),
    end: faker.date.future().toISOString(),
    frequency: faker.helpers.arrayElement(allowedFrequencies),

    deduction_type: faker.helpers.arrayElement(deductionTypes),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(deductions).values(deductionRecords);

  log.info('Deductions records seeded successfully.');
}
async function seedBenefits(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);
  const allowedFrequencies: (
    | 'Daily'
    | 'Weekly'
    | 'Bi Weekly'
    | 'Semi Monthly'
    | 'Monthly'
  )[] = ['Daily', 'Weekly', 'Bi Weekly', 'Semi Monthly', 'Monthly'];

  const benefitsTypes: ('Bonus' | 'Comission' | 'Overtime' | 'Other')[] = [
    'Bonus',
    'Comission',
    'Overtime',
    'Other',
  ];
  const benefitRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    name: faker.finance.accountName(),
    start: faker.date.past().toISOString(),
    end: faker.date.future().toISOString(),
    frequency: faker.helpers.arrayElement(allowedFrequencies),
    benefits_type: faker.helpers.arrayElement(benefitsTypes),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(benefits).values(benefitRecords);

  log.info('Benefits records seeded successfully.');
}

async function seedAdjustments(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);

  const adjustmentType: ('Bonus' | 'Comission' | 'Overtime' | 'Other')[] = [
    'Bonus',
    'Comission',
    'Overtime',
    'Other',
  ];
  const adjustmentRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    name: faker.finance.accountName(),
    remarks: faker.lorem.sentence(),
    adjustments_type: faker.helpers.arrayElement(adjustmentType),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(adjustments).values(adjustmentRecords);

  log.info('Adjustments records seeded successfully.');
}

async function seedAdditionalPay(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);

  const allowedAdditionalPayTypes: (
    | 'Bonus'
    | 'Comission'
    | 'Overtime'
    | 'Other'
  )[] = ['Bonus', 'Comission', 'Overtime', 'Other'];

  const additionalPayRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    name: faker.finance.accountName(),
    additional_pay_type: faker.helpers.arrayElement(allowedAdditionalPayTypes),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(additionalPay).values(additionalPayRecords);

  log.info('Additional pay records seeded successfully.');
}

async function seedAttendance(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);
  const attendanceStatuses: (
    | 'Present'
    | 'Absent'
    | 'Late'
    | 'Early Leave'
    | 'Paid Leave'
  )[] = ['Present', 'Absent', 'Late', 'Early Leave', 'Paid Leave'];

  const attendanceRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    date: faker.date.recent().toISOString(),
    clock_in: faker.date.recent().toISOString(),
    clock_out: faker.date.future().toISOString(),
    hoursWorked: parseFloat(faker.finance.amount({ min: 1, max: 12, dec: 2 })),
    status: faker.helpers.arrayElement(attendanceStatuses),
    description: faker.lorem.sentence(),
  }));

  await db.insert(attendance).values(attendanceRecords);

  log.info('Attendance records seeded successfully.');
}
//  =======================================================================================
// ===================================== CUSTOMER ======================================
async function seedParticipants(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);
  const channelIDs = await db.select().from(channel);

  const participantsRecords = Array.from({ length: 70 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    channel_id: faker.helpers.arrayElement(channelIDs).channel_id,
    is_private: faker.datatype.boolean(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(participants).values(participantsRecords);
  log.info('Participant records seeded successfully');
}

async function seedChannel(db: PostgresJsDatabase<SchemaType>) {
  const inquiryIDs = await db.select().from(inquiry);

  const channelRecords = Array.from({ length: 70 }).map(() => ({
    inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
    channel_name: faker.person.jobTitle(),
    is_private: faker.datatype.boolean(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(channel).values(channelRecords);
  log.info('Channel records seeded successfully');
}

async function seedMessage(db: PostgresJsDatabase<SchemaType>) {
  const inquiryIDs = await db.select().from(inquiry);

  const status = [
    'User',
    'Admin',
    'Customer Support',
    'Employee',
    'Manager',
  ] as const;

  const messageRecords = Array.from({ length: 70 }).map(() => ({
    inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
    sender_id: faker.number.int({ min: 1, max: 12 }),
    content: faker.lorem.sentence(),
    sender_type: faker.helpers.arrayElement(status),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(message).values(messageRecords);
  log.info('Message records seeded successfully');
}

async function seedInquiry(db: PostgresJsDatabase<SchemaType>) {
  const customerIDs = await db.select().from(customer);

  const status = [
    'Product',
    'Pricing',
    'Order Status',
    'Technical Support',
    'Billing',
    'Complaint', // Corrected to match the expected type
    'Feedback',
    'Return/Refund',
  ] as const; // Use 'as const' to infer a tuple type for strict typing

  const inquiryRecords = Array.from({ length: 70 }).map(() => ({
    customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
    inquiryTitle: faker.commerce.productName(),
    inquiry_type: faker.helpers.arrayElement(status),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(inquiry).values(inquiryRecords);
  log.info('Inquiry records seeded successfully');
}

async function seedCustomer(db: PostgresJsDatabase<SchemaType>) {
  const status = [
    'Active',
    'Inactive', // This status was missing in your original list
    'Pending',
    'Suspended',
    'Banned',
    'VIP',
    'Delinquent',
    'Prospect',
  ] as const;

  const socialPlatforms = [
    'Facebook',
    'Twitter',
    'Instagram',
    'LinkedIn',
    'TikTok',
    'YouTube',
  ] as const;

  const customerRecords = Array.from({ length: 70 }).map(() => ({
    firstname: faker.person.firstName(),
    middlename: faker.person.middleName(),
    lastname: faker.person.lastName(),
    contact_phone: faker.phone.number(),

    socials: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }).map(
      () => ({
        platform: faker.helpers.arrayElement(socialPlatforms),
        url: faker.internet.url(), // Fake URL for the platform
      }),
    ),

    address_line: faker.location.city(),
    barangay: faker.location.city(),
    province: faker.location.city(),
    email: faker.internet.email(),
    standing: faker.helpers.arrayElement(status),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(customer).values(customerRecords);
  log.info('Customer records seeded successfully');
}

//  =======================================================================================
// ===================================== SALES ======================================

async function seedSalesItem(db: PostgresJsDatabase<SchemaType>) {
  const itemIDs = await db.select().from(item);
  const serviceIDs = await db.select().from(service);

  const salesitemTypeEnum = [
    'Sales',
    'Joborder',
    'Borrow',
    'Purchase',
    'Exchange',
  ] as const;

  const salesItemRecords = Array.from({ length: 70 }).map(() => ({
    item_id: faker.helpers.arrayElement(itemIDs).item_id,
    service_id: faker.helpers.arrayElement(serviceIDs).service_id,
    quantity: faker.number.int({ min: 1, max: 100 }),
    sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
    total_price: faker.finance.amount({ min: 1, max: 12, dec: 2 }),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(sales_items).values(salesItemRecords);

  log.info('Sales Items records seeded successfully');
}

async function seedPayment(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);

  const statuses: ('Cash' | 'Card' | 'Online Payment')[] = [
    'Cash',
    'Card',
    'Online Payment',
  ];
  const status: (
    | 'Pending'
    | 'Completed'
    | 'Failed'
    | 'Cancelled'
    | 'Refunded'
    | 'Partially Refunded'
    | 'Overdue'
    | 'Processing'
    | 'Declined'
    | 'Authorized'
  )[] = [
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
  ];

  const paymentRecords = Array.from({ length: 70 }).map(() => ({
    service_id: faker.helpers.arrayElement(serviceIDs).service_id,
    amount: parseFloat(faker.finance.amount({ min: 1, max: 12, dec: 2 })),
    payment_date: faker.date.past().toISOString(),
    payment_method: faker.helpers.arrayElement(statuses),
    payment_status: faker.helpers.arrayElement(status),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(payment).values(paymentRecords);

  log.info('Payment records seeded successfully');
}

async function seedReceipt(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);
  const paymentIDs = await db.select().from(payment);

  const receiptRecords = Array.from({ length: 70 }).map(() => ({
    sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
    payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
    issued_date: faker.date.past().toISOString(),
    total_amount: parseFloat(faker.finance.amount({ min: 1, max: 12, dec: 2 })),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(receipt).values(receiptRecords);

  log.info('Receipt records seeded successfully');
}
//  =======================================================================================
// ==================================== SERVICES ======================================

async function seedReserve(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);
  const itemIDs = await db.select().from(item);

  const status = [
    'Reserved',
    'Confirmed', // This status was missing in your original list
    'Cancelled',
    'Pending',
    'Completed',
  ] as const;

  const reserveRecords = Array.from({ length: 70 }).map(() => ({
    service_id: faker.helpers.arrayElement(serviceIDs).service_id,
    item_id: faker.helpers.arrayElement(itemIDs).item_id,
    reserve_status: faker.helpers.arrayElement(status),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(reserve).values(reserveRecords);

  log.info('Reserve records seeded successfully');
}

async function seedBorrow(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);
  const salesItemsIDs = await db.select().from(sales_items);

  const statuses = [
    'Requested',
    'Approved',
    'Borrowed',
    'Returned',
    'Overdue',
    'Rejected',
    'Cancelled',
    'Lost',
    'Damaged',
  ] as const; // Use 'as const' for TypeScript to infer literal types

  const tag_item_type = ['New', 'Used', 'Broken'] as const;

  const borrowRecords = Array.from({ length: 70 }).map(() => ({
    service_id: faker.helpers.arrayElement(serviceIDs).service_id,
    sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
    borrow_date: faker.date.past().toISOString(),
    return_date: faker.date.future().toISOString(),
    fee: faker.number.int({ min: 1, max: 100 }),
    tag_item: faker.helpers.arrayElement(tag_item_type),
    status: faker.helpers.arrayElement(statuses),
    created_at: faker.date.recent(), // Ensure format is correct
    last_updated: faker.date.recent(), // Ensure format is correct
  }));

  await db.insert(borrow).values(borrowRecords);

  log.info('Borrow records seeded successfully');
}

async function seedService(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);
  const customerIDs = await db.select().from(customer);

  const statuses = ['Active', 'Inactive'];

  const serviceRecords = Array.from({ length: 70 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
    service_title: faker.person.jobTitle(),
    service_description: faker.lorem.sentence(),
    service_status: faker.helpers.arrayElement(statuses) as
      | 'Active'
      | 'Inactive',
    has_reservation: faker.datatype.boolean(),
    has_sales_item: faker.datatype.boolean(),
    has_borrow: faker.datatype.boolean(),
    has_job_order: faker.datatype.boolean(),
    created_at: new Date(), // or use faker.date.recent()
    last_updated: new Date(), // or use faker.date.recent()
  }));

  try {
    await db.insert(service).values(serviceRecords);
    log.info('Service records seeded successfully');
  } catch (error) {
    log.error('Error seeding service records:', error);
  }
}

async function seedAssignedEmployees(db: PostgresJsDatabase<SchemaType>) {
  const jobOrders = await db.select().from(jobOrder);
  const employees = await db.select().from(employee); // Assuming you're also fetching employees here

  // Check if jobOrders or employees are empty
  if (jobOrders.length === 0) {
    log.warn('No job orders found. Skipping assigned employees seeding.');
    return; // Skip seeding if there are no job orders
  }

  if (employees.length === 0) {
    log.warn('No employees found. Skipping assigned employees seeding.');
    return; // Skip seeding if there are no employees
  }

  const assignedEmployeesRecords = Array.from({ length: 70 }).map(() => ({
    job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    assigned_by: faker.person.fullName(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(assignedemployees).values(assignedEmployeesRecords);

  log.info('Assigned Employees seeded successfully');
}

async function seedRemarkTickets(db: PostgresJsDatabase<SchemaType>) {
  const jobOrders = await db.select().from(jobOrder);
  const employeeIDs = await db.select().from(employee);

  // Check if jobOrders array is empty
  if (jobOrders.length === 0) {
    log.warn('No job orders found. Skipping remark tickets seeding.');
    return; // Skip seeding if there are no job orders
  }

  const remarkTypes: (
    | 'General'
    | 'Urgent'
    | 'Follow-up'
    | 'Resolved'
    | 'On-Hold'
    | 'Information'
  )[] = [
    'General',
    'Urgent',
    'Follow-up',
    'Resolved',
    'On-Hold',
    'Information',
  ];

  const remark_status: (
    | 'Open'
    | 'In Progress'
    | 'Resolved'
    | 'Closed'
    | 'Pending'
    | 'Rejected'
  )[] = ['Open', 'In Progress', 'Resolved', 'Closed', 'Pending', 'Rejected'];

  // Ensure to reference job_order_id correctly
  const remarkticketsRecords = Array.from({ length: 70 }).map(() => ({
    job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id, // Accessing job_order_id safely
    created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
    remark_type: faker.helpers.arrayElement(remarkTypes),
    description: faker.lorem.sentence(),
    remarktickets_status: faker.helpers.arrayElement(remark_status),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(remarktickets).values(remarkticketsRecords);

  log.info('Remark Tickets seeded successfully');
}

//  =======================================================================================
// =================================== JOB ORDER ==========================================

async function seedJobOrder(db: PostgresJsDatabase<SchemaType>) {
  const jobordertypeIDs = await db.select().from(jobordertype);
  const serviceIDs = await db.select().from(service);

  const statuses: (
    | 'Pending'
    | 'In Progress'
    | 'Completed'
    | 'On Hold'
    | 'Cancelled'
    | 'Awaiting Approval'
    | 'Approved'
    | 'Rejected'
    | 'Closed'
  )[] = [
    'Pending',
    'In Progress',
    'Completed',
    'On Hold',
    'Cancelled',
    'Awaiting Approval',
    'Approved',
    'Rejected',
    'Closed',
  ];

  const joborderRecords = Array.from({ length: 10 }).map(() => ({
    joborder_type_id:
      faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
    service_id: faker.helpers.arrayElement(serviceIDs).service_id,
    uuid: faker.string.uuid(),
    fee: faker.number.int({ min: 1, max: 100 }),
    status: faker.helpers.arrayElement(statuses),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(jobOrder).values(joborderRecords);

  log.info('Job Order records seeded successfully');
}

async function seedReports(db: PostgresJsDatabase<SchemaType>) {
  const joborderIDs = await db.select().from(jobOrder);
  const customerIDs = await db.select().from(customer);

  const reportsRecords = Array.from({ length: 70 }).map(() => ({
    customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
    job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
    reports_title: faker.lorem.sentence(),
    remarks: faker.lorem.sentence(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(reports).values(reportsRecords);

  log.info('Report records seeded successfully');
}

async function seedJobOrderTypes(db: PostgresJsDatabase<SchemaType>) {
  const statuses: ('Available' | 'Not Available')[] = [
    'Available',
    'Not Available',
  ];

  const jobordertypesRecords = Array.from({ length: 70 }).map(() => ({
    name: faker.company.catchPhrase(),
    description: faker.lorem.sentence(),
    fee: faker.number.int({ min: 50, max: 1000 }),
    joborder_types_status: faker.helpers.arrayElement(statuses),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(jobordertype).values(jobordertypesRecords);

  log.info('Job Order Types seeded successfully');
}
//  =======================================================================================
// =================================== INVENTORY ==========================================

async function seedItem(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const tag_status: ('New' | 'Used' | 'Broken')[] = ['New', 'Used', 'Broken'];
  const itemRecords = Array.from({ length: 50 }).map(() => ({
    product_id: faker.helpers.arrayElement(productIDs).product_id,
    stock: faker.number.int({ min: 100, max: 500 }),
    on_listing: faker.datatype.boolean(),
    re_order_level: faker.number.int({ min: 100, max: 500 }),
    price: parseFloat(
      faker.finance.amount({ min: 1001, max: 5000, dec: 2 }),
    ).toFixed(2),
    tag: faker.helpers.arrayElement(tag_status),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(item).values(itemRecords);

  log.info('Item records seeded successfully');
}

async function seedProduct(db: PostgresJsDatabase<SchemaType>) {
  const categoryIDs = await db.select().from(category);
  const supplierIDs = await db.select().from(supplier);

  const productRecords = Array.from({ length: 50 }).map(() => ({
    category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    price: parseFloat(faker.finance.amount({ min: 1, max: 12, dec: 2 })),
    img_url: faker.image.url(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(product).values(productRecords);

  log.info('Product records seeded successfully');
}

async function seedProductAttachment(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);

  const productattachmentRecords = Array.from({ length: 50 }).map(() => ({
    product_id: faker.helpers.arrayElement(productIDs).product_id,
    filePath: faker.lorem.sentence(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(product_attachment).values(productattachmentRecords);

  log.info('Product Attachment records seeded successfully');
}

async function seedCategory(db: PostgresJsDatabase<SchemaType>) {
  const categoryRecords = Array.from({ length: 25 }).map(() => ({
    name: faker.commerce.department(),
    content: faker.lorem.paragraph(),
  }));

  await db.insert(category).values(categoryRecords);

  log.info('Category records seeded successfully');
}

async function seedSupplier(db: PostgresJsDatabase<SchemaType>) {
  const supplierRecords = Array.from({ length: 25 }).map(() => ({
    name: faker.commerce.productName(),
    contact_number: faker.phone.number(),
    remarks: faker.lorem.sentence(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(supplier).values(supplierRecords);

  log.info('Supplier records seeded successfully');
}

async function seedOrder(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);

  const statuses: (
    | 'Pending'
    | 'Processing'
    | 'Delivered'
    | 'Cancelled'
    | 'Return'
    | 'Shipped'
  )[] = [
    'Pending',
    'Processing',
    'Delivered',
    'Cancelled',
    'Return',
    'Shipped',
  ];

  const orderRecords = Array.from({ length: 50 }).map(() => ({
    product_id: faker.helpers.arrayElement(productIDs).product_id,
    items_ordered: Number(faker.finance.amount({ min: 1, max: 12, dec: 0 })),
    expected_arrival: faker.date.future().toISOString(),
    message: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(statuses),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(order).values(orderRecords);

  log.info('Order records seeded successfully');
}

async function seedOrderItem(db: PostgresJsDatabase<SchemaType>) {
  const orderIDs = await db.select().from(order);
  const productIDs = await db.select().from(product);

  const orderitemRecords = Array.from({ length: 50 }).map(() => ({
    order_id: faker.helpers.arrayElement(orderIDs).order_id,
    product_id: faker.helpers.arrayElement(productIDs).product_id,
    quantity: Number(faker.finance.amount({ min: 1, max: 12, dec: 0 })),
    price: Number(faker.finance.amount({ min: 1, max: 12, dec: 0 })),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(orderItem).values(orderitemRecords);

  log.info('Order Item records seeded successfully');
}

async function seedStockLogs(db: PostgresJsDatabase<SchemaType>) {
  const itemdata = await db.select().from(item);
  const movement: ('Stock In' | 'Stock Out')[] = ['Stock In', 'Stock Out'];
  const stockRecord = Array.from({ length: 50 }).map(() => ({
    item_id: faker.helpers.arrayElement(itemdata).item_id,
    quantity: faker.number.int({ min: 1, max: 30 }),
    movement_type: faker.helpers.arrayElement(movement),
    created_at: faker.date.recent(),
  }));
  await db.insert(stocksLogs).values(stockRecord);
  log.info('Stock Logs records seeded successfully');
}

async function seedArrivedItems(db: PostgresJsDatabase<SchemaType>) {
  const orderIDs = await db.select().from(order);

  const arrivedItemsRecords = Array.from({ length: 50 }).map(() => ({
    order_id: faker.helpers.arrayElement(orderIDs).order_id,
    filePath: faker.lorem.sentence(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(arrived_Items).values(arrivedItemsRecords);

  log.info('Arrived Items records seeded successfully');
}
//  =======================================================================================
// =================================== PARTORDER ==========================================

async function main() {
  try {
    await seedDepartments(db);
    await seedDesignations(db);

    await seedEmployees(db); // Capture employee IDs

    await seedAuditLogs(db);
    await seedPersonalInformations(db);
    await seedFinancialInformations(db);
    await seedSalaryInformations(db);
    await seedEmploymentInformations(db);
    await seedLeaveLimits(db);

    await seedLeaveRequests(db);

    await seedPayrolls(db);
    await seedOnPayrolls(db);
    await seedSignatory(db);
    await seedPayrollApprovals(db);
    await seedPayrollReportRecords(db);

    await seedBenefits(db);
    await seedDeductions(db);
    await seedAdditionalPay(db);
    await seedAdjustments(db);
    await seedAttendance(db);

    // Inventory
    await seedCategory(db);
    await seedSupplier(db);
    await seedProduct(db);
    await seedOrder(db);
    await seedArrivedItems(db);
    await seedOrderItem(db);
    await seedProductAttachment(db);
    await seedItem(db);
    await seedStockLogs(db);

    // Participants and related data
    await seedCustomer(db); // Seed customers first
    await seedInquiry(db);
    await seedChannel(db);
    await seedParticipants(db);
    await seedMessage(db);

    // Sales and related data
    await seedService(db);
    await seedPayment(db);
    await seedReceipt(db);
    await seedSalesItem(db); // Seed sales items first
    await seedBorrow(db); // Now seed borrow after sales items
    await seedReserve(db);

    // Job Order and related data
    await seedJobOrderTypes(db);
    await seedJobOrder(db);

    // Pass employee IDs to seedRemarkTickets
    await seedRemarkTickets(db); // Ensure this function correctly references employee IDs
    await seedReports(db); // Make sure this also properly references customer IDs

    await seedAssignedEmployees(db);
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await pool.end();
  }
  log.info('Generating Dummy Data Completed');
}

main().catch((error) => {
  log.error('An unexpected error occurred:', error);
  process.exit(1);
});
