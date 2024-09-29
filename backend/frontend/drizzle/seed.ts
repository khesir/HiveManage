import { faker } from '@faker-js/faker';
import {
  employee,
  personalInformation,
  financialInformation,
  salaryInformation,
  employmentInformation,
  department,
  designation,
  activityLog,
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
  sales,
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
  // other schemas...
} from './drizzle.schema';
import log from '../lib/logger';
import Database from './pool';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// ===================== EMPLOYEE AND ITS INFORMATION INFORMATION =========================

async function seedEmployees(db: PostgresJsDatabase) {
  const employeeStatus: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];
  const employees = Array.from({ length: 50 }).map(() => ({
    uuid: faker.string.uuid(),
    firstname: faker.person.firstName(),
    middlename: faker.person.firstName(),
    lastname: faker.person.lastName(),
    status: faker.helpers.arrayElement(employeeStatus),
  }));

  await db.insert(employee).values(employees);
  log.info('Employee records seeded successfully.');
}

async function seedPersonalInformations(db: PostgresJsDatabase) {
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

async function seedFinancialInformations(db: PostgresJsDatabase) {
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

async function seedSalaryInformations(db: PostgresJsDatabase) {
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

async function seedEmploymentInformations(db: PostgresJsDatabase) {
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
  }));

  await db.insert(employmentInformation).values(employmentInfos);
  log.info('Employee Information records seeded successfully.');
}

//  =======================================================================================
// =============================== COMPANY FEATURES ======================================

async function seedDepartments(db: PostgresJsDatabase) {
  const departmentStatuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  const departments = Array.from({ length: 10 }).map(() => ({
    name: faker.commerce.department(),
    status: faker.helpers.arrayElement(departmentStatuses),
  }));

  await db.insert(department).values(departments);
  log.info('Department records seeded successfully.');
}

async function seedDesignations(db: PostgresJsDatabase) {
  const designationStatuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  const designations = Array.from({ length: 10 }).map(() => ({
    title: faker.person.jobTitle(),
    status: faker.helpers.arrayElement(designationStatuses),
  }));

  await db.insert(designation).values(designations);
  log.info('Designations records seeded successfully.');
}

async function seedActivityLogs(db: PostgresJsDatabase) {
  const employees = await db.select().from(employee);

  const actions: ('Hired' | 'Promoted' | 'Terminated' | 'Resigned')[] = [
    'Hired',
    'Promoted',
    'Terminated',
    'Resigned',
  ];

  const activityLogs = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    action: faker.helpers.arrayElement(actions),
  }));

  await db.insert(activityLog).values(activityLogs);
  log.info('Activity Logs records seeded successfully.');
}

