import { faker } from '@faker-js/faker';
import { db, pool } from '../mysql/mysql.pool';
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
  // other schemas...
} from './drizzle.schema';
import log from '../lib/logger';

// ===================== EMPLOYEE AND ITS INFORMATION INFORMATION =========================

async function seedEmployees() {
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

async function seedPersonalInformations() {
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

async function seedFinancialInformations() {
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

async function seedSalaryInformations() {
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

async function seedEmploymentInformations() {
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

async function seedDepartments() {
  const departmentStatuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  const departments = Array.from({ length: 10 }).map(() => ({
    name: faker.commerce.department(),
    status: faker.helpers.arrayElement(departmentStatuses),
  }));

  await db.insert(department).values(departments);
  log.info('Department records seeded successfully.');
}

async function seedDesignations() {
  const designationStatuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  const designations = Array.from({ length: 10 }).map(() => ({
    title: faker.person.jobTitle(),
    status: faker.helpers.arrayElement(designationStatuses),
  }));

  await db.insert(designation).values(designations);
  log.info('Designations records seeded successfully.');
}

async function seedActivityLogs() {
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

async function seedLeaveLimits() {
  const employees = await db.select().from(employee);
  const leaveTypes: ('Sick Leave' | 'Vacation Leave' | 'Personal Leave')[] = [
    'Sick Leave',
    'Vacation Leave',
    'Personal Leave',
  ];
  const leaveLimits = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employees).employee_id,
    limit_count: faker.number.float(),
    leaveType: faker.helpers.arrayElement(leaveTypes),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(leaveLimit).values(leaveLimits);
  log.info('Leave Limit records seeded successfully.');
}

async function seedLeaveRequests() {
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
    date_of_leave: faker.date.past(),
    date_of_return: faker.date.future(),
    status: faker.helpers.arrayElement(statuses),
    comment: faker.lorem.sentence(),
    leaveType: faker.helpers.arrayElement(leaveTypes),
  }));

  await db.insert(leaveRequest).values(leaveRequests);
  log.info('Leave Request records seeded successfully.');
}

//  =======================================================================================
// ==================================== PAYROLL ===========================================

async function seedPayrolls() {
  const statuses: ('Active' | 'Inactive' | 'Inprogress')[] = [
    'Active',
    'Inactive',
    'Inprogress',
  ];

  const payrolls = Array.from({ length: 50 }).map(() => ({
    start: faker.date.past(),
    end: faker.date.future(),
    pay_date: faker.date.future(),
    status: faker.helpers.arrayElement(statuses),
  }));

  await db.insert(payroll).values(payrolls);

  log.info('Payroll records seeded successfully.');
}

async function seedOnPayrolls() {
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

async function seedSignatory() {
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

async function seedPayrollApprovals() {
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
    approval_date: faker.date.past(),
  }));

  await db.insert(payrollApproval).values(payrollApprovalRecords);
  log.info('Payroll approval records seeded successfully.');
}

async function seedPayrollReportRecords() {
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
async function seedDeductions() {
  const employeeIDs = await db.select().from(employee);

  const deductionRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    start: faker.date.past(),
    end: faker.date.future(),
    deduction_type: faker.commerce.productMaterial(),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(deductions).values(deductionRecords);

  log.info('Deductions records seeded successfully.');
}
async function seedBenefits() {
  const employeeIDs = await db.select().from(employee);

  const benefitRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    start: faker.date.past(),
    end: faker.date.future(),
    benefits_type: faker.commerce.product(),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(benefits).values(benefitRecords);

  log.info('Benefits records seeded successfully.');
}

async function seedAdjustments() {
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

async function seedAdditionalPay() {
  const employeeIDs = await db.select().from(employee);

  const additionalPayRecords = Array.from({ length: 50 }).map(() => ({
    employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
    additional_pay_type: faker.commerce.product(),
    amount: parseFloat(faker.finance.amount({ min: 100, max: 1000, dec: 2 })),
    description: faker.lorem.sentence(),
  }));

  await db.insert(additionalPay).values(additionalPayRecords);

  log.info('Additional pay records seeded successfully.');
}

async function seedAttendance() {
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
    date: faker.date.recent(),
    clock_in: faker.date.recent(),
    clock_out: faker.date.future(),
    hoursWorked: faker.finance.amount({ min: 1, max: 12, dec: 2 }),
    status: faker.helpers.arrayElement(attendanceStatuses),
    description: faker.lorem.sentence(),
  }));

  await db.insert(attendance).values(attendanceRecords);

  log.info('Attendance records seeded successfully.');
}

//  =======================================================================================
// ===================================== SALES ======================================

//  =======================================================================================
// ==================================== SERVICES ======================================

//  =======================================================================================
// =================================== INVENTORY ==========================================

async function seedItem() {
  const productIDs = await db.select().from(product);

  const itemRecords = Array.from({ length: 50 }).map(() => ({
    product_id: faker.helpers.arrayElement(productIDs).product_id,
    stock: faker.datatype.number({ min: 100, max: 500 }),
    re_order_level: faker.datatype.number({ min: 100, max: 500 }),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(item).values(itemRecords);

  log.info('Item records seeded successfully');
}

async function seedProduct() {
  const categoryIDs = await db.select().from(category);
  const supplierIDs = await db.select().from(supplier);

  const productRecords = Array.from({ length: 50 }).map(() => ({
    category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    price: faker.finance.amount({ min: 1, max: 12, dec: 2 }),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(product).values(productRecords);

  log.info('Product records seeded successfully');
}

async function seedCategory() {
  const categoryRecords = Array.from({ length: 25 }).map(() => ({
    name: faker.commerce.department(),
    content: faker.lorem.paragraph(),
  }));

  await db.insert(category).values(categoryRecords);

  log.info('Category records seeded successfully');
}

async function seedSupplier() {
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

async function seedOrder() {
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
    expected_arrival: faker.date.future(),
    status: faker.helpers.arrayElement(statuses),
    created_at: faker.date.recent(),
    last_updated: faker.date.recent(),
  }));

  await db.insert(order).values(orderRecords);

  log.info('Order records seeded successfully');
}

async function seedArrivedItems() {
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
  await seedDepartments();
  await seedDesignations();
  await seedEmployees();

  await seedActivityLogs();
  await seedPersonalInformations();
  await seedFinancialInformations();
  await seedSalaryInformations();
  await seedEmploymentInformations();
  await seedLeaveLimits();

  await seedLeaveRequests();

  await seedPayrolls();
  await seedOnPayrolls();
  await seedSignatory();
  await seedPayrollApprovals();
  await seedPayrollReportRecords();

  await seedBenefits();
  await seedDeductions();
  await seedAdditionalPay();
  await seedAdjustments();
  await seedAttendance();

  //Inventory

  await seedCategory();
  await seedSupplier();
  await seedProduct();
  await seedOrder();
  await seedArrivedItems();
  await seedItem();
  log.info('Generating Dummy Data Completed');
}

main()
  .then(async () => {
    await pool.end();
  })
  .catch(async (e) => {
    log.error(e);
    await pool.end();
    process.exit(1);
  });
