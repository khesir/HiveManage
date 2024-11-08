/* eslint-disable @typescript-eslint/no-unused-vars */
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
  employee_roles,
  remarkcontent,
  product_category,
  price_history,
  inventory_record,
  joborder_services,
  roles,
  position,
} from './drizzle.schema';
import log from '../lib/logger';
import { db, pool } from './pool';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SupabaseService } from '../supabase/supabase.service';
// ===================== EMPLOYEE BASE =========================

async function seedEmployees(db: PostgresJsDatabase<SchemaType>) {
  const employeeStatus: ('Online' | 'Offline')[] = ['Online', 'Offline'];
  const departments = await db.select().from(department);
  const employeePositions = await db.select().from(position);

  const employees = [
    {
      department_id: faker.helpers.arrayElement(departments).department_id,
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Aj',
      middlename: 'Rizaldo',
      lastname: 'Tollo',
      email: 'ajrizaldo1@example.com',
      status: faker.helpers.arrayElement(employeeStatus),
    },
    {
      department_id: faker.helpers.arrayElement(departments).department_id,
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Jane',
      middlename: 'Ann',
      lastname: 'Smith',
      email: 'jane.smith@example.com',
      status: faker.helpers.arrayElement(employeeStatus),
    },
    {
      department_id: faker.helpers.arrayElement(departments).department_id,
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Jacob',
      middlename: 'Ann',
      lastname: 'Thompson',
      email: 'Jacob.Thompson@example.com',
      status: faker.helpers.arrayElement(employeeStatus),
    },
    {
      department_id: faker.helpers.arrayElement(departments).department_id,
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Olivia ',
      middlename: 'Ann',
      lastname: 'Martinez',
      email: 'Olivia.Martinez@example.com',
      status: faker.helpers.arrayElement(employeeStatus),
    },
    {
      department_id: faker.helpers.arrayElement(departments).department_id,
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Ethan',
      middlename: 'Ann',
      lastname: 'Lewis',
      email: 'Ethan.Lewis@example.com',
      status: faker.helpers.arrayElement(employeeStatus),
    },
  ];

  await db.insert(employee).values(employees);
}

async function seedEmployeesAccount(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);
  const employeeroleIDs = await db.select().from(roles);
  const supabaseService = SupabaseService.getInstance();

  const users = await Promise.all(
    employeeIDs.map(async (emp) => {
      const email = emp.email;
      const password = '123456789';
      const user = await supabaseService.createSupabaseUser(email, password);
      const data = {
        employee_id: emp.employee_id,
        role_id: faker.helpers.arrayElement(employeeroleIDs).role_id,
        user_id: user.data.user?.id,
      };
      return data;
    }),
  );

  await db.insert(employee_roles).values(users);
}

async function seedEmployeesRole(db: PostgresJsDatabase<SchemaType>) {
  const employeesRole = [
    { name: 'Administrator' },
    { name: 'Manager' },
    { name: 'Staff' },
  ];

  await db.insert(roles).values(employeesRole);
}

async function seedEmployeePosition(db: PostgresJsDatabase<SchemaType>) {
  const employeePosition = [
    { name: 'Admin' },
    { name: 'Technician' },
    { name: 'Sales' },
  ];

  await db.insert(position).values(employeePosition);
}

// ===================== Employee Informations =========================

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

  const personalInfos = [
    {
      employee_id: employees[0].employee_id,
      birthday: '1985-03-15',
      gender: faker.helpers.arrayElement(allowedGenders),
      phone: '09171234567',
      email: 'john.doe@example.com',
      address_line: '1234 Elm Street',
      postal_code: '12345',
      emergency_contact_name: 'Jane Doe',
      emergency_contact_phone: '09181234567',
      emergency_contact_relationship:
        faker.helpers.arrayElement(allowedRelationships),
    },
    {
      employee_id: employees[1].employee_id,
      birthday: '1990-06-20',
      gender: faker.helpers.arrayElement(allowedGenders),
      phone: '09171234568',
      email: 'alice.smith@example.com',
      address_line: '5678 Oak Avenue',
      postal_code: '67890',
      emergency_contact_name: 'Bob Smith',
      emergency_contact_phone: '09181234568',
      emergency_contact_relationship:
        faker.helpers.arrayElement(allowedRelationships),
    },
    {
      employee_id: employees[2].employee_id,
      birthday: '1990-06-20',
      gender: faker.helpers.arrayElement(allowedGenders),
      phone: '09171234568',
      email: 'alice.smith@example.com',
      address_line: '5678 Oak Avenue',
      postal_code: '67890',
      emergency_contact_name: 'Bob Smith',
      emergency_contact_phone: '09181234568',
      emergency_contact_relationship:
        faker.helpers.arrayElement(allowedRelationships),
    },
    {
      employee_id: employees[3].employee_id,
      birthday: '1990-06-20',
      gender: faker.helpers.arrayElement(allowedGenders),
      phone: '09171234568',
      email: 'alice.smith@example.com',
      address_line: '5678 Oak Avenue',
      postal_code: '67890',
      emergency_contact_name: 'Bob Smith',
      emergency_contact_phone: '09181234568',
      emergency_contact_relationship:
        faker.helpers.arrayElement(allowedRelationships),
    },
    {
      employee_id: employees[4].employee_id,
      birthday: '1990-06-20',
      gender: faker.helpers.arrayElement(allowedGenders),
      phone: '09171234568',
      email: 'alice.smith@example.com',
      address_line: '5678 Oak Avenue',
      postal_code: '67890',
      emergency_contact_name: 'Bob Smith',
      emergency_contact_phone: '09181234568',
      emergency_contact_relationship:
        faker.helpers.arrayElement(allowedRelationships),
    },
    {
      employee_id: employees[5].employee_id,
      birthday: '1990-06-20',
      gender: faker.helpers.arrayElement(allowedGenders),
      phone: '09171234568',
      email: 'alice.smith@example.com',
      address_line: '5678 Oak Avenue',
      postal_code: '67890',
      emergency_contact_name: 'Bob Smith',
      emergency_contact_phone: '09181234568',
      emergency_contact_relationship:
        faker.helpers.arrayElement(allowedRelationships),
    },
    {
      employee_id: employees[6].employee_id,
      birthday: '1990-06-20',
      gender: faker.helpers.arrayElement(allowedGenders),
      phone: '09171234568',
      email: 'alice.smith@example.com',
      address_line: '5678 Oak Avenue',
      postal_code: '67890',
      emergency_contact_name: 'Bob Smith',
      emergency_contact_phone: '09181234568',
      emergency_contact_relationship:
        faker.helpers.arrayElement(allowedRelationships),
    },
    // Add more entries as needed
  ];

  await db.insert(personalInformation).values(personalInfos);
  log.info('Personal Information records seeded successfully.');
}

