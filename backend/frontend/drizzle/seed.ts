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
  remarkitems,
  remarkreports,
  remarktype,
  remarkassigned,
  employee_role,
  remarkcontent,
  product_category,
  price_history,
  inventory_record,
  joborder_services,
} from './drizzle.schema';
import log from '../lib/logger';
import { db, pool } from './pool';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// ===================== EMPLOYEE AND ITS INFORMATION INFORMATION =========================

async function seedEmployees(db: PostgresJsDatabase<SchemaType>) {
  const employeeStatus: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  // Fetch employee roles and check if any exist
  const employeeroleIDs = await db.select().from(employee_role);

  if (employeeroleIDs.length === 0) {
    throw new Error(
      "No employee roles found. Seed the 'employee_role' table first.",
    );
  }

  // Generate employee data
  const employees = Array.from({ length: 50 }).map(() => ({
    employee_role_id:
      faker.helpers.arrayElement(employeeroleIDs).employee_role_id,
    firstname: faker.person.firstName(),
    middlename: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(employeeStatus),
  }));

  // Insert into the employee table
  await db.insert(employee).values(employees);
  log.info('Employee records seeded successfully.');
}

async function seedEmployeesRole(db: PostgresJsDatabase<SchemaType>) {
  const employeesRole = Array.from({ length: 5 }).map(() => ({
    name: faker.person.fullName(),
    access_level: faker.number.int({ min: 1, max: 5 }),
  }));

  await db.insert(employee_role).values(employeesRole);
  log.info('Employee Role records seeded successfully.');
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
  const remarktypeIDs = await db.select().from(remarktype);
  const employeeIDs = await db.select().from(employee);

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
    remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    remarktickets_status: faker.helpers.arrayElement(remark_status),
    created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
    deadline: faker.date.future().toISOString(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(remarktickets).values(remarkticketsRecords);

  log.info('Remark Tickets seeded successfully');
}

async function seedRemarkItems(db: PostgresJsDatabase<SchemaType>) {
  const itemIDs = await db.select().from(item);
  const remarksIDs = await db.select().from(remarktickets);

  const remarkitemsRecords = Array.from({ length: 70 }).map(() => ({
    item_id: faker.helpers.arrayElement(itemIDs).item_id,
    remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(remarkitems).values(remarkitemsRecords);

  log.info('Remark Items seeded successfully');
}

async function seedRemarkReports(db: PostgresJsDatabase<SchemaType>) {
  const reportIDs = await db.select().from(reports);
  const remarkIDs = await db.select().from(remarktickets);

  const remarkreportsRecords = Array.from({ length: 70 }).map(() => ({
    reports_id: faker.helpers.arrayElement(reportIDs).reports_id,
    remark_id: faker.helpers.arrayElement(remarkIDs).remark_id,
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(remarkreports).values(remarkreportsRecords);

  log.info('Remark Reports seeded successfully');
}

async function seedRemarkType(db: PostgresJsDatabase<SchemaType>) {
  const remarktypeRecords = Array.from({ length: 5 }).map(() => ({
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(remarktype).values(remarktypeRecords);

  log.info('Remark Type seeded successfully');
}

async function seedRemarkAssigned(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);
  const remarkIDs = await db.select().from(remarktickets);

  const remarkassignedRecords = Array.from({ length: 70 }).map(() => ({
    remark_id: faker.helpers.arrayElement(remarkIDs).remark_id,
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(remarkassigned).values(remarkassignedRecords);

  log.info('Remark Assigned seeded successfully');
}

async function seedRemarkContent(db: PostgresJsDatabase<SchemaType>) {
  const remarkcontentRecords = Array.from({ length: 70 }).map(() => ({
    markdown: faker.lorem.sentences(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(remarkcontent).values(remarkcontentRecords);

  log.info('Remark Content seeded successfully');
}

//  =======================================================================================
// =================================== JOB ORDER ==========================================

async function seedJobOrder(db: PostgresJsDatabase<SchemaType>) {
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
    service_id: faker.helpers.arrayElement(serviceIDs).service_id,
    uuid: faker.string.uuid(),
    fee: faker.number.int({ min: 1, max: 100 }),
    joborder_status: faker.helpers.arrayElement(statuses),
    total_cost_price: parseFloat(
      faker.finance.amount({ min: 1, max: 12, dec: 2 }),
    ),

    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(jobOrder).values(joborderRecords);

  log.info('Job Order records seeded successfully');
}

async function seedReports(db: PostgresJsDatabase<SchemaType>) {
  const joborderIDs = await db.select().from(jobOrder);

  const reportsRecords = Array.from({ length: 70 }).map(() => ({
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

async function seedJobOrderServices(db: PostgresJsDatabase<SchemaType>) {
  const jobordertypesIDs = await db.select().from(jobordertype);
  const joborderIDs = await db.select().from(jobOrder);

  const joborderservicesRecords = Array.from({ length: 70 }).map(() => ({
    joborder_types_id:
      faker.helpers.arrayElement(jobordertypesIDs).joborder_type_id,
    job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(joborder_services).values(joborderservicesRecords);

  log.info('Job Order Services records seeded successfully');
}
//  =======================================================================================
// =================================== INVENTORY ==========================================

async function seedItem(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product); // Fetch existing product IDs

  // Define your real data array
  const itemRecords = [
    {
      product_id: productIDs[0]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'Broken' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[1]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'Used' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[2]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[3]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'Broken' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[4]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'Used' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[5]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[7]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[8]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[9]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[10]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: productIDs[11]?.product_id, // Adjust to your available IDs
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
  ];
  // Insert the real data into the database
  await db.insert(item).values(itemRecords);

  log.info('Item records seeded successfully');
}

async function seedPriceHistory(db: PostgresJsDatabase<SchemaType>) {
  const itemIDs = await db.select().from(item); // Fetch existing item IDs

  // Define real data for price history records
  const pricehistoryRecords = [
    {
      item_id: itemIDs[0]?.item_id, // Use actual item IDs from your query
      price: '1200.50', // Ensure price is a string
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-15'),
    },
    {
      item_id: itemIDs[1]?.item_id,
      price: '1450.75',
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-02-20'),
    },
    {
      item_id: itemIDs[2]?.item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: itemIDs[3]?.item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: itemIDs[4]?.item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: itemIDs[5]?.item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: itemIDs[6]?.item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: itemIDs[7]?.item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: itemIDs[8]?.item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: itemIDs[9]?.item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: itemIDs[10]?.item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    // Add more records as needed
  ];

  // Insert the real data into the database
  await db.insert(price_history).values(pricehistoryRecords);

  log.info('Price History records seeded successfully');
}

async function seedInventoryRecord(db: PostgresJsDatabase<SchemaType>) {
  const supplierIDs = await db.select().from(supplier); // Fetch existing supplier IDs
  const itemIDs = await db.select().from(item); // Fetch existing item IDs

  // Define an array of real data for the item-supplier records
  const inventoryRecords = [
    {
      supplier_id: supplierIDs[0]?.supplier_id, // Use actual supplier and item IDs
      item_id: itemIDs[0]?.item_id,
      tag: 'Active' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status
      stock: 150,
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-10'),
    },
    {
      supplier_id: supplierIDs[1]?.supplier_id,
      item_id: itemIDs[1]?.item_id,
      tag: 'Verified' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status
      stock: 300,
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-02-15'),
    },
    {
      supplier_id: supplierIDs[2]?.supplier_id,
      item_id: itemIDs[2]?.item_id,
      tag: 'Preferred' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status,
      stock: 200,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: supplierIDs[3]?.supplier_id,
      item_id: itemIDs[3]?.item_id,
      tag: 'Blacklisted' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status,
      stock: 200,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: supplierIDs[4]?.supplier_id,
      item_id: itemIDs[4]?.item_id,
      tag: 'Blacklisted' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status,
      stock: 200,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: supplierIDs[5]?.supplier_id,
      item_id: itemIDs[5]?.item_id,
      tag: 'Blacklisted' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status,
      stock: 200,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: supplierIDs[6]?.supplier_id,
      item_id: itemIDs[6]?.item_id,
      tag: 'Blacklisted' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status,
      stock: 200,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: supplierIDs[7]?.supplier_id,
      item_id: itemIDs[7]?.item_id,
      tag: 'Pending Approval' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status,
      stock: 200,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: supplierIDs[8]?.supplier_id,
      item_id: itemIDs[8]?.item_id,
      tag: 'Blacklisted' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status,
      stock: 200,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: supplierIDs[9]?.supplier_id,
      item_id: itemIDs[9]?.item_id,
      tag: 'Under Review' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status,
      stock: 200,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: supplierIDs[10]?.supplier_id,
      item_id: itemIDs[10]?.item_id,
      tag: 'Blacklisted' as
        | 'Active'
        | 'Inactive'
        | 'Pending Approval'
        | 'Verified'
        | 'Unverified'
        | 'Suspended'
        | 'Preferred'
        | 'Blacklisted'
        | 'Under Review'
        | 'Archived', // Choose a specific tag status,
      stock: 200,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    // Add more records as needed
  ];

  // Insert the real data into the database
  await db.insert(inventory_record).values(inventoryRecords);

  log.info('Inventory Records records seeded successfully');
}

async function seedProduct(db: PostgresJsDatabase<SchemaType>) {
  const categoryIDs = await db.select().from(category);
  const supplierIDs = await db.select().from(supplier);

  const productRecords = [
    {
      category_id: categoryIDs[0]?.category_id,
      supplier_id: supplierIDs[0]?.supplier_id,
      name: 'Ram',
      description:
        'High-performance DDR4 RAM module with a clock speed of 3200MHz, designed to provide faster data transfer and improve overall system responsiveness.',
      price: 799.99,
      img_url: 'https://example.com/images/smartphone-a1.jpg',
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-10'),
    },
    {
      category_id: categoryIDs[1]?.category_id,
      supplier_id: supplierIDs[1]?.supplier_id,
      name: 'Laptop Pro 15',
      description: 'A powerful laptop suitable for professionals and students.',
      price: 1199.99,
      img_url: 'https://example.com/images/laptop-pro-15.jpg',
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-02-15'),
    },
    {
      category_id: categoryIDs[2]?.category_id,
      supplier_id: supplierIDs[2]?.supplier_id,
      name: 'SSD',
      description:
        '"High-speed NVMe SSD with rapid data transfer and reliable performance."',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: categoryIDs[3]?.category_id,
      supplier_id: supplierIDs[3]?.supplier_id,
      name: 'LCD',
      description:
        'Vibrant LCD monitor with sharp resolution and wide viewing angles, perfect for immersive gaming and professional work.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: categoryIDs[4]?.category_id,
      supplier_id: supplierIDs[4]?.supplier_id,
      name: 'Wireless Headphones',
      description:
        'Noise-cancelling wireless headphones with excellent sound quality.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: categoryIDs[5]?.category_id,
      supplier_id: supplierIDs[5]?.supplier_id,
      name: 'Mouse',
      description:
        'High-precision wired mouse with ergonomic design and customizable buttons for smooth navigation and enhanced gaming performance.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: categoryIDs[5]?.category_id,
      supplier_id: supplierIDs[5]?.supplier_id,
      name: 'Wireless Mouse',
      description:
        'Ergonomic wireless mouse with precise tracking and customizable buttons for seamless navigation and enhanced productivity',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: categoryIDs[2]?.category_id,
      supplier_id: supplierIDs[2]?.supplier_id,
      name: 'Keyboard',
      description:
        'Mechanical keyboard with tactile switches and customizable RGB backlighting for an enhanced typing experience and personalized style.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: categoryIDs[2]?.category_id,
      supplier_id: supplierIDs[2]?.supplier_id,
      name: 'Nvidia GPU',
      description:
        'High-performance graphics card with advanced cooling technology and real-time ray tracing for stunning visuals and smooth gaming experiences.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: categoryIDs[2]?.category_id,
      supplier_id: supplierIDs[2]?.supplier_id,
      name: 'Amd GPU',
      description:
        'High-performance graphics card with advanced cooling technology and real-time ray tracing for stunning visuals and smooth gaming experiences.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    // Add more products as needed
  ];

  // Insert the real data into the database
  await db.insert(product).values(productRecords);

  log.info('Product records seeded successfully');
}

async function seedProductAttachment(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);

  const productattachmentRecords = [
    {
      product_id: productIDs[0]?.product_id,
      filePath: 'https://example.com/attachments/product1_manual.pdf',
      created_at: new Date('2023-09-01'),
      last_updated: new Date('2023-09-02'),
    },
    {
      product_id: productIDs[1]?.product_id,
      filePath: 'https://example.com/attachments/product2_manual.pdf',
      created_at: new Date('2023-09-03'),
      last_updated: new Date('2023-09-04'),
    },
    {
      product_id: productIDs[2]?.product_id,
      filePath: 'https://example.com/attachments/product3_manual.pdf',
      created_at: new Date('2023-09-05'),
      last_updated: new Date('2023-09-06'),
    },
    {
      product_id: productIDs[3]?.product_id,
      filePath: 'https://example.com/attachments/product4_manual.pdf',
      created_at: new Date('2023-09-07'),
      last_updated: new Date('2023-09-08'),
    },
    {
      product_id: productIDs[4]?.product_id,
      filePath: 'https://example.com/attachments/product5_manual.pdf',
      created_at: new Date('2023-09-09'),
      last_updated: new Date('2023-09-10'),
    },
    {
      product_id: productIDs[4]?.product_id,
      filePath: 'https://example.com/attachments/product5_manual.pdf',
      created_at: new Date('2023-09-09'),
      last_updated: new Date('2023-09-10'),
    },
    // Add more product attachment records as needed
  ];

  await db.insert(product_attachment).values(productattachmentRecords);

  log.info('Product Attachment records seeded successfully');
}

async function seedCategory(db: PostgresJsDatabase<SchemaType>) {
  const categoryRecords = [
    {
      name: 'Processors',
      content:
        'High-performance CPUs designed for demanding applications and gaming.',
    },
    {
      name: 'Graphics Cards',
      content:
        'Advanced GPUs for gaming and professional graphics applications.',
    },
    {
      name: 'Motherboards',
      content:
        'The backbone of the computer, connecting all components together.',
    },
    {
      name: 'Memory (RAM)',
      content:
        'Fast and reliable memory for smooth multitasking and performance.',
    },
    {
      name: 'Storage Drives',
      content: 'SSDs and HDDs for storing your operating system and files.',
    },
    {
      name: 'Monitors',
      content: 'High-resolution displays for an immersive viewing experience.',
    },
    {
      name: 'Keyboards',
      content: 'Ergonomic and responsive keyboards for comfortable typing.',
    },
    {
      name: 'Mice',
      content: 'Precision mice for accurate control and gaming.',
    },
    {
      name: 'Storage Accessories',
      content: 'External drives and docking stations for additional storage.',
    },
  ];

  await db.insert(category).values(categoryRecords);

  log.info('Category records seeded successfully');
}

async function seedProductCategory(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const categoryIDs = await db.select().from(category);

  const productcategoryRecords = [
    {
      product_id: productIDs[0]?.product_id,
      category_id: categoryIDs[1]?.category_id,
    },
    {
      product_id: productIDs[1]?.product_id,
      category_id: categoryIDs[2]?.category_id,
    },
    {
      product_id: productIDs[2]?.product_id,
      category_id: categoryIDs[3]?.category_id,
    },
    {
      product_id: productIDs[3]?.product_id,
      category_id: categoryIDs[4]?.category_id,
    },
    {
      product_id: productIDs[4]?.product_id,
      category_id: categoryIDs[0]?.category_id,
    },
    {
      product_id: productIDs[5]?.product_id,
      category_id: categoryIDs[6]?.category_id,
    },
    {
      product_id: productIDs[6]?.product_id,
      category_id: categoryIDs[5]?.category_id,
    },
    // Add more records as needed
  ];

  await db.insert(product_category).values(productcategoryRecords);

  log.info('Product Category records seeded successfully');
}

async function seedSupplier(db: PostgresJsDatabase<SchemaType>) {
  const supplierRecords = [
    {
      name: 'ABC Computer Supplies',
      contact_number: '123-456-7890',
      remarks: 'Reliable supplier for all computer components.',
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-03-01'),
    },
    {
      name: 'XYZ Electronics',
      contact_number: '987-654-3210',
      remarks: 'Specializes in high-performance gaming hardware.',
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-03-15'),
    },
    {
      name: 'Tech Wholesalers Inc.',
      contact_number: '555-123-4567',
      remarks: 'Offers bulk discounts on all products.',
      created_at: new Date('2023-01-15'),
      last_updated: new Date('2023-03-10'),
    },
    {
      name: 'Gadget Hub',
      contact_number: '555-987-6543',
      remarks: 'New supplier focused on innovative tech solutions.',
      created_at: new Date('2023-02-10'),
      last_updated: new Date('2023-03-20'),
    },
    {
      name: 'CompTech Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Raqui Technology Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Aj Powerhouse Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Shaheen Computer Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Christian Computer World',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Paps Parts Supply',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Reyminator Computer Paradise',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    // Add more supplier records as needed
  ];

  await db.insert(supplier).values(supplierRecords);

  log.info('Supplier records seeded successfully');
}

async function seedOrder(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);

  const orderRecords = [
    {
      product_id: productIDs[0]?.product_id,
      items_ordered: 3,
      expected_arrival: new Date('2023-11-15').toISOString(),
      message: 'Please handle with care.',
      status: 'Pending' as
        | 'Pending'
        | 'Processing'
        | 'Delivered'
        | 'Cancelled'
        | 'Return'
        | 'Shipped',
      created_at: new Date('2023-10-01'),
      last_updated: new Date('2023-10-15'),
    },
    {
      product_id: productIDs[1]?.product_id,
      items_ordered: 5,
      expected_arrival: new Date('2023-11-10').toISOString(),
      message: 'Deliver as soon as possible.',
      status: 'Processing' as
        | 'Pending'
        | 'Processing'
        | 'Delivered'
        | 'Cancelled'
        | 'Return'
        | 'Shipped',
      created_at: new Date('2023-10-05'),
      last_updated: new Date('2023-10-20'),
    },
    {
      product_id: productIDs[2]?.product_id,
      items_ordered: 1,
      expected_arrival: new Date('2023-11-12').toISOString(),
      message: 'Gift wrapping requested.',
      status: 'Shipped' as
        | 'Pending'
        | 'Processing'
        | 'Delivered'
        | 'Cancelled'
        | 'Return'
        | 'Shipped',
      created_at: new Date('2023-10-10'),
      last_updated: new Date('2023-10-22'),
    },
    {
      product_id: productIDs[3]?.product_id,
      items_ordered: 2,
      expected_arrival: new Date('2023-11-20').toISOString(),
      message: 'Contact for any issues.',
      status: 'Delivered' as
        | 'Pending'
        | 'Processing'
        | 'Delivered'
        | 'Cancelled'
        | 'Return'
        | 'Shipped',
      created_at: new Date('2023-10-12'),
      last_updated: new Date('2023-10-23'),
    },
    {
      product_id: productIDs[4]?.product_id,
      items_ordered: 4,
      expected_arrival: new Date('2023-11-30').toISOString(),
      message: 'Please the problem on why your returning it.',
      status: 'Return' as
        | 'Pending'
        | 'Processing'
        | 'Delivered'
        | 'Cancelled'
        | 'Return'
        | 'Shipped',
      created_at: new Date('2023-10-15'),
      last_updated: new Date('2023-10-28'),
    },
    {
      product_id: productIDs[5]?.product_id,
      items_ordered: 6,
      expected_arrival: new Date('2023-11-30').toISOString(),
      message: 'Customer support needed.',
      status: 'Cancelled' as
        | 'Pending'
        | 'Processing'
        | 'Delivered'
        | 'Cancelled'
        | 'Return'
        | 'Shipped',
      created_at: new Date('2023-10-15'),
      last_updated: new Date('2023-10-28'),
    },
    // Add more order records as needed
  ];

  await db.insert(order).values(orderRecords);

  log.info('Order records seeded successfully');
}

async function seedOrderItem(db: PostgresJsDatabase<SchemaType>) {
  const orderIDs = await db.select().from(order);
  const productIDs = await db.select().from(product);

  const orderitemRecords = [
    {
      order_id: orderIDs[0]?.order_id,
      product_id: productIDs[0]?.product_id,
      quantity: 2,
      price: (9.99).toFixed(2), // Convert to string with two decimal places
      created_at: new Date('2023-10-01'),
      last_updated: new Date('2023-10-15'),
    },
    {
      order_id: orderIDs[1]?.order_id,
      product_id: productIDs[1]?.product_id,
      quantity: 1,
      price: (15.49).toFixed(2), // Convert to string with two decimal places,
      created_at: new Date('2023-10-02'),
      last_updated: new Date('2023-10-16'),
    },
    {
      order_id: orderIDs[2]?.order_id,
      product_id: productIDs[2]?.product_id,
      quantity: 3,
      price: (29.99).toFixed(2), // Convert to string with two decimal places,
      created_at: new Date('2023-10-03'),
      last_updated: new Date('2023-10-17'),
    },
    {
      order_id: orderIDs[3]?.order_id,
      product_id: productIDs[3]?.product_id,
      quantity: 4,
      price: (5.99).toFixed(2), // Convert to string with two decimal places,
      created_at: new Date('2023-10-04'),
      last_updated: new Date('2023-10-18'),
    },
    {
      order_id: orderIDs[4]?.order_id,
      product_id: productIDs[4]?.product_id,
      quantity: 5,
      price: (12.0).toFixed(2), // Convert to string with two decimal places,
      created_at: new Date('2023-10-05'),
      last_updated: new Date('2023-10-19'),
    },
    // Additional records...
  ];

  await db.insert(orderItem).values(orderitemRecords);

  log.info('Order Item records seeded successfully');
}

async function seedStockLogs(db: PostgresJsDatabase<SchemaType>) {
  const itemdata = await db.select().from(item);

  const stockRecord = [
    {
      item_id: itemdata[0]?.item_id,
      quantity: 15,
      movement_type: 'Stock In',
      action: 'For the technician',
      created_at: new Date('2023-10-01'),
    },
    {
      item_id: itemdata[1]?.item_id,
      quantity: 10,
      movement_type: 'Stock Out',
      action: 'For the technician',
      created_at: new Date('2023-10-02'),
    },
    {
      item_id: itemdata[2]?.item_id,
      quantity: 5,
      movement_type: 'Stock In',
      action: 'For the sales',
      created_at: new Date('2023-10-03'),
    },
    {
      item_id: itemdata[3]?.item_id,
      quantity: 20,
      movement_type: 'Stock Out',
      action: 'For the sales',
      created_at: new Date('2023-10-04'),
    },
    {
      item_id: itemdata[4]?.item_id,
      quantity: 8,
      movement_type: 'Stock In',
      action: 'For the technician',
      created_at: new Date('2023-10-05'),
    },
    // Add more stock log records as needed
  ];

  await db.insert(stocksLogs).values(stockRecord);

  log.info('Stock Logs records seeded successfully');
}

async function seedArrivedItems(db: PostgresJsDatabase<SchemaType>) {
  const orderIDs = await db.select().from(order);

  const arrivedItemsRecords = [
    {
      order_id: orderIDs[0]?.order_id,
      filePath: 'https://example.com/files/item1.jpg',
      created_at: new Date('2023-10-01'),
      last_updated: new Date('2023-10-02'),
    },
    {
      order_id: orderIDs[1]?.order_id,
      filePath: 'https://example.com/files/item2.jpg',
      created_at: new Date('2023-10-03'),
      last_updated: new Date('2023-10-04'),
    },
    {
      order_id: orderIDs[2]?.order_id,
      filePath: 'https://example.com/files/item3.jpg',
      created_at: new Date('2023-10-05'),
      last_updated: new Date('2023-10-06'),
    },
    {
      order_id: orderIDs[3]?.order_id,
      filePath: 'https://example.com/files/item4.jpg',
      created_at: new Date('2023-10-07'),
      last_updated: new Date('2023-10-08'),
    },
    {
      order_id: orderIDs[4]?.order_id,
      filePath: 'https://example.com/files/item5.jpg',
      created_at: new Date('2023-10-09'),
      last_updated: new Date('2023-10-10'),
    },
    {
      order_id: orderIDs[5]?.order_id,
      filePath: 'https://example.com/files/item5.jpg',
      created_at: new Date('2023-10-09'),
      last_updated: new Date('2023-10-10'),
    },
    // Add more arrived items records as needed
  ];

  await db.insert(arrived_Items).values(arrivedItemsRecords);

  log.info('Arrived Items records seeded successfully');
}

//  =======================================================================================
// =================================== PARTORDER ==========================================

async function main() {
  try {
    await seedDepartments(db);
    await seedDesignations(db);

    await seedEmployeesRole(db);
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
    await seedProductCategory(db);
    await seedItem(db);
    await seedInventoryRecord(db);
    await seedPriceHistory(db);
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
    await seedJobOrderServices(db);

    // Pass employee IDs to seedRemarkTickets
    await seedRemarkType(db);
    await seedRemarkTickets(db); // Ensure this function correctly references employee IDs
    await seedRemarkItems(db);
    await seedReports(db); // Make sure this also properly references customer IDs
    await seedRemarkReports(db);
    await seedRemarkAssigned(db);

    await seedAssignedEmployees(db);
    await seedRemarkContent(db);
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
