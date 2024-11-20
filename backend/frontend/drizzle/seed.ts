/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from '@faker-js/faker';
import {
  employee,
  personalInformation,
  employmentInformation,
  department,
  designation,
  auditLog,
  product,
  category,
  supplier,
  order,
  arrived_Items,
  sales_items,
  payment,
  receipt,
  service,
  reserve,
  borrow,
  jobOrder,
  reports,
  customer,
  stocksLogs,
  assignedemployees,
  remarktickets,
  jobordertype,
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
  orderLogs,
} from './drizzle.schema';
import log from '../lib/logger';
import { db, pool } from './pool';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SupabaseService } from '../supabase/supabase.service';
import * as fs from 'fs';
import * as path from 'path';
import mime from 'mime';
import { desc } from 'drizzle-orm';
const supabase = new SupabaseService();
// Create file samples

const samplePosters = fs
  .readdirSync(path.resolve(__dirname, './seed-file'))
  .map((file) => {
    const filePath = path.resolve(__dirname, './seed-file', file);

    const fileStat = fs.statSync(filePath);

    return {
      fieldname: 'employee_profile_link',
      originalname: file,
      encoding: '7bit',
      mimetype: mime.lookup(filePath) || 'image/jpeg',
      size: fileStat.size,
      destination: path.resolve(__dirname, './seed_files'),
      filename: file,
      path: filePath,
      buffer: fs.readFileSync(filePath),
    };
  });
async function createProfileBucketIfNotExists() {
  try {
    const imageBucketName = process.env.PROFILE_BUCKET;
    if (!imageBucketName) {
      throw new Error(
        'Image Bucket Name is not set in the env variables(PROFILE_BUCKET)',
      );
    }
    const { data: buckets, error: listError } = await supabase
      .getSupabase()
      .storage.listBuckets();

    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    const bucketExists = buckets.some(
      (bucket) => bucket.name === imageBucketName,
    );
    if (!bucketExists) {
      const { data, error } = await supabase
        .getSupabase()
        .storage.createBucket(imageBucketName, {
          public: true,
          allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/pjpeg',
          ],
        });

      if (error) {
        throw new Error(`Failed to create image bucket: ${error.message}`);
      }

      return `Image bucket created successfully: ${JSON.stringify(data)}`;
    } else {
      return `Image bucket '${imageBucketName}' already exists.`;
    }
  } catch (error) {
    console.log(error);
  }
}
// ===================== EMPLOYEE BASE =========================