async function seedFinancialInformations(db: PostgresJsDatabase<SchemaType>) {
  const employees = await db.select().from(employee);

  const financialInfos = [
    {
      employee_id: employees[0].employee_id,
      pag_ibig_id: '123456789012',
      sss_id: '1234567890',
      philhealth_id: '123456789012',
      tin: '123456789',
      bank_account_number: '1234567890123456',
    },
    {
      employee_id: employees[1].employee_id,
      pag_ibig_id: '123456789012',
      sss_id: '1234567890',
      philhealth_id: '123456789012',
      tin: '123456789',
      bank_account_number: '1234567890123456',
    },
    {
      employee_id: employees[2].employee_id,
      pag_ibig_id: '123456789012',
      sss_id: '1234567890',
      philhealth_id: '123456789012',
      tin: '123456789',
      bank_account_number: '1234567890123456',
    },
    {
      employee_id: employees[3].employee_id,
      pag_ibig_id: '123456789012',
      sss_id: '1234567890',
      philhealth_id: '123456789012',
      tin: '123456789',
      bank_account_number: '1234567890123456',
    },
    {
      employee_id: employees[4].employee_id,
      pag_ibig_id: '123456789012',
      sss_id: '1234567890',
      philhealth_id: '123456789012',
      tin: '123456789',
      bank_account_number: '1234567890123456',
    },
    {
      employee_id: employees[5].employee_id,
      pag_ibig_id: '123456789012',
      sss_id: '1234567890',
      philhealth_id: '123456789012',
      tin: '123456789',
      bank_account_number: '1234567890123456',
    },
    {
      employee_id: employees[6].employee_id,
      pag_ibig_id: '123456789012',
      sss_id: '1234567890',
      philhealth_id: '123456789012',
      tin: '123456789',
      bank_account_number: '1234567890123456',
    },
    {
      employee_id: employees[7].employee_id,
      pag_ibig_id: '123456789012',
      sss_id: '1234567890',
      philhealth_id: '123456789012',
      tin: '123456789',
      bank_account_number: '1234567890123456',
    },
    {
      employee_id: employees[8].employee_id,
      pag_ibig_id: '123456789012',
      sss_id: '1234567890',
      philhealth_id: '123456789012',
      tin: '123456789',
      bank_account_number: '1234567890123456',
    },
  ];

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

  const salaryInfos = [
    {
      employee_id: employees[1].employee_id,
      payroll_frequency: faker.helpers.arrayElement(allowedFrequencies),
      base_salary: 50000,
    },
    {
      employee_id: employees[2].employee_id,
      payroll_frequency: faker.helpers.arrayElement(allowedFrequencies),
      base_salary: 25000,
    },
    {
      employee_id: employees[3].employee_id,
      payroll_frequency: faker.helpers.arrayElement(allowedFrequencies),
      base_salary: 30000,
    },
    {
      employee_id: employees[4].employee_id,
      payroll_frequency: faker.helpers.arrayElement(allowedFrequencies),
      base_salary: 30000,
    },
    {
      employee_id: employees[5].employee_id,
      payroll_frequency: faker.helpers.arrayElement(allowedFrequencies),
      base_salary: 30000,
    },
    {
      employee_id: employees[6].employee_id,
      payroll_frequency: faker.helpers.arrayElement(allowedFrequencies),
      base_salary: 30000,
    },
    {
      employee_id: employees[7].employee_id,
      payroll_frequency: faker.helpers.arrayElement(allowedFrequencies),
      base_salary: 30000,
    },
    {
      employee_id: employees[8].employee_id,
      payroll_frequency: faker.helpers.arrayElement(allowedFrequencies),
      base_salary: 30000,
    },
  ];

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

  // Sample data for employees, departments, and designations
  const employees = await db.select().from(employee);
  const departments = await db.select().from(department);
  const designations = await db.select().from(designation);

  // Generate employment information using realistic sample data
  const employmentInfos = [
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Employed since January 2022.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Currently on maternity leave.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Contract extended until December 2024.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Left the company for personal reasons.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Hired for the summer season.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Temporary position for 3 months.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Retired after 30 years of service.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Terminated due to performance issues.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'On probation for the first 6 months.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Suspended pending investigation.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Promoted to Senior Developer.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'On sick leave.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Recognized for excellence in service.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Last day on the job was last week.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Hired for the winter season.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Retired after 25 years of service.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Contract not renewed.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'New hire, excited to join the team.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'On vacation for two weeks.',
    },
    {
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      department_id: faker.helpers.arrayElement(departments).department_id,
      designation_id: faker.helpers.arrayElement(designations).designation_id,
      employee_type: faker.helpers.arrayElement(allowedEmployeeTypes),
      employee_status: faker.helpers.arrayElement(allowedEmployeeStatuses),
      message: 'Currently assisting during peak season.',
    },
    // Continue adding more realistic entries until you reach 50...
  ];

  await db.insert(employmentInformation).values(employmentInfos);
  log.info('Employee Information records seeded successfully.');
}

//  =======================================================================================
// =============================== COMPANY FEATURES ======================================

async function seedDepartments(db: PostgresJsDatabase<SchemaType>) {
  const departmentStatuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];
  const departments = [
    {
      name: 'Technical Support',
      status: faker.helpers.arrayElement(departmentStatuses),
    },
    {
      name: 'Maintenance and Repair',
      status: faker.helpers.arrayElement(departmentStatuses),
    },
    {
      name: 'Field Service',
      status: faker.helpers.arrayElement(departmentStatuses),
    },
    {
      name: 'IT Support',
      status: faker.helpers.arrayElement(departmentStatuses),
    },
    {
      name: 'Production/Operations ',
      status: faker.helpers.arrayElement(departmentStatuses),
    },
    {
      name: 'Retail Sales',
      status: faker.helpers.arrayElement(departmentStatuses),
    },
    {
      name: 'Sales Support',
      status: faker.helpers.arrayElement(departmentStatuses),
    },
    {
      name: 'Inside Sales',
      status: faker.helpers.arrayElement(departmentStatuses),
    },
  ];

  await db.insert(department).values(departments);
  log.info('Department records seeded successfully.');
}