async function seedLeaveLimits(db: PostgresJsDatabase) {
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

async function seedLeaveRequests(db: PostgresJsDatabase) {
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

async function seedPayrolls(db: PostgresJsDatabase) {
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

async function seedOnPayrolls(db: PostgresJsDatabase) {
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

async function seedSignatory(db: PostgresJsDatabase) {
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

async function seedPayrollApprovals(db: PostgresJsDatabase) {
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

async function seedPayrollReportRecords(db: PostgresJsDatabase) {
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
async function seedDeductions(db: PostgresJsDatabase) {
  const employeeIDs = await db.select().from(employee);

  const deductionRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    start: faker.date.past().toISOString(),
    end: faker.date.future().toISOString(),
    deduction_type: faker.commerce.productMaterial(),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(deductions).values(deductionRecords);

  log.info('Deductions records seeded successfully.');
}
async function seedBenefits(db: PostgresJsDatabase) {
  const employeeIDs = await db.select().from(employee);

  const benefitRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    start: faker.date.past().toISOString(),
    end: faker.date.future().toISOString(),
    benefits_type: faker.commerce.product(),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(benefits).values(benefitRecords);

  log.info('Benefits records seeded successfully.');
}

async function seedAdjustments(db: PostgresJsDatabase) {
  const employeeIDs = await db.select().from(employee);

  const adjustmentRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    remarks: faker.lorem.sentence(),
    adjustments_type: faker.commerce.productMaterial(),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(adjustments).values(adjustmentRecords);

  log.info('Adjustments records seeded successfully.');
}

async function seedAdditionalPay(db: PostgresJsDatabase) {
  const employeeIDs = await db.select().from(employee);

  const allowedAdditionalPayTypes: (
    | 'Bonus'
    | 'Comission'
    | 'Overtime'
    | 'Other'
  )[] = ['Bonus', 'Comission', 'Overtime', 'Other'];

  const additionalPayRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    additional_pay_type: faker.helpers.arrayElement(allowedAdditionalPayTypes),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(additionalPay).values(additionalPayRecords);

  log.info('Additional pay records seeded successfully.');
}

async function seedAttendance(db: PostgresJsDatabase) {
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
async function seedParticipants(db: PostgresJsDatabase) {
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

async function seedChannel(db: PostgresJsDatabase) {
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

async function seedMessage(db: PostgresJsDatabase) {
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

async function seedInquiry(db: PostgresJsDatabase) {
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

async function seedCustomer(db: PostgresJsDatabase) {
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

  const customerRecords = Array.from({ length: 70 }).map(() => ({
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    contact_phone: faker.phone.number(),
    socials: faker.internet.email(),
    address_line: faker.location.city(),
    barangay: faker.location.city(),
    province: faker.location.city(),
    standing: faker.helpers.arrayElement(status),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(customer).values(customerRecords);
  log.info('Customer records seeded successfully');
}

//  =======================================================================================
// ===================================== SALES ======================================

async function seedSalesItem(db: PostgresJsDatabase) {
  const salesIDs = await db.select().from(sales);
  const itemIDs = await db.select().from(item);

  const salesItemRecords = Array.from({ length: 70 }).map(() => ({
    sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
    item_id: faker.helpers.arrayElement(itemIDs).item_id,
    quantity: faker.number.int({ min: 1, max: 100 }), // Adjust max as needed
    is_service_item: faker.datatype.boolean(), // Changed to boolean
    total_price: faker.finance.amount({ min: 1, max: 12, dec: 2 }),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(sales_items).values(salesItemRecords);

  log.info('Sales Items records seeded successfully');
}

async function seedSales(db: PostgresJsDatabase) {
  const employeeIDs = await db.select().from(employee);
  const customerIDs = await db.select().from(customer);

  const salesRecords = Array.from({ length: 70 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
    total_amount: parseFloat(faker.finance.amount({ min: 1, max: 12, dec: 2 })),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(sales).values(salesRecords);

  log.info('Sales records seeded successfully');
}

async function seedPayment(db: PostgresJsDatabase) {
  const salesIDs = await db.select().from(sales);

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
    sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
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

async function seedReceipt(db: PostgresJsDatabase) {
  const salesIDs = await db.select().from(sales);
  const paymentIDs = await db.select().from(payment);

  const receiptRecords = Array.from({ length: 70 }).map(() => ({
    sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
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

async function seedReserve(db: PostgresJsDatabase) {
  const salesIDs = await db.select().from(sales);
  const serviceIDs = await db.select().from(service);

  const reserveRecords = Array.from({ length: 70 }).map(() => ({
    sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
    service_id: faker.helpers.arrayElement(serviceIDs).service_id,
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(reserve).values(reserveRecords);

  log.info('Reserve records seeded successfully');
}

async function seedBorrow(db: PostgresJsDatabase) {
  const salesIDs = await db.select().from(sales);
  const serviceIDs = await db.select().from(service);
  const itemIDs = await db.select().from(item);

  const statuses: (
    | 'Requested'
    | 'Approved'
    | 'Borrowed'
    | 'Returned'
    | 'Overdue'
    | 'Rejected'
    | 'Cancelled'
    | 'Lost'
    | 'Damaged'
  )[] = [
    'Requested',
    'Approved',
    'Borrowed',
    'Returned',
    'Overdue',
    'Rejected',
    'Cancelled',
    'Lost',
    'Damaged',
  ];

  const borrowRecords = Array.from({ length: 70 }).map(() => ({
    sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
    service_id: faker.helpers.arrayElement(serviceIDs).service_id,
    item_id: faker.helpers.arrayElement(itemIDs).item_id,
    borrow_date: faker.date.past().toISOString(),
    return_date: faker.date.future().toISOString(),
    status: faker.helpers.arrayElement(statuses),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(borrow).values(borrowRecords);

  log.info('Borrow records seeded successfully');
}

async function seedService(db: PostgresJsDatabase) {
  const salesIDs = await db.select().from(sales);

  const statuses: (
    | 'Repair'
    | 'Sell'
    | 'Buy'
    | 'Borrow'
    | 'Return'
    | 'Exchange'
  )[] = ['Repair', 'Sell', 'Buy', 'Borrow', 'Return', 'Exchange'];

  const serviceRecords = Array.from({ length: 70 }).map(() => ({
    sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
    service_title: faker.person.jobTitle(),
    service_type: faker.helpers.arrayElement(statuses),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(service).values(serviceRecords);

  log.info('Service records seeded successfully');
}
//  =======================================================================================
// =================================== JOB ORDER ==========================================

async function seedJobOrder(db: PostgresJsDatabase) {
  const employeeIDs = await db.select().from(employee);
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

  const joborderRecords = Array.from({ length: 70 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    service_id: faker.helpers.arrayElement(serviceIDs).service_id,
    steps: faker.lorem.paragraph(),
    required_items: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(statuses),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(jobOrder).values(joborderRecords);

  log.info('Job Order records seeded successfully');
}

async function seedReports(db: PostgresJsDatabase) {
  const joborderIDs = await db.select().from(jobOrder);

  const reportsRecords = Array.from({ length: 70 }).map(() => ({
    job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
    remarks: faker.lorem.sentence(),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(reports).values(reportsRecords);

  log.info('Report records seeded successfully');
}
//  =======================================================================================
// =================================== INVENTORY ==========================================

async function seedItem(db: PostgresJsDatabase) {
  const productIDs = await db.select().from(product);

  const itemRecords = Array.from({ length: 50 }).map(() => ({
    product_id: faker.helpers.arrayElement(productIDs).product_id,
    stock: faker.number.int({ min: 100, max: 500 }),
    re_order_level: faker.number.int({ min: 100, max: 500 }),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(item).values(itemRecords);

  log.info('Item records seeded successfully');
}

async function seedProduct(db: PostgresJsDatabase) {
  const categoryIDs = await db.select().from(category);
  const supplierIDs = await db.select().from(supplier);

  const productRecords = Array.from({ length: 50 }).map(() => ({
    category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    price: parseFloat(faker.finance.amount({ min: 1, max: 12, dec: 2 })),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(product).values(productRecords);

  log.info('Product records seeded successfully');
}

async function seedCategory(db: PostgresJsDatabase) {
  const categoryRecords = Array.from({ length: 25 }).map(() => ({
    name: faker.commerce.department(),
    content: faker.lorem.paragraph(),
  }));

  await db.insert(category).values(categoryRecords);

  log.info('Category records seeded successfully');
}

async function seedSupplier(db: PostgresJsDatabase) {
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

async function seedOrder(db: PostgresJsDatabase) {
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
    status: faker.helpers.arrayElement(statuses),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(order).values(orderRecords);

  log.info('Order records seeded successfully');
}

async function seedArrivedItems(db: PostgresJsDatabase) {
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
  const pool = Database.getInstance();
  const db = await pool.connect();
  try {
    await seedDepartments(db);
    await seedDesignations(db);
    await seedEmployees(db);

    await seedActivityLogs(db);
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

    //Inventory

    await seedCategory(db);
    await seedSupplier(db);
    await seedProduct(db);
    await seedOrder(db);
    await seedArrivedItems(db);
    await seedItem(db);

    // Participants and related data
    await seedCustomer(db);
    await seedInquiry(db);
    await seedMessage(db);
    await seedChannel(db);
    await seedParticipants(db);

    // Sales and related data
    await seedSales(db);
    await seedSalesItem(db);
    await seedPayment(db);
    await seedReceipt(db);
    await seedService(db);
    await seedReserve(db);
    await seedBorrow(db);

    // Job Order and related data
    await seedJobOrder(db);
    await seedReports(db);
  } catch (error) {
    console.log(error);
  } finally {
    pool.disconnect();
  }
  log.info('Generating Dummy Data Completed');
}

main().catch((error) => {
  log.error('An unexpected error occurred:', error);
  process.exit(1);
});