async function seedEmployees(db: PostgresJsDatabase<SchemaType>) {
  const employeePositions = await db.select().from(position);

  const employees = [
    {
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Aj',
      middlename: 'Rizaldo',
      lastname: 'Tollo',
      email: 'ajrizaldo1@example.com',
    },
    {
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Jane',
      middlename: 'Ann',
      lastname: 'Smith',
      email: 'jane.smith@example.com',
    },
    {
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Jacob',
      middlename: 'Ann',
      lastname: 'Thompson',
      email: 'Jacob.Thompson@example.com',
    },
    {
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Olivia ',
      middlename: 'Ann',
      lastname: 'Martinez',
      email: 'Olivia.Martinez@example.com',
    },
    {
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Ethan',
      middlename: 'Ann',
      lastname: 'Lewis',
      email: 'Ethan.Lewis@example.com',
    },
  ];
  const employeesWithProfileLinks = await Promise.all(
    employees.map(async (data) => {
      // Select a random file from samplePosters
      const randomFile =
        samplePosters[Math.floor(Math.random() * samplePosters.length)];

      // Upload image and set the file URL
      const fileUrl = await supabase.uploadImageToBucket(
        randomFile as Express.Multer.File,
      );

      return {
        ...data,
        profile_link: fileUrl,
      };
    }),
  );
  await db.insert(employee).values(employeesWithProfileLinks);
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
        status: 'Offline',
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
      employee_id: faker.helpers.arrayElement(employees).employee_id,
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
      employee_id: faker.helpers.arrayElement(employees).employee_id,
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
      employee_id: faker.helpers.arrayElement(employees).employee_id,
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
      employee_id: faker.helpers.arrayElement(employees).employee_id,
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
      employee_id: faker.helpers.arrayElement(employees).employee_id,
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
      employee_id: faker.helpers.arrayElement(employees).employee_id,
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
  const productIds = await db.select().from(product);
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
      product_id: faker.helpers.arrayElement(productIds).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      quantity: 10,
      sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
      total_price: 150.0,
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      quantity: 5,
      sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
      total_price: 300.5,
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      quantity: 3,
      sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
      total_price: 75.25,
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      quantity: 8,
      sales_item_type: faker.helpers.arrayElement(salesitemTypeEnum),
      total_price: 200.0,
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
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
  const productIds = await db.select().from(product);

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
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_id: faker.helpers.arrayElement(productIds).product_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
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

  const borrowRecords = [
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10, // Example fee in the specified currency
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 20,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 15,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 30,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(), // Ensure format is correct
      last_updated: faker.date.recent(), // Ensure format is correct
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
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
      has_job_order: faker.datatype.boolean(),
      has_borrow: faker.datatype.boolean(),
      has_reservation: faker.datatype.boolean(),
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
      has_reservation: faker.datatype.boolean(),
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
      has_reservation: faker.datatype.boolean(),
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
      has_reservation: faker.datatype.boolean(),
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
      has_reservation: faker.datatype.boolean(),
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
  const productIds = await db.select().from(product);
  const remarksIDs = await db.select().from(remarktickets);

  // Hardcoded realistic data for remark items
  const remarkitemsRecords = [
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Item is damaged upon arrival',
      quantity: 5,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Incorrect item sent to customer',
      quantity: 1,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Missing parts for assembly',
      quantity: 3,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Quality issues detected during inspection',
      quantity: 10,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Returned by the customer due to dissatisfaction',
      quantity: 2,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
      remark_status: 'Pending further evaluation by the quality team',
      quantity: 7,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
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

async function seedPriceHistory(db: PostgresJsDatabase<SchemaType>) {
  const productIds = await db.select().from(product);

  // Define real data for price history records
  const pricehistoryRecords = [
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-15'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-02-20'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-25'),
    },
    {
      product_id: faker.helpers.arrayElement(productIds).product_id,
      price: faker.finance.amount({ min: 500, max: 3000 }),
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
  const productIds = await db.select().from(product); // Fetch existing product IDs
  const itemTags = [
    'New',
    'Old',
    'Damaged',
    'Refurbished',
    'Used',
    'Antique',
    'Repaired',
  ] as const;

  // Ensure there are suppliers and products to associate with the inventory
  if (supplierIDs.length === 0 || productIds.length === 0) {
    throw new Error('No suppliers or products found. Seed them first.');
  }

  // Generate inventory records dynamically
  const inventoryRecords = Array.from({ length: 10 }, () => ({
    supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
    product_id: faker.helpers.arrayElement(productIds).product_id,
    tag: faker.helpers.arrayElement(itemTags),
    stock: faker.number.int({ min: 500, max: 5000 }),
    reserve_stock: 0,
    unit_price: faker.finance.amount({ min: 500, max: 3000 }),
  }));

  await db.transaction(async (tx) => {
    for (const inventory of inventoryRecords) {
      const [insertedRecord] = await tx
        .insert(inventory_record)
        .values(inventory)
        .returning({
          inventory_record_id: inventory_record.inventory_record_id,
          product_id: inventory_record.product_id,
          quantity: inventory_record.stock,
          tag: inventory_record.tag,
        });

      await tx.insert(stocksLogs).values({
        product_id: insertedRecord.product_id,
        quantity: insertedRecord.quantity,
        movement_type: 'Stock-In',
        action: `${insertedRecord.quantity} has been added with a tag of ${insertedRecord.tag}`,
      });
    }
  });
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
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-10'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Laptop Pro 15',
      description: 'A powerful laptop suitable for professionals and students.',
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-02-15'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'SSD',
      description:
        '"High-speed NVMe SSD with rapid data transfer and reliable performance."',
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'LCD',
      description:
        'Vibrant LCD monitor with sharp resolution and wide viewing angles, perfect for immersive gaming and professional work.',
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Wireless Headphones',
      description:
        'Noise-cancelling wireless headphones with excellent sound quality.',
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Mouse',
      description:
        'High-precision wired mouse with ergonomic design and customizable buttons for smooth navigation and enhanced gaming performance.',
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Wireless Mouse',
      description:
        'Ergonomic wireless mouse with precise tracking and customizable buttons for seamless navigation and enhanced productivity',
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Keyboard',
      description:
        'Mechanical keyboard with tactile switches and customizable RGB backlighting for an enhanced typing experience and personalized style.',
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Nvidia GPU',
      description:
        'High-performance graphics card with advanced cooling technology and real-time ray tracing for stunning visuals and smooth gaming experiences.',
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Amd GPU',
      description:
        'High-performance graphics card with advanced cooling technology and real-time ray tracing for stunning visuals and smooth gaming experiences.',
      on_listing: true,
      re_order_level: 150,
      total_stocks: 300,
      inventory_limit: 5000,
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    // Add more products as needed
  ];

  // Insert the real data into the database
  await db.insert(product).values(productRecords);

  log.info('Product records seeded successfully');
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
  const suppliersIDs = await db.select().from(supplier);
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
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
    {
      supplier_id: faker.helpers.arrayElement(suppliersIDs).supplier_id,
      category_id: faker.helpers.arrayElement(categoryIDs).category_id,
    },
  ];
  await db.insert(product_category).values(productcategoryRecords);

  log.info('Product Category records seeded successfully');
}

async function seedSupplier(db: PostgresJsDatabase<SchemaType>) {
  const relationship = [
    'manufacturer',
    'distributor',
    'wholesaler',
    'vendor',
    'authorized dealer',
    'OEM (Original Equipment Manufacturer)',
    'peripheral supplier',
    'component reseller',
    'refurbished parts supplier',
    'specialized parts supplier',
    'network hardware supplier',
    'value-added reseller',
    'accessories supplier',
    'logistics partner',
  ];
  const supplierRecords = [
    {
      name: 'ABC Computer Supplies',
      contact_number: '123-456-7890',
      remarks: 'Reliable supplier for all computer components.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-03-01'),
    },
    {
      name: 'XYZ Electronics',
      contact_number: '987-654-3210',
      remarks: 'Specializes in high-performance gaming hardware.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-03-15'),
    },
    {
      name: 'Tech Wholesalers Inc.',
      contact_number: '555-123-4567',
      remarks: 'Offers bulk discounts on all products.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-01-15'),
      last_updated: new Date('2023-03-10'),
    },
    {
      name: 'Gadget Hub',
      contact_number: '555-987-6543',
      remarks: 'New supplier focused on innovative tech solutions.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-02-10'),
      last_updated: new Date('2023-03-20'),
    },
    {
      name: 'CompTech Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Raqui Technology Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Aj Powerhouse Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Shaheen Computer Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Christian Computer World',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Paps Parts Supply',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Reyminator Computer Paradise',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationship),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
  ];

  await db.insert(supplier).values(supplierRecords);

  log.info('Supplier records seeded successfully');
}