async function seedDesignations(db: PostgresJsDatabase<SchemaType>) {
  const designationStatuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

  const designations = [
    {
      title: 'Software Engineer',
      status: faker.helpers.arrayElement(designationStatuses),
    },
    {
      title: 'Project Manager',
      status: faker.helpers.arrayElement(designationStatuses),
    },
    {
      title: 'Product Designer',
      status: faker.helpers.arrayElement(designationStatuses),
    },
    {
      title: 'Data Analyst',
      status: faker.helpers.arrayElement(designationStatuses),
    },
    {
      title: 'System Administrator',
      status: faker.helpers.arrayElement(designationStatuses),
    },
    {
      title: 'Marketing Specialist',
      status: faker.helpers.arrayElement(designationStatuses),
    },
    {
      title: 'Sales Associate',
      status: faker.helpers.arrayElement(designationStatuses),
    },
    {
      title: 'Human Resources Manager',
      status: faker.helpers.arrayElement(designationStatuses),
    },
    {
      title: 'Customer Support Specialist',
      status: faker.helpers.arrayElement(designationStatuses),
    },
    {
      title: 'Financial Analyst',
      status: faker.helpers.arrayElement(designationStatuses),
    },
  ];

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

  const auditlogs = [
    {
      employee_id: employees[0].employee_id, // Assuming employee_id is valid
      entity_id: 1,
      entity_type: faker.helpers.arrayElement(entity_type),
      action: 'Added new employee to the system.',
      change: {
        Employee: 'John Doe',
        JobOrder: '',
        Sales: '',
        Service: '',
        Inventory: '',
        Order: '',
      },
    },
    {
      employee_id: employees[1].employee_id,
      entity_id: 2,
      entity_type: faker.helpers.arrayElement(entity_type),
      action: 'Created a new job order.',
      change: {
        Employee: '',
        JobOrder: 'Job Order #101',
        Sales: '',
        Service: '',
        Inventory: '',
        Order: '',
      },
    },
    {
      employee_id: employees[2].employee_id,
      entity_id: 3,
      entity_type: faker.helpers.arrayElement(entity_type),
      action: 'Processed a sale transaction.',
      change: {
        Employee: '',
        JobOrder: '',
        Sales: '$299.99',
        Service: '',
        Inventory: '',
        Order: '',
      },
    },
    {
      employee_id: employees[3].employee_id,
      entity_id: 4,
      entity_type: faker.helpers.arrayElement(entity_type),
      action: 'Performed a service request.',
      change: {
        Employee: '',
        JobOrder: '',
        Sales: '',
        Service: 'Fixing computer issues.',
        Inventory: '',
        Order: '',
      },
    },
    {
      employee_id: employees[4].employee_id,
      entity_id: 5,
      entity_type: faker.helpers.arrayElement(entity_type),
      action: 'Added new inventory item.',
      change: {
        Employee: '',
        JobOrder: '',
        Sales: '',
        Service: '',
        Inventory: 'Dell XPS 15 Laptop',
        Order: '',
      },
    },
    {
      employee_id: employees[5].employee_id,
      entity_id: 6,
      entity_type: faker.helpers.arrayElement(entity_type),
      action: 'Updated order details.',
      change: {
        Employee: '',
        JobOrder: '',
        Sales: '',
        Service: '',
        Inventory: '',
        Order: 'Order #202 for MacBook Pro',
      },
    },
    // Additional records can be added similarly...
  ];

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

  const leaveLimits = [
    {
      employee_id: employees[0]?.employee_id || null,
      limit_count: 12.0, // Example limit for Sick Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-01'), // Example date
      last_updated: new Date('2024-11-01'),
    },
    {
      employee_id: employees[1]?.employee_id || null,
      limit_count: 15.0, // Example limit for Vacation Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-02'),
      last_updated: new Date('2024-11-01'),
    },
    {
      employee_id: employees[2]?.employee_id || null,
      limit_count: 10.0, // Example limit for Personal Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-03'),
      last_updated: new Date('2024-11-01'),
    },
    {
      employee_id: employees[3]?.employee_id || null,
      limit_count: 8.0, // Example limit for Sick Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-04'),
      last_updated: new Date('2024-11-01'),
    },
    {
      employee_id: employees[4]?.employee_id || null,
      limit_count: 20.0, // Example limit for Vacation Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-05'),
      last_updated: new Date('2024-11-01'),
    },
    {
      employee_id: employees[5]?.employee_id || null,
      limit_count: 5.0, // Example limit for Personal Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-06'),
      last_updated: new Date('2024-11-01'),
    },
    {
      employee_id: employees[6]?.employee_id || null,
      limit_count: 12.5, // Example limit for Sick Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-07'),
      last_updated: new Date('2024-11-01'),
    },
    {
      employee_id: employees[7]?.employee_id || null,
      limit_count: 18.0, // Example limit for Vacation Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-08'),
      last_updated: new Date('2024-11-01'),
    },
    {
      employee_id: employees[8]?.employee_id || null,
      limit_count: 9.0, // Example limit for Personal Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-09'),
      last_updated: new Date('2024-11-01'),
    },
    {
      employee_id: employees[9]?.employee_id || null,
      limit_count: 14.0, // Example limit for Sick Leave
      leaveType: faker.helpers.arrayElement(leaveTypes),
      created_at: new Date('2024-01-10'),
      last_updated: new Date('2024-11-01'),
    },
    // Add more records as needed...
  ];

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

  const leaveRequests = [
    {
      employee_id: employees[0]?.employee_id || null,
      title: 'Request for Sick Leave',
      content: 'I would like to request sick leave due to illness.',
      date_of_leave: new Date('2024-11-01').toISOString(),
      date_of_return: new Date('2024-11-03').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Awaiting approval.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    {
      employee_id: employees[1]?.employee_id || null,
      title: 'Vacation Leave Request',
      content: 'I am requesting vacation leave for personal reasons.',
      date_of_leave: new Date('2024-12-10').toISOString(),
      date_of_return: new Date('2024-12-20').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Approved by manager.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    {
      employee_id: employees[2]?.employee_id || null,
      title: 'Personal Leave Request',
      content: 'I need personal leave for family matters.',
      date_of_leave: new Date('2024-11-05').toISOString(),
      date_of_return: new Date('2024-11-06').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Insufficient leave balance.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    {
      employee_id: employees[3]?.employee_id || null,
      title: 'Sick Leave Application',
      content: 'I am unable to work due to illness and request sick leave.',
      date_of_leave: new Date('2024-11-07').toISOString(),
      date_of_return: new Date('2024-11-10').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Pending further review.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    {
      employee_id: employees[4]?.employee_id || null,
      title: 'Vacation Request',
      content: 'Requesting vacation leave from December 1 to December 10.',
      date_of_leave: new Date('2024-12-01').toISOString(),
      date_of_return: new Date('2024-12-10').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Manager approved.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    {
      employee_id: employees[5]?.employee_id || null,
      title: 'Personal Leave',
      content: 'I need to take personal leave for personal commitments.',
      date_of_leave: new Date('2024-11-15').toISOString(),
      date_of_return: new Date('2024-11-16').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Leave request denied.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    {
      employee_id: employees[6]?.employee_id || null,
      title: 'Sick Leave Needed',
      content: 'Due to my health, I need to take sick leave.',
      date_of_leave: new Date('2024-11-12').toISOString(),
      date_of_return: new Date('2024-11-14').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Pending management approval.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    {
      employee_id: employees[7]?.employee_id || null,
      title: 'Vacation Leave Application',
      content: 'Requesting vacation leave for family trip.',
      date_of_leave: new Date('2024-12-15').toISOString(),
      date_of_return: new Date('2024-12-30').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Approved for vacation.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    {
      employee_id: employees[8]?.employee_id || null,
      title: 'Leave Request for Personal Reasons',
      content: 'I would like to request leave for personal matters.',
      date_of_leave: new Date('2024-11-20').toISOString(),
      date_of_return: new Date('2024-11-21').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Insufficient leave days.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    {
      employee_id: employees[9]?.employee_id || null,
      title: 'Sick Leave Request',
      content: 'Requesting sick leave due to medical reasons.',
      date_of_leave: new Date('2024-11-25').toISOString(),
      date_of_return: new Date('2024-11-27').toISOString(),
      status: faker.helpers.arrayElement(statuses),
      comment: 'Awaiting HR response.',
      leaveType: faker.helpers.arrayElement(leaveTypes),
    },
    // Add more records as needed...
  ];

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

  const payrolls = [
    {
      start: new Date('2024-01-01').toISOString(),
      end: new Date('2024-01-15').toISOString(),
      pay_date: new Date('2024-01-16').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    {
      start: new Date('2024-01-16').toISOString(),
      end: new Date('2024-01-31').toISOString(),
      pay_date: new Date('2024-02-01').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    {
      start: new Date('2024-02-01').toISOString(),
      end: new Date('2024-02-15').toISOString(),
      pay_date: new Date('2024-02-16').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    {
      start: new Date('2024-02-16').toISOString(),
      end: new Date('2024-02-28').toISOString(),
      pay_date: new Date('2024-03-01').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    {
      start: new Date('2024-03-01').toISOString(),
      end: new Date('2024-03-15').toISOString(),
      pay_date: new Date('2024-03-16').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    {
      start: new Date('2024-03-16').toISOString(),
      end: new Date('2024-03-31').toISOString(),
      pay_date: new Date('2024-04-01').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    {
      start: new Date('2024-04-01').toISOString(),
      end: new Date('2024-04-15').toISOString(),
      pay_date: new Date('2024-04-16').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    {
      start: new Date('2024-04-16').toISOString(),
      end: new Date('2024-04-30').toISOString(),
      pay_date: new Date('2024-05-01').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    {
      start: new Date('2024-05-01').toISOString(),
      end: new Date('2024-05-15').toISOString(),
      pay_date: new Date('2024-05-16').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    {
      start: new Date('2024-05-16').toISOString(),
      end: new Date('2024-05-31').toISOString(),
      pay_date: new Date('2024-06-01').toISOString(),
      status: faker.helpers.arrayElement(statuses),
    },
    // Add more records as needed...
  ];

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

  const signatoryRecords = [
    {
      employee_id: employees[0].employee_id,
      signatory_name: 'John Doe',
      role: 'HR Manager',
      permission_level: 5,
    },
    {
      employee_id: employees[1].employee_id,
      signatory_name: 'Jane Smith',
      role: 'Finance Director',
      permission_level: 5,
    },
    {
      employee_id: employees[2].employee_id,
      signatory_name: 'Michael Johnson',
      role: 'Operations Manager',
      permission_level: 4,
    },
    {
      employee_id: employees[3].employee_id,
      signatory_name: 'Emily Davis',
      role: 'IT Specialist',
      permission_level: 3,
    },
    {
      employee_id: employees[4].employee_id,
      signatory_name: 'Sarah Wilson',
      role: 'Marketing Coordinator',
      permission_level: 3,
    },
    {
      employee_id: employees[5].employee_id,
      signatory_name: 'David Brown',
      role: 'Project Manager',
      permission_level: 4,
    },
    {
      employee_id: employees[6].employee_id,
      signatory_name: 'Linda Garcia',
      role: 'Sales Executive',
      permission_level: 2,
    },
    {
      employee_id: employees[7].employee_id,
      signatory_name: 'Robert Martinez',
      role: 'Customer Service Manager',
      permission_level: 4,
    },
    {
      employee_id: employees[8].employee_id,
      signatory_name: 'Jennifer Taylor',
      role: 'Business Analyst',
      permission_level: 3,
    },
    {
      employee_id: employees[9].employee_id,
      signatory_name: 'William Anderson',
      role: 'Legal Advisor',
      permission_level: 5,
    },
  ];

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

  const payrollReportRecords = [
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 3100.0, // Example value
      grosspay: 4900.0, // Example value
      total_deductions: 1400.0, // Example value
      total_benefits: 900.0, // Example value
    },
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 2800.5, // Example value
      grosspay: 4500.0, // Example value
      total_deductions: 1200.0, // Example value
      total_benefits: 700.0, // Example value
    },
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 3000.0, // Example value
      grosspay: 4800.0, // Example value
      total_deductions: 1500.0, // Example value
      total_benefits: 800.0, // Example value
    },
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 2600.25, // Example value
      grosspay: 4100.0, // Example value
      total_deductions: 1100.0, // Example value
      total_benefits: 600.0, // Example value
    },
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 2900.75, // Example value
      grosspay: 4600.0, // Example value
      total_deductions: 1300.0, // Example value
      total_benefits: 750.0, // Example value
    },
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 3100.0, // Example value
      grosspay: 4900.0, // Example value
      total_deductions: 1400.0, // Example value
      total_benefits: 900.0, // Example value
    },
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 2700.5, // Example value
      grosspay: 4300.0, // Example value
      total_deductions: 1150.0, // Example value
      total_benefits: 650.0, // Example value
    },
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 3200.0, // Example value
      grosspay: 5000.0, // Example value
      total_deductions: 1600.0, // Example value
      total_benefits: 950.0, // Example value
    },
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 3000.0, // Example value
      grosspay: 4800.0, // Example value
      total_deductions: 1500.0, // Example value
      total_benefits: 850.0, // Example value
    },
    {
      on_payroll_id: faker.helpers.arrayElement(onpayrolls).on_payroll_id,
      netpay: 2900.0, // Example value
      grosspay: 4700.0, // Example value
      total_deductions: 1350.0, // Example value
      total_benefits: 800.0, // Example value
    },
  ];

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
  const deductionRecords = [
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Annual Bonus', // Example deduction name
      start: faker.date.past().toISOString(),
      end: faker.date.future().toISOString(),
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      deduction_type: faker.helpers.arrayElement(deductionTypes),
      amount: 500.0, // Example amount
      description: 'Yearly performance bonus.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Commission for Sales', // Example deduction name
      start: faker.date.past().toISOString(),
      end: faker.date.future().toISOString(),
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      deduction_type: faker.helpers.arrayElement(deductionTypes),
      amount: 200.0, // Example amount
      description: 'Commission based on sales performance.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Overtime Payment', // Example deduction name
      start: faker.date.past().toISOString(),
      end: faker.date.future().toISOString(),
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      deduction_type: faker.helpers.arrayElement(deductionTypes),
      amount: 150.0, // Example amount
      description: 'Compensation for overtime hours worked.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Monthly Subscription', // Example deduction name
      start: faker.date.past().toISOString(),
      end: faker.date.future().toISOString(),
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      deduction_type: faker.helpers.arrayElement(deductionTypes),
      amount: 30.0, // Example amount
      description: 'Monthly subscription for services.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example deduction name
      start: faker.date.past().toISOString(),
      end: faker.date.future().toISOString(),
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      deduction_type: faker.helpers.arrayElement(deductionTypes),
      amount: 400.0, // Example amount
      description: 'Bonus for holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example deduction name
      start: faker.date.past().toISOString(),
      end: faker.date.future().toISOString(),
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      deduction_type: faker.helpers.arrayElement(deductionTypes),
      amount: 400.0, // Example amount
      description: 'Bonus for holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example deduction name
      start: faker.date.past().toISOString(),
      end: faker.date.future().toISOString(),
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      deduction_type: faker.helpers.arrayElement(deductionTypes),
      amount: 400.0, // Example amount
      description: 'Bonus for holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example deduction name
      start: faker.date.past().toISOString(),
      end: faker.date.future().toISOString(),
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      deduction_type: faker.helpers.arrayElement(deductionTypes),
      amount: 400.0, // Example amount
      description: 'Bonus for holiday season.', // Example description
    },
  ];

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

  const benefitsTypes: ('Bonus' | 'Commission' | 'Overtime' | 'Other')[] = [
    'Bonus',
    'Commission',
    'Overtime',
    'Other',
  ];

  const benefitRecords = [
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Annual Performance Bonus', // Example benefit name
      start: '2023-01-01T00:00:00.000Z', // Example start date
      end: '2023-12-31T00:00:00.000Z', // Example end date
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      benefits_type: faker.helpers.arrayElement(benefitsTypes),
      amount: 1200.0, // Example amount
      description: 'Bonus for annual performance evaluation.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Sales Commission', // Example benefit name
      start: '2023-01-01T00:00:00.000Z', // Example start date
      end: '2023-12-31T00:00:00.000Z', // Example end date
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      benefits_type: faker.helpers.arrayElement(benefitsTypes),
      amount: 250.0, // Example amount
      description: 'Commission for sales made weekly.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Overtime Compensation', // Example benefit name
      start: '2023-01-01T00:00:00.000Z', // Example start date
      end: '2023-12-31T00:00:00.000Z', // Example end date
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      benefits_type: faker.helpers.arrayElement(benefitsTypes),
      amount: 150.0, // Example amount
      description: 'Compensation for overtime hours worked every two weeks.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Health Insurance', // Example benefit name
      start: '2023-01-01T00:00:00.000Z', // Example start date
      end: '2023-12-31T00:00:00.000Z', // Example end date
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      benefits_type: faker.helpers.arrayElement(benefitsTypes),
      amount: 300.0, // Example amount
      description: 'Monthly premium for health insurance coverage.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example benefit name
      start: '2023-12-01T00:00:00.000Z', // Example start date
      end: '2023-12-31T00:00:00.000Z', // Example end date
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      benefits_type: faker.helpers.arrayElement(benefitsTypes),
      amount: 500.0, // Example amount
      description: 'Bonus provided during the holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example benefit name
      start: '2023-12-01T00:00:00.000Z', // Example start date
      end: '2023-12-31T00:00:00.000Z', // Example end date
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      benefits_type: faker.helpers.arrayElement(benefitsTypes),
      amount: 500.0, // Example amount
      description: 'Bonus provided during the holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example benefit name
      start: '2023-12-01T00:00:00.000Z', // Example start date
      end: '2023-12-31T00:00:00.000Z', // Example end date
      frequency: faker.helpers.arrayElement(allowedFrequencies),
      benefits_type: faker.helpers.arrayElement(benefitsTypes),
      amount: 500.0, // Example amount
      description: 'Bonus provided during the holiday season.', // Example description
    },
    // Add more records as needed
  ];

  await db.insert(benefits).values(benefitRecords);
  log.info('Benefits records seeded successfully.');
}

async function seedAdjustments(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);

  const adjustmentTypes: ('Bonus' | 'Commission' | 'Overtime' | 'Other')[] = [
    'Bonus',
    'Commission',
    'Overtime',
    'Other',
  ];

  const adjustmentRecords = [
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Performance Bonus', // Example adjustment name
      remarks: 'Quarterly performance review adjustments.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 300.0, // Example amount
      description: 'Bonus awarded for exceeding quarterly goals.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Sales Commission', // Example adjustment name
      remarks: 'Monthly sales targets exceeded.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 150.0, // Example amount
      description: 'Commission for exceeding monthly sales targets.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Overtime Adjustment', // Example adjustment name
      remarks: 'Extra hours worked on project deadlines.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 200.0, // Example amount
      description: 'Adjustment for overtime hours during project sprint.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Year-End Adjustment', // Example adjustment name
      remarks: 'Annual adjustments based on performance and market trends.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 500.0, // Example amount
      description: 'Year-end salary adjustment based on performance review.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Training Incentive', // Example adjustment name
      remarks: 'Incentive for completing professional development courses.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 100.0, // Example amount
      description: 'Incentive bonus for completing training programs.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Training Incentive', // Example adjustment name
      remarks: 'Incentive for completing professional development courses.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 100.0, // Example amount
      description: 'Incentive bonus for completing training programs.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Training Incentive', // Example adjustment name
      remarks: 'Incentive for completing professional development courses.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 100.0, // Example amount
      description: 'Incentive bonus for completing training programs.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Training Incentive', // Example adjustment name
      remarks: 'Incentive for completing professional development courses.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 100.0, // Example amount
      description: 'Incentive bonus for completing training programs.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Training Incentive', // Example adjustment name
      remarks: 'Incentive for completing professional development courses.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 100.0, // Example amount
      description: 'Incentive bonus for completing training programs.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Training Incentive', // Example adjustment name
      remarks: 'Incentive for completing professional development courses.', // Example remarks
      adjustments_type: faker.helpers.arrayElement(adjustmentTypes),
      amount: 100.0, // Example amount
      description: 'Incentive bonus for completing training programs.', // Example description
    },
    // Add more records as needed
  ];

  await db.insert(adjustments).values(adjustmentRecords);
  log.info('Adjustments records seeded successfully.');
}

async function seedAdditionalPay(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);

  const allowedAdditionalPayTypes: (
    | 'Bonus'
    | 'Commission'
    | 'Overtime'
    | 'Other'
  )[] = ['Bonus', 'Commission', 'Overtime', 'Other'];

  const additionalPayRecords = [
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Year-End Bonus', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 500.0, // Example amount
      description: 'Bonus for outstanding performance throughout the year.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Sales Commission', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 300.0, // Example amount
      description: 'Commission for exceeding quarterly sales targets.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Project Overtime', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 200.0, // Example amount
      description: 'Overtime payment for hours worked on project deadlines.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Training Allowance', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 150.0, // Example amount
      description: 'Allowance for attending professional development courses.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 250.0, // Example amount
      description: 'Bonus for the holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 250.0, // Example amount
      description: 'Bonus for the holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 250.0, // Example amount
      description: 'Bonus for the holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 250.0, // Example amount
      description: 'Bonus for the holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 250.0, // Example amount
      description: 'Bonus for the holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 250.0, // Example amount
      description: 'Bonus for the holiday season.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      name: 'Holiday Bonus', // Example additional pay name
      additional_pay_type: faker.helpers.arrayElement(
        allowedAdditionalPayTypes,
      ),
      amount: 250.0, // Example amount
      description: 'Bonus for the holiday season.', // Example description
    },
    // Add more records as needed
  ];

  await db.insert(additionalPay).values(additionalPayRecords);
  log.info('Additional pay records seeded successfully.');
}

async function seedAttendance(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);

  // Ensure there are records to select from
  if (employeeIDs.length === 0) {
    log.warn('No records found for employees. Skipping attendance seeding.');
    return;
  }

  const attendanceStatuses: (
    | 'Present'
    | 'Absent'
    | 'Late'
    | 'Early Leave'
    | 'Paid Leave'
  )[] = ['Present', 'Absent', 'Late', 'Early Leave', 'Paid Leave'];

  const attendanceRecords = [
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 8.0, // Example hours worked
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'On time and completed all tasks.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 7.5,
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'Arrived late due to traffic.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: null, // No clock-in for absent
      clock_out: null, // No clock-out for absent
      hoursWorked: 0, // No hours worked
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'Sick leave.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 6.0,
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'Left early for a family commitment.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 8.0,
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'On paid leave for vacation.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 8.0,
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'On paid leave for vacation.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 8.0,
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'On paid leave for vacation.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 8.0,
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'On paid leave for vacation.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 8.0,
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'On paid leave for vacation.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 8.0,
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'On paid leave for vacation.', // Example description
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      date: faker.date.recent().toISOString(),
      clock_in: faker.date.recent().toISOString(),
      clock_out: faker.date.future().toISOString(),
      hoursWorked: 8.0,
      status: faker.helpers.arrayElement(attendanceStatuses),
      description: 'On paid leave for vacation.', // Example description
    },
    // Add more records as needed
  ];

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
  // Retrieve inquiry IDs from the database
  const inquiryIDs = await db.select().from(inquiry);

  const channelRecords = [
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'Customer Support',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'Technical Support',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'Sales Inquiry',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'Feedback Channel',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'Product Inquiry',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'Billing Issues',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'Service Updates',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'Warranty Claims',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'Product Support',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'General Inquiries',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'HR Support',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      channel_name: 'IT Assistance',
      is_private: faker.datatype.boolean(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    // Add more channels here to reach 70 entries
  ];

  // Insert channel records into the database
  await db.insert(channel).values(channelRecords);
  log.info('Channel records seeded successfully');
}

async function seedMessage(db: PostgresJsDatabase<SchemaType>) {
  // Retrieve inquiry IDs from the database
  const inquiryIDs = await db.select().from(inquiry);

  const status = [
    'User',
    'Admin',
    'Customer Support',
    'Employee',
    'Manager',
  ] as const;

  const messageRecords = [
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 1,
      content: 'Hello, how can I assist you today?',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 2,
      content: 'Thank you for reaching out. We will get back to you shortly.',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 3,
      content: 'Please provide more details about your request.',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 4,
      content: 'Your order has been processed successfully.',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 5,
      content: 'Is there anything else I can help you with?',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 1,
      content: 'I need assistance with my account settings.',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 2,
      content: 'We are here to help you with your queries.',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 3,
      content: 'Your feedback is important to us!',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 4,
      content: 'Please confirm your shipping address.',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      inquiry_id: faker.helpers.arrayElement(inquiryIDs).inquiry_id,
      sender_id: 5,
      content: 'We appreciate your patience.',
      sender_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    // Add more messages here to reach 70 entries
  ];

  // Insert message records into the database
  await db.insert(message).values(messageRecords);
  log.info('Message records seeded successfully');
}

async function seedInquiry(db: PostgresJsDatabase<SchemaType>) {
  // Retrieve customer IDs from the database
  const customerIDs = await db.select().from(customer);

  const status = [
    'Product',
    'Pricing',
    'Order Status',
    'Technical Support',
    'Billing',
    'Complaint',
    'Feedback',
    'Return/Refund',
  ] as const;

  const inquiryRecords = [
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Inquiry about Product A',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Pricing information for Service B',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Order Status for Order #1234',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Technical Support needed for Device C',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Billing discrepancy on Invoice #5678',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Complaint regarding Product D',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Feedback on Service E',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Request for Return/Refund on Order #91011',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Inquiry about Product X',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Pricing details for Product Y',
      inquiry_type: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    // Add more inquiries here to reach 70 entries
  ];

  // Insert inquiry records into the database
  await db.insert(inquiry).values(inquiryRecords);
  log.info('Inquiry records seeded successfully');
}

async function seedCustomer(db: PostgresJsDatabase<SchemaType>) {
  const status = [
    'Active',
    'Inactive',
    'Pending',
    'Suspended',
    'Banned',
    'VIP',
    'Delinquent',
    'Prospect',
  ] as const;

  const customerRecords = [
    {
      firstname: 'John',
      middlename: 'Michael',
      lastname: 'Doe',
      contact_phone: '09123456789',
      socials: [
        { platform: 'Facebook', url: 'https://facebook.com/johndoe' },
        { platform: 'Instagram', url: 'https://instagram.com/johndoe' },
      ],
      address_line: '123 Elm Street',
      barangay: 'Central',
      province: 'Metro Manila',
      email: 'johndoe@example.com',
      standing: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      firstname: 'Jane',
      middlename: 'Anne',
      lastname: 'Smith',
      contact_phone: '09876543210',
      socials: [{ platform: 'Twitter', url: 'https://twitter.com/janesmith' }],
      address_line: '456 Oak Avenue',
      barangay: 'Eastside',
      province: 'Cebu',
      email: 'janesmith@example.com',
      standing: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      firstname: 'Alice',
      middlename: 'Marie',
      lastname: 'Johnson',
      contact_phone: '09123456701',
      socials: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/alicejohnson' },
      ],
      address_line: '789 Pine Road',
      barangay: 'Northside',
      province: 'Davao',
      email: 'alicejohnson@example.com',
      standing: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    // Add more customers here to reach 70 entries
    {
      firstname: 'Bob',
      middlename: 'David',
      lastname: 'Williams',
      contact_phone: '09223334455',
      socials: [
        { platform: 'YouTube', url: 'https://youtube.com/bobwilliams' },
      ],
      address_line: '321 Maple Street',
      barangay: 'Southside',
      province: 'Quezon City',
      email: 'bobwilliams@example.com',
      standing: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      firstname: 'Charlie',
      middlename: 'Ethan',
      lastname: 'Brown',
      contact_phone: '09334445566',
      socials: [
        { platform: 'TikTok', url: 'https://tiktok.com/@charliebrown' },
      ],
      address_line: '654 Spruce Drive',
      barangay: 'Westside',
      province: 'Manila',
      email: 'charliebrown@example.com',
      standing: faker.helpers.arrayElement(status),
      created_at: new Date(),
      last_updated: new Date(),
    },
  ];

  // Insert customer records into the database
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

  const salesItemRecords = [
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      quantity: 10,
      sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
      total_price: 150.0,
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      quantity: 5,
      sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
      total_price: 300.5,
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      quantity: 3,
      sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
      total_price: 75.25,
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      quantity: 8,
      sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
      total_price: 200.0,
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      quantity: 2,
      sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
      total_price: 50.75,
      created_at: new Date(),
      last_updated: new Date(),
    },
    // Add more records to reach a total of 70
  ];

  // Insert sales item records into the database
  await db.insert(sales_items).values(salesItemRecords);
  log.info('Sales Items records seeded successfully');
}

async function seedPayment(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);

  const paymentMethods: Array<'Cash' | 'Card' | 'Online Payment'> = [
    'Cash',
    'Card',
    'Online Payment',
  ];

  const paymentStatuses: Array<
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
  > = [
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

  const paymentRecords = [
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 50.0,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 75.5,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-02-20T11:00:00Z'),
      last_updated: new Date('2024-02-20T11:00:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 100.0,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-03-05T12:00:00Z'),
      last_updated: new Date('2024-03-05T12:00:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 20.0,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-04-10T09:45:00Z'),
      last_updated: new Date('2024-04-10T09:45:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 150.75,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 150.75,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 150.75,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 150.75,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 150.75,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 150.75,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      amount: 150.75,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
  ];

  await db.insert(payment).values(paymentRecords);
  log.info('Payment records seeded successfully');
}

async function seedReceipt(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);
  const paymentIDs = await db.select().from(payment);

  const receiptRecords = [
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 50.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 75.5,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 100.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 20.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      sales_id: faker.helpers.arrayElement(serviceIDs).service_id,
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

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

  const reserveRecords = [
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    // Add more real-world reserve records here
  ];

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

  const borrowRecords = [
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10, // Example fee in the specified currency
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 20,
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 15,
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 30,
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_item_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      tag_item: faker.helpers.arrayElement(tag_item_type),
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    // Add more real-world borrow records here
  ];

  await db.insert(borrow).values(borrowRecords);
  log.info('Borrow records seeded successfully');
}

async function seedService(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);
  const customerIDs = await db.select().from(customer);

  const serviceRecords = [
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_title: 'Web Development',
      service_description:
        'Full-stack web development service including design and deployment.',
      service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
      has_sales_item: faker.datatype.boolean(),
      has_borrow: faker.datatype.boolean(),
      has_job_order: faker.datatype.boolean(),
      created_at: new Date('2024-01-01T08:00:00Z'),
      last_updated: new Date('2024-01-01T08:00:00Z'),
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_title: 'Graphic Design',
      service_description:
        'Professional graphic design services for branding and marketing.',
      service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
      has_sales_item: faker.datatype.boolean(),
      has_borrow: faker.datatype.boolean(),
      has_job_order: faker.datatype.boolean(),
      created_at: new Date('2024-01-05T08:00:00Z'),
      last_updated: new Date('2024-01-05T08:00:00Z'),
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_title: 'Consulting',
      service_description:
        'Business consulting services to improve your organization’s performance.',
      service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
      has_sales_item: faker.datatype.boolean(),
      has_borrow: faker.datatype.boolean(),
      has_job_order: faker.datatype.boolean(),
      created_at: new Date('2024-01-10T08:00:00Z'),
      last_updated: new Date('2024-01-10T08:00:00Z'),
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_title: 'Digital Marketing',
      service_description:
        'Comprehensive digital marketing services, including SEO and social media management.',
      service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
      has_sales_item: faker.datatype.boolean(),
      has_borrow: faker.datatype.boolean(),
      has_job_order: faker.datatype.boolean(),
      created_at: new Date('2024-01-15T08:00:00Z'),
      last_updated: new Date('2024-01-15T08:00:00Z'),
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_title: 'Content Writing',
      service_description:
        'Expert content writing services for blogs, articles, and web content.',
      service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
      has_sales_item: faker.datatype.boolean(),
      has_borrow: faker.datatype.boolean(),
      has_job_order: faker.datatype.boolean(),
      created_at: new Date('2024-01-20T08:00:00Z'),
      last_updated: new Date('2024-01-20T08:00:00Z'),
    },
    // Add more real-world service records as needed
  ];

  await db.insert(service).values(serviceRecords);
  log.info('Service records seeded successfully');
}

async function seedAssignedEmployees(db: PostgresJsDatabase<SchemaType>) {
  // Fetch existing job orders and employees from the database
  const jobOrders = await db.select().from(jobOrder);
  const employees = await db.select().from(employee);

  // Ensure that there are job orders and employees to seed
  if (jobOrders.length === 0 || employees.length === 0) {
    log.error(
      'No job orders or employees found. Cannot seed assigned employees.',
    );
    return;
  }

  // Hardcoded realistic data for assigned employees
  const assignedEmployeesRecords = [
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'John Doe', // Assuming this is the person assigning
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Jane Smith',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Alice Johnson',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Michael Brown',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Emily Davis',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Rey Larombe',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Aj Tollo',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Catto Akii',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Shaheen Adlawin',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Rhyss Jimenez',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    // Add more records as needed
  ];

  await db.insert(assignedemployees).values(assignedEmployeesRecords);
  log.info('Assigned Employees seeded successfully');
}

async function seedRemarkTickets(db: PostgresJsDatabase<SchemaType>) {
  // Fetch existing job orders, remark types, and employees from the database
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

  // Hardcoded realistic data for remark tickets
  const remarkticketsRecords = [
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Quality Issue on Job #123', // Example title
      description: 'There was a quality issue with the materials used.', // Example description
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Delayed Delivery for Job #456',
      description: 'The delivery is delayed due to supplier issues.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Customer Complaint on Job #789',
      description: 'The customer reported issues with the service provided.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Job Completed for Job #321',
      description: 'The job was completed successfully and closed.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Urgent Issue with Job #654',
      description: 'An urgent issue has arisen that needs immediate attention.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Follow-Up Needed for Job #888',
      description:
        'A follow-up is required for additional details on Job #888.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Payment Dispute for Job #234',
      description:
        'There is a dispute regarding the payment for Job #234 that needs resolution.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Quality Feedback for Job #567',
      description: 'Feedback from the quality assurance team on Job #567.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Client Request for Job #876',
      description: 'The client has made a special request regarding Job #876.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Follow-Up on Warranty for Job #345',
      description:
        'A follow-up is required regarding the warranty for Job #345.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Issue with Job #135',
      description:
        'There is a technical issue with Job #135 that requires urgent attention.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    // Add more records as needed
  ];

  await db.insert(remarktickets).values(remarkticketsRecords);
  log.info('Remark Tickets seeded successfully');
}