async function seedOrder(db: PostgresJsDatabase<SchemaType>) {
  const supplierIDs = await db.select().from(supplier);

  const orderRecords = Array.from({ length: 7 }, () => ({
    supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
    ordered_value: 0,
    expected_arrival: new Date('2023-11-15').toISOString(),
    status: 'Pending',
    created_at: new Date('2023-10-01'),
    last_updated: new Date('2023-10-15'),
  }));

  await db.transaction(async (tx) => {
    for (const orderData of orderRecords) {
      const [insertedOrder] = await tx
        .insert(order)
        .values(orderData)
        .returning({ order_id: order.order_id });

      // Use the returned order_id directly for the log
      await tx.insert(orderLogs).values({
        order_id: insertedOrder.order_id,
        title: 'Created Order',
        message: 'Create empty state of order, ready for usage',
      });
    }
  });

  log.info('Order records seeded successfully');
}

//  =======================================================================================
// =================================== PARTORDER ==========================================

async function main() {
  try {
    await createProfileBucketIfNotExists();

    await seedDepartments(db);
    await seedDesignations(db);

    await seedEmployeePosition(db);
    await seedEmployeesRole(db);
    await seedEmployees(db);
    await seedEmployeesAccount(db);
    await seedAuditLogs(db);

    // Inventory
    await seedCategory(db);
    await seedSupplier(db);
    await seedProduct(db);
    await seedProductCategory(db);
    await seedInventoryRecord(db);
    await seedPriceHistory(db);

    // await seedOrder(db);
    // Participants and related data
    await seedCustomer(db); // Seed customers first
    // await seedInquiry(db);
    // await seedChannel(db);
    // await seedParticipants(db);
    // await seedMessage(db);

    // // Sales and related data
    await seedService(db);
    // await seedPayment(db);
    // await seedReceipt(db);
    await seedSalesItem(db);
    await seedBorrow(db);
    await seedReserve(db);

    // // Job Order and related data
    await seedJobOrderTypes(db);
    await seedJobOrder(db);
    await seedJobOrderServices(db);

    // // Pass employee IDs to seedRemarkTickets
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