async function seedRemarkItems(db: PostgresJsDatabase<SchemaType>) {
  // Fetch existing items and remark tickets from the database
  const itemIDs = await db.select().from(item);
  const remarksIDs = await db.select().from(remarktickets);

  // Hardcoded realistic data for remark items
  const remarkitemsRecords = [
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Item is damaged upon arrival',
      quantity: 5,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Incorrect item sent to customer',
      quantity: 1,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Missing parts for assembly',
      quantity: 3,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Quality issues detected during inspection',
      quantity: 10,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Returned by the customer due to dissatisfaction',
      quantity: 2,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Pending further evaluation by the quality team',
      quantity: 7,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Customer reported a missing item',
      quantity: 4,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  // Insert remark items into the database
  await db.insert(remarkitems).values(remarkitemsRecords);
  log.info('Remark items seeded successfully.');
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
  // Hardcoded realistic data for remark types
  const remarktypeRecords = [
    {
      name: 'Product Quality Issue',
      description:
        'Remarks related to product quality concerns, including defects and damages.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Customer Service Feedback',
      description:
        'Comments and feedback regarding customer service experiences.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Shipping Delay',
      description: 'Remarks concerning delays in shipping and delivery times.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Order Inaccuracy',
      description:
        'Issues reported when an order does not match what was received.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Return Process Feedback',
      description:
        'Feedback regarding the return process and related customer experiences.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Missing Items',
      description:
        'Remarks about items that were expected but not included in the order.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Product Recommendation',
      description:
        'Remarks regarding suggestions for product improvements or alternatives.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  // Insert remark types into the database
  await db.insert(remarktype).values(remarktypeRecords);

  log.info('Remark types seeded successfully.');
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
  // Hardcoded realistic data for remark content
  const remarkcontentRecords = [
    {
      name: 'Quality Assurance Feedback',
      markdown:
        'Our quality assurance team has reviewed your product. **Please address the following issues:**\n\n- Defective parts\n- Improper assembly\n- Missing components.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Customer Service Interaction',
      markdown:
        'Thank you for reaching out to us. **Here’s a summary of our conversation:**\n\n- Discussed your order status\n- Agreed to send a replacement item\n- Confirmed delivery timeline.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Shipping Issue Report',
      markdown:
        'We have identified an issue with your shipment. **Key points:**\n\n- Delay due to weather conditions\n- Estimated delivery pushed back by 2 days.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Return Policy Clarification',
      markdown:
        'Here are the details regarding our return policy: **You can return items within 30 days.**\n\n- Items must be unopened and in original packaging.\n- Refunds will be processed within 5 business days.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Order Discrepancy Report',
      markdown:
        'We noticed a discrepancy with your recent order. **Details:**\n\n- Ordered 3 items, but only received 2.\n- Missing item: Wireless Mouse.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Product Improvement Suggestions',
      markdown:
        'Thank you for your feedback! **We appreciate your suggestions:**\n\n- Consider improving battery life.\n- Enhance user interface for better experience.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Customer Satisfaction Survey',
      markdown:
        'We value your opinion! **Please fill out our survey:**\n\n- Rate your experience from 1 to 5.\n- Share any comments or suggestions.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  // Insert remark content into the database
  await db.insert(remarkcontent).values(remarkcontentRecords);

  log.info('Remark content seeded successfully.');
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

  // Hardcoded realistic data for job orders
  const joborderRecords = [
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id, // Assuming this corresponds to an existing service
      uuid: 'e6e1c3b1-4eab-4bc9-899c-7300a702f7f3',
      fee: 75,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 150.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      uuid: '7b63e580-3e6f-45eb-b5f2-d1e8602392f9',
      fee: 50,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 100.5,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      uuid: '99342869-3f69-4047-b477-d54c780a0c04',
      fee: 100,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 200.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      uuid: 'd18e55cb-5c97-4c4e-81a0-5c8965b0982c',
      fee: 20,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 40.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      uuid: 'c0fca47c-04fa-4eec-ae90-514b7d84d6f0',
      fee: 30,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 60.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      uuid: '7a52c4a8-b6c0-4d12-a50e-2e3acde32bfa',
      fee: 150,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 300.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      uuid: '14bbaeb7-e46e-4049-a321-1f8a71eae2c7',
      fee: 200,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 400.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      uuid: '44e54e8d-9338-4de9-9e4b-0b6cf4467ca1',
      fee: 90,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 180.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      uuid: '5d793337-7d4b-4e38-9fb4-6cb7aa205eeb',
      fee: 80,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 160.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      uuid: 'efbfa15b-9283-490f-8181-488b488a8fef',
      fee: 120,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 240.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  // Insert job orders into the database
  await db.insert(jobOrder).values(joborderRecords);

  log.info('Job Order records seeded successfully.');
}

async function seedReports(db: PostgresJsDatabase<SchemaType>) {
  const joborderIDs = await db.select().from(jobOrder);

  // Hardcoded realistic data for reports
  const reportsRecords = [
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Initial Review of Job Order #1',
      remarks: 'All documents are in order, ready for processing.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Progress Update for Job Order #2',
      remarks:
        'Work is currently in progress, slight delays due to material shortage.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Completion Report for Job Order #3',
      remarks:
        'The job order has been completed successfully, awaiting customer feedback.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Issues Reported for Job Order #4',
      remarks: 'Customer reported a discrepancy in billing; review initiated.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Final Assessment for Job Order #5',
      remarks: 'All requirements have been met; closing report prepared.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Follow-Up for Job Order #6',
      remarks:
        "Scheduled follow-up on the customer's feedback; no issues reported.",
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Alert for Job Order #7',
      remarks:
        'Critical delays in the supply chain; immediate action required.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Evaluation Report for Job Order #8',
      remarks:
        'Evaluation completed; improvements suggested for future orders.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Customer Satisfaction for Job Order #9',
      remarks: 'Customer feedback is positive; satisfaction survey completed.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      reports_title: 'Closure Notice for Job Order #10',
      remarks:
        'Job order has been officially closed; all documentation submitted.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  // Insert reports into the database
  await db.insert(reports).values(reportsRecords);

  log.info('Report records seeded successfully.');
}

async function seedJobOrderTypes(db: PostgresJsDatabase<SchemaType>) {
  // Define possible statuses for job order types
  const statuses: ('Available' | 'Not Available')[] = [
    'Available',
    'Not Available',
  ];

  // Hardcoded realistic data for job order types
  const jobordertypesRecords = [
    {
      name: 'Routine Maintenance',
      description: 'Scheduled maintenance to ensure optimal performance.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Emergency Repair',
      description: 'Urgent repair services for immediate issues.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Installation Service',
      description: 'Professional installation services for new equipment.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Consultation',
      description: 'Expert consultation services for project planning.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Product Warranty Service',
      description: 'Service offered under product warranty agreements.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Upgrades and Modifications',
      description: 'Enhancements to existing systems and processes.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Routine Inspection',
      description: 'Regular inspection services to ensure compliance.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Special Request Service',
      description: 'Custom services based on specific client requests.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Training Service',
      description: 'Training and support services for staff.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Follow-Up Service',
      description: 'Post-service follow-up to ensure satisfaction.',
      joborder_types_status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  // Insert job order types into the database
  await db.insert(jobordertype).values(jobordertypesRecords);

  log.info('Job Order Types seeded successfully.');
}

async function seedJobOrderServices(db: PostgresJsDatabase<SchemaType>) {
  const jobordertypesIDs = await db.select().from(jobordertype);
  const joborderIDs = await db.select().from(jobOrder);

  const joborderservicesRecords = Array.from({ length: 50 }).map(() => ({
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
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'Broken' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'Used' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'Broken' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'Used' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      stock: 200,
      on_listing: true,
      re_order_level: 150,
      price: '2000.00', // Convert price to string
      tag: 'New' as 'New' | 'Used' | 'Broken', // Ensure tag matches expected type
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
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
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1200.50', // Ensure price is a string
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-15'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1450.75',
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-02-20'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
      price: '1700.00',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      item_id: faker.helpers.arrayElement(itemIDs).item_id,
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
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Ram',
      description:
        'High-performance DDR4 RAM module with a clock speed of 3200MHz, designed to provide faster data transfer and improve overall system responsiveness.',
      price: 799.99,
      img_url: 'https://example.com/images/smartphone-a1.jpg',
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-10'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Laptop Pro 15',
      description: 'A powerful laptop suitable for professionals and students.',
      price: 1199.99,
      img_url: 'https://example.com/images/laptop-pro-15.jpg',
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-02-15'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'SSD',
      description:
        '"High-speed NVMe SSD with rapid data transfer and reliable performance."',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'LCD',
      description:
        'Vibrant LCD monitor with sharp resolution and wide viewing angles, perfect for immersive gaming and professional work.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Wireless Headphones',
      description:
        'Noise-cancelling wireless headphones with excellent sound quality.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Mouse',
      description:
        'High-precision wired mouse with ergonomic design and customizable buttons for smooth navigation and enhanced gaming performance.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Wireless Mouse',
      description:
        'Ergonomic wireless mouse with precise tracking and customizable buttons for seamless navigation and enhanced productivity',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Keyboard',
      description:
        'Mechanical keyboard with tactile switches and customizable RGB backlighting for an enhanced typing experience and personalized style.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Nvidia GPU',
      description:
        'High-performance graphics card with advanced cooling technology and real-time ray tracing for stunning visuals and smooth gaming experiences.',
      price: 249.99,
      img_url: 'https://example.com/images/wireless-headphones.jpg',
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
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
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      filePath: 'https://example.com/attachments/product1_manual.pdf',
      created_at: new Date('2023-09-01'),
      last_updated: new Date('2023-09-02'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      filePath: 'https://example.com/attachments/product2_manual.pdf',
      created_at: new Date('2023-09-03'),
      last_updated: new Date('2023-09-04'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      filePath: 'https://example.com/attachments/product3_manual.pdf',
      created_at: new Date('2023-09-05'),
      last_updated: new Date('2023-09-06'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      filePath: 'https://example.com/attachments/product4_manual.pdf',
      created_at: new Date('2023-09-07'),
      last_updated: new Date('2023-09-08'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      filePath: 'https://example.com/attachments/product5_manual.pdf',
      created_at: new Date('2023-09-09'),
      last_updated: new Date('2023-09-10'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
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
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
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
      product_id: faker.helpers.arrayElement(productIDs).product_id,
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
      product_id: faker.helpers.arrayElement(productIDs).product_id,
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
      product_id: faker.helpers.arrayElement(productIDs).product_id,
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
      product_id: faker.helpers.arrayElement(productIDs).product_id,
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
      product_id: faker.helpers.arrayElement(productIDs).product_id,
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
      product_id: faker.helpers.arrayElement(productIDs).product_id,
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
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      quantity: 2,
      price: (9.99).toFixed(2), // Convert to string with two decimal places
      created_at: new Date('2023-10-01'),
      last_updated: new Date('2023-10-15'),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      quantity: 1,
      price: (15.49).toFixed(2), // Convert to string with two decimal places,
      created_at: new Date('2023-10-02'),
      last_updated: new Date('2023-10-16'),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      quantity: 3,
      price: (29.99).toFixed(2), // Convert to string with two decimal places,
      created_at: new Date('2023-10-03'),
      last_updated: new Date('2023-10-17'),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      quantity: 4,
      price: (5.99).toFixed(2), // Convert to string with two decimal places,
      created_at: new Date('2023-10-04'),
      last_updated: new Date('2023-10-18'),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.helpers.arrayElement(productIDs).product_id,
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
      item_id: faker.helpers.arrayElement(itemdata).item_id,
      quantity: 15,
      movement_type: 'Stock In',
      action: 'For the technician',
      created_at: new Date('2023-10-01'),
    },
    {
      item_id: faker.helpers.arrayElement(itemdata).item_id,
      quantity: 10,
      movement_type: 'Stock Out',
      action: 'For the technician',
      created_at: new Date('2023-10-02'),
    },
    {
      item_id: faker.helpers.arrayElement(itemdata).item_id,
      quantity: 5,
      movement_type: 'Stock In',
      action: 'For the sales',
      created_at: new Date('2023-10-03'),
    },
    {
      item_id: faker.helpers.arrayElement(itemdata).item_id,
      quantity: 20,
      movement_type: 'Stock Out',
      action: 'For the sales',
      created_at: new Date('2023-10-04'),
    },
    {
      item_id: faker.helpers.arrayElement(itemdata).item_id,
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
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      filePath: 'https://example.com/files/item1.jpg',
      created_at: new Date('2023-10-01'),
      last_updated: new Date('2023-10-02'),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      filePath: 'https://example.com/files/item2.jpg',
      created_at: new Date('2023-10-03'),
      last_updated: new Date('2023-10-04'),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      filePath: 'https://example.com/files/item3.jpg',
      created_at: new Date('2023-10-05'),
      last_updated: new Date('2023-10-06'),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      filePath: 'https://example.com/files/item4.jpg',
      created_at: new Date('2023-10-07'),
      last_updated: new Date('2023-10-08'),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      filePath: 'https://example.com/files/item5.jpg',
      created_at: new Date('2023-10-09'),
      last_updated: new Date('2023-10-10'),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
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

    await seedEmployeePosition(db);
    await seedEmployeesRole(db);
    await seedEmployees(db);
    await seedEmployeesAccount(db);

    // await seedAuditLogs(db);
    // await seedPersonalInformations(db);
    // await seedFinancialInformations(db);
    // await seedSalaryInformations(db);
    // await seedEmploymentInformations(db);
    // await seedLeaveLimits(db);

    // await seedLeaveRequests(db);

    // await seedPayrolls(db);
    // await seedOnPayrolls(db);
    // await seedSignatory(db);
    // await seedPayrollApprovals(db);
    // await seedPayrollReportRecords(db);

    // await seedBenefits(db);
    // await seedDeductions(db);
    // await seedAdditionalPay(db);
    // await seedAdjustments(db);
    // await seedAttendance(db);

    // Inventory
    await seedCategory(db);
    await seedSupplier(db);
    await seedProduct(db);
    await seedProductAttachment(db);
    await seedProductCategory(db);
    await seedItem(db);
    await seedInventoryRecord(db);
    await seedPriceHistory(db);
    await seedStockLogs(db);

    // await seedOrder(db);
    // await seedArrivedItems(db);
    // await seedOrderItem(db);
    // Participants and related data
    await seedCustomer(db); // Seed customers first
    // await seedInquiry(db);
    // await seedChannel(db);
    // await seedParticipants(db);
    // await seedMessage(db);

    // Sales and related data
    // await seedService(db);
    // await seedPayment(db);
    // await seedReceipt(db);
    // await seedSalesItem(db); // Seed sales items first
    // await seedBorrow(db); // Now seed borrow after sales items
    // await seedReserve(db);

    // Job Order and related data
    await seedJobOrderTypes(db);
    // await seedJobOrder(db);
    // await seedJobOrderServices(db);

    // Pass employee IDs to seedRemarkTickets
    await seedRemarkType(db);
    // await seedRemarkTickets(db); // Ensure this function correctly references employee IDs
    // await seedRemarkItems(db);
    // await seedReports(db); // Make sure this also properly references customer IDs
    // await seedRemarkReports(db);
    // await seedRemarkAssigned(db);

    // await seedAssignedEmployees(db);
    // await seedRemarkContent(db);
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
