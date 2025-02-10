/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from '@faker-js/faker';

import log from '../lib/logger';
import { db, pool } from './pool';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SupabaseService } from '../supabase/supabase.service';
import * as fs from 'fs';
import * as path from 'path';
import mime from 'mime';
import { desc } from 'drizzle-orm';
import { customer } from './schema/customer';
import {
  position,
  employee,
  roles,
  department,
  designation,
  employeeRoles,
} from './schema/ems';
import { product, supplier, category, order } from './schema/ims';
import { payment, receipt } from './schema/payment';
import {
  reserve,
  borrow,
  jobOrder,
  reports,
  jobordertype,
} from './schema/services';
import { SchemaType } from './schema/type';
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
            'image/jpeg',
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

  await db.insert(employeeRoles).values(users);
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

//  =======================================================================================
// ==================================== SERVICES ======================================

// async function seedReserve(db: PostgresJsDatabase<SchemaType>) {
//   const serviceIDs = await db.select().from(service);
//   const productIds = await db.select().from(product);

//   const status = [
//     'Reserved',
//     'Confirmed', // This status was missing in your original list
//     'Cancelled',
//     'Pending',
//     'Completed',
//   ] as const;

//   const reserveRecords = [
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       reserve_status: faker.helpers.arrayElement(status),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//   ];

//   await db.insert(reserve).values(reserveRecords);
//   log.info('Reserve records seeded successfully');
// }

// async function seedBorrow(db: PostgresJsDatabase<SchemaType>) {
//   const serviceIDs = await db.select().from(service);
//   const salesItemsIDs = await db.select().from(sales_items);

//   const statuses = [
//     'Requested',
//     'Approved',
//     'Borrowed',
//     'Returned',
//     'Overdue',
//     'Rejected',
//     'Cancelled',
//     'Lost',
//     'Damaged',
//   ] as const; // Use 'as const' for TypeScript to infer literal types

//   const borrowRecords = [
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 10, // Example fee in the specified currency
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_item_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 20,
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 15,
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 30,
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 5,
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 5,
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 5,
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 5,
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 5,
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       sales_items_id: faker.helpers.arrayElement(salesItemsIDs).sales_items_id, // Use sales_items_id here
//       borrow_date: faker.date.past().toISOString(),
//       return_date: faker.date.future().toISOString(),
//       fee: 5,
//       status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(), // Ensure format is correct
//       last_updated: faker.date.recent(), // Ensure format is correct
//     },
//     // Add more real-world borrow records here
//   ];

//   await db.insert(borrow).values(borrowRecords);
//   log.info('Borrow records seeded successfully');
// }

// async function seedService(db: PostgresJsDatabase<SchemaType>) {
//   const employeeIDs = await db.select().from(employee);
//   const customerIDs = await db.select().from(customer);

//   const serviceRecords = [
//     {
//       employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
//       customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
//       service_title: 'Web Development',
//       service_description:
//         'Full-stack web development service including design and deployment.',
//       service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
//       has_sales_item: faker.datatype.boolean(),
//       has_job_order: faker.datatype.boolean(),
//       has_borrow: faker.datatype.boolean(),
//       has_reservation: faker.datatype.boolean(),
//       created_at: new Date('2024-01-01T08:00:00Z'),
//       last_updated: new Date('2024-01-01T08:00:00Z'),
//     },
//     {
//       employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
//       customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
//       service_title: 'Graphic Design',
//       service_description:
//         'Professional graphic design services for branding and marketing.',
//       service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
//       has_sales_item: faker.datatype.boolean(),
//       has_borrow: faker.datatype.boolean(),
//       has_reservation: faker.datatype.boolean(),
//       has_job_order: faker.datatype.boolean(),
//       created_at: new Date('2024-01-05T08:00:00Z'),
//       last_updated: new Date('2024-01-05T08:00:00Z'),
//     },
//     {
//       employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
//       customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
//       service_title: 'Consulting',
//       service_description:
//         'Business consulting services to improve your organization’s performance.',
//       service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
//       has_sales_item: faker.datatype.boolean(),
//       has_borrow: faker.datatype.boolean(),
//       has_reservation: faker.datatype.boolean(),
//       has_job_order: faker.datatype.boolean(),
//       created_at: new Date('2024-01-10T08:00:00Z'),
//       last_updated: new Date('2024-01-10T08:00:00Z'),
//     },
//     {
//       employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
//       customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
//       service_title: 'Digital Marketing',
//       service_description:
//         'Comprehensive digital marketing services, including SEO and social media management.',
//       service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
//       has_sales_item: faker.datatype.boolean(),
//       has_borrow: faker.datatype.boolean(),
//       has_reservation: faker.datatype.boolean(),
//       has_job_order: faker.datatype.boolean(),
//       created_at: new Date('2024-01-15T08:00:00Z'),
//       last_updated: new Date('2024-01-15T08:00:00Z'),
//     },
//     {
//       employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
//       customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
//       service_title: 'Content Writing',
//       service_description:
//         'Expert content writing services for blogs, articles, and web content.',
//       service_status: 'Active' as 'Active' | 'Inactive', // Ensure type is correctly set      has_reservation: faker.datatype.boolean(),
//       has_sales_item: faker.datatype.boolean(),
//       has_borrow: faker.datatype.boolean(),
//       has_reservation: faker.datatype.boolean(),
//       has_job_order: faker.datatype.boolean(),
//       created_at: new Date('2024-01-20T08:00:00Z'),
//       last_updated: new Date('2024-01-20T08:00:00Z'),
//     },
//     // Add more real-world service records as needed
//   ];

//   await db.insert(service).values(serviceRecords);
//   log.info('Service records seeded successfully');
// }

// async function seedAssignedEmployees(db: PostgresJsDatabase<SchemaType>) {
//   // Fetch existing job orders and employees from the database
//   const jobOrders = await db.select().from(jobOrder);
//   const employees = await db.select().from(employee);

//   // Ensure that there are job orders and employees to seed
//   if (jobOrders.length === 0 || employees.length === 0) {
//     log.error(
//       'No job orders or employees found. Cannot seed assigned employees.',
//     );
//     return;
//   }

//   // Hardcoded realistic data for assigned employees
//   const assignedEmployeesRecords = [
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'John Doe', // Assuming this is the person assigning
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'Jane Smith',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'Alice Johnson',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'Michael Brown',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'Emily Davis',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'Rey Larombe',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'Aj Tollo',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'Catto Akii',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'Shaheen Adlawin',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       employee_id: faker.helpers.arrayElement(employees).employee_id,
//       assigned_by: 'Rhyss Jimenez',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     // Add more records as needed
//   ];

//   await db.insert(assignedemployees).values(assignedEmployeesRecords);
//   log.info('Assigned Employees seeded successfully');
// }

// async function seedRemarkTickets(db: PostgresJsDatabase<SchemaType>) {
//   // Fetch existing job orders, remark types, and employees from the database
//   const jobOrders = await db.select().from(jobOrder);
//   const remarktypeIDs = await db.select().from(remarktype);
//   const employeeIDs = await db.select().from(employee);

//   const remark_status: (
//     | 'Open'
//     | 'In Progress'
//     | 'Resolved'
//     | 'Closed'
//     | 'Pending'
//     | 'Rejected'
//   )[] = ['Open', 'In Progress', 'Resolved', 'Closed', 'Pending', 'Rejected'];

//   // Hardcoded realistic data for remark tickets
//   const remarkticketsRecords = [
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Quality Issue on Job #123', // Example title
//       description: 'There was a quality issue with the materials used.', // Example description
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Delayed Delivery for Job #456',
//       description: 'The delivery is delayed due to supplier issues.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Customer Complaint on Job #789',
//       description: 'The customer reported issues with the service provided.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Job Completed for Job #321',
//       description: 'The job was completed successfully and closed.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Urgent Issue with Job #654',
//       description: 'An urgent issue has arisen that needs immediate attention.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Follow-Up Needed for Job #888',
//       description:
//         'A follow-up is required for additional details on Job #888.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Payment Dispute for Job #234',
//       description:
//         'There is a dispute regarding the payment for Job #234 that needs resolution.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Quality Feedback for Job #567',
//       description: 'Feedback from the quality assurance team on Job #567.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Client Request for Job #876',
//       description: 'The client has made a special request regarding Job #876.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Follow-Up on Warranty for Job #345',
//       description:
//         'A follow-up is required regarding the warranty for Job #345.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(jobOrders).job_order_id,
//       remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
//       title: 'Issue with Job #135',
//       description:
//         'There is a technical issue with Job #135 that requires urgent attention.',
//       remarktickets_status: faker.helpers.arrayElement(remark_status),
//       created_by: faker.helpers.arrayElement(employeeIDs).employee_id,
//       deadline: faker.date.future().toISOString(),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     // Add more records as needed
//   ];

//   await db.insert(remarktickets).values(remarkticketsRecords);
//   log.info('Remark Tickets seeded successfully');
// }

// async function seedRemarkItems(db: PostgresJsDatabase<SchemaType>) {
//   // Fetch existing items and remark tickets from the database
//   const productIds = await db.select().from(product);
//   const remarksIDs = await db.select().from(remarktickets);

//   // Hardcoded realistic data for remark items
//   const remarkitemsRecords = [
//     {
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
//       remark_status: 'Item is damaged upon arrival',
//       quantity: 5,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
//       remark_status: 'Incorrect item sent to customer',
//       quantity: 1,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
//       remark_status: 'Missing parts for assembly',
//       quantity: 3,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
//       remark_status: 'Quality issues detected during inspection',
//       quantity: 10,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
//       remark_status: 'Returned by the customer due to dissatisfaction',
//       quantity: 2,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
//       remark_status: 'Pending further evaluation by the quality team',
//       quantity: 7,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       product_id: faker.helpers.arrayElement(productIds).product_id,
//       remark_id: faker.helpers.arrayElement(remarksIDs).remark_id,
//       remark_status: 'Customer reported a missing item',
//       quantity: 4,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//   ];

//   // Insert remark items into the database
//   await db.insert(remarkitems).values(remarkitemsRecords);
//   log.info('Remark items seeded successfully.');
// }

// async function seedRemarkReports(db: PostgresJsDatabase<SchemaType>) {
//   const reportIDs = await db.select().from(reports);
//   const remarkIDs = await db.select().from(remarktickets);

//   const remarkreportsRecords = Array.from({ length: 70 }).map(() => ({
//     reports_id: faker.helpers.arrayElement(reportIDs).reports_id,
//     remark_id: faker.helpers.arrayElement(remarkIDs).remark_id,
//     created_at: faker.date.recent(),
//     last_updated: faker.date.recent(),
//   }));

//   await db.insert(remarkreports).values(remarkreportsRecords);

//   log.info('Remark Reports seeded successfully');
// }

// async function seedRemarkType(db: PostgresJsDatabase<SchemaType>) {
//   // Hardcoded realistic data for remark types
//   const remarktypeRecords = [
//     {
//       name: 'Product Quality Issue',
//       description:
//         'Remarks related to product quality concerns, including defects and damages.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Customer Service Feedback',
//       description:
//         'Comments and feedback regarding customer service experiences.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Shipping Delay',
//       description: 'Remarks concerning delays in shipping and delivery times.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Order Inaccuracy',
//       description:
//         'Issues reported when an order does not match what was received.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Return Process Feedback',
//       description:
//         'Feedback regarding the return process and related customer experiences.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Missing Items',
//       description:
//         'Remarks about items that were expected but not included in the order.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Product Recommendation',
//       description:
//         'Remarks regarding suggestions for product improvements or alternatives.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//   ];

//   // Insert remark types into the database
//   await db.insert(remarktype).values(remarktypeRecords);

//   log.info('Remark types seeded successfully.');
// }

// async function seedRemarkAssigned(db: PostgresJsDatabase<SchemaType>) {
//   const employeeIDs = await db.select().from(employee);
//   const remarkIDs = await db.select().from(remarktickets);

//   const remarkassignedRecords = Array.from({ length: 70 }).map(() => ({
//     remark_id: faker.helpers.arrayElement(remarkIDs).remark_id,
//     employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
//     created_at: faker.date.recent(),
//     last_updated: faker.date.recent(),
//   }));

//   await db.insert(remarkassigned).values(remarkassignedRecords);

//   log.info('Remark Assigned seeded successfully');
// }

// async function seedRemarkContent(db: PostgresJsDatabase<SchemaType>) {
//   // Hardcoded realistic data for remark content
//   const remarkcontentRecords = [
//     {
//       name: 'Quality Assurance Feedback',
//       markdown:
//         'Our quality assurance team has reviewed your product. **Please address the following issues:**\n\n- Defective parts\n- Improper assembly\n- Missing components.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Customer Service Interaction',
//       markdown:
//         'Thank you for reaching out to us. **Here’s a summary of our conversation:**\n\n- Discussed your order status\n- Agreed to send a replacement item\n- Confirmed delivery timeline.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Shipping Issue Report',
//       markdown:
//         'We have identified an issue with your shipment. **Key points:**\n\n- Delay due to weather conditions\n- Estimated delivery pushed back by 2 days.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Return Policy Clarification',
//       markdown:
//         'Here are the details regarding our return policy: **You can return items within 30 days.**\n\n- Items must be unopened and in original packaging.\n- Refunds will be processed within 5 business days.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Order Discrepancy Report',
//       markdown:
//         'We noticed a discrepancy with your recent order. **Details:**\n\n- Ordered 3 items, but only received 2.\n- Missing item: Wireless Mouse.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Product Improvement Suggestions',
//       markdown:
//         'Thank you for your feedback! **We appreciate your suggestions:**\n\n- Consider improving battery life.\n- Enhance user interface for better experience.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Customer Satisfaction Survey',
//       markdown:
//         'We value your opinion! **Please fill out our survey:**\n\n- Rate your experience from 1 to 5.\n- Share any comments or suggestions.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//   ];

//   // Insert remark content into the database
//   await db.insert(remarkcontent).values(remarkcontentRecords);

//   log.info('Remark content seeded successfully.');
// }

// //  =======================================================================================
// // =================================== JOB ORDER ==========================================

// async function seedJobOrder(db: PostgresJsDatabase<SchemaType>) {
//   const serviceIDs = await db.select().from(service);

//   const statuses: (
//     | 'Pending'
//     | 'In Progress'
//     | 'Completed'
//     | 'On Hold'
//     | 'Cancelled'
//     | 'Awaiting Approval'
//     | 'Approved'
//     | 'Rejected'
//     | 'Closed'
//   )[] = [
//     'Pending',
//     'In Progress',
//     'Completed',
//     'On Hold',
//     'Cancelled',
//     'Awaiting Approval',
//     'Approved',
//     'Rejected',
//     'Closed',
//   ];

//   // Hardcoded realistic data for job orders
//   const joborderRecords = [
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id, // Assuming this corresponds to an existing service
//       uuid: 'e6e1c3b1-4eab-4bc9-899c-7300a702f7f3',
//       fee: 75,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 150.0,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       uuid: '7b63e580-3e6f-45eb-b5f2-d1e8602392f9',
//       fee: 50,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 100.5,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       uuid: '99342869-3f69-4047-b477-d54c780a0c04',
//       fee: 100,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 200.0,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       uuid: 'd18e55cb-5c97-4c4e-81a0-5c8965b0982c',
//       fee: 20,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 40.75,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       uuid: 'c0fca47c-04fa-4eec-ae90-514b7d84d6f0',
//       fee: 30,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 60.0,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       uuid: '7a52c4a8-b6c0-4d12-a50e-2e3acde32bfa',
//       fee: 150,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 300.0,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       uuid: '14bbaeb7-e46e-4049-a321-1f8a71eae2c7',
//       fee: 200,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 400.0,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       uuid: '44e54e8d-9338-4de9-9e4b-0b6cf4467ca1',
//       fee: 90,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 180.0,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       uuid: '5d793337-7d4b-4e38-9fb4-6cb7aa205eeb',
//       fee: 80,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 160.0,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       service_id: faker.helpers.arrayElement(serviceIDs).service_id,
//       uuid: 'efbfa15b-9283-490f-8181-488b488a8fef',
//       fee: 120,
//       joborder_status: faker.helpers.arrayElement(statuses),
//       total_cost_price: 240.0,
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//   ];

//   // Insert job orders into the database
//   await db.insert(jobOrder).values(joborderRecords);

//   log.info('Job Order records seeded successfully.');
// }

// async function seedReports(db: PostgresJsDatabase<SchemaType>) {
//   const joborderIDs = await db.select().from(jobOrder);

//   // Hardcoded realistic data for reports
//   const reportsRecords = [
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Initial Review of Job Order #1',
//       remarks: 'All documents are in order, ready for processing.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Progress Update for Job Order #2',
//       remarks:
//         'Work is currently in progress, slight delays due to material shortage.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Completion Report for Job Order #3',
//       remarks:
//         'The job order has been completed successfully, awaiting customer feedback.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Issues Reported for Job Order #4',
//       remarks: 'Customer reported a discrepancy in billing; review initiated.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Final Assessment for Job Order #5',
//       remarks: 'All requirements have been met; closing report prepared.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Follow-Up for Job Order #6',
//       remarks:
//         "Scheduled follow-up on the customer's feedback; no issues reported.",
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Alert for Job Order #7',
//       remarks:
//         'Critical delays in the supply chain; immediate action required.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Evaluation Report for Job Order #8',
//       remarks:
//         'Evaluation completed; improvements suggested for future orders.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Customer Satisfaction for Job Order #9',
//       remarks: 'Customer feedback is positive; satisfaction survey completed.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//       reports_title: 'Closure Notice for Job Order #10',
//       remarks:
//         'Job order has been officially closed; all documentation submitted.',
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//   ];

//   // Insert reports into the database
//   await db.insert(reports).values(reportsRecords);

//   log.info('Report records seeded successfully.');
// }

// async function seedJobOrderTypes(db: PostgresJsDatabase<SchemaType>) {
//   // Define possible statuses for job order types
//   const statuses: ('Available' | 'Not Available')[] = [
//     'Available',
//     'Not Available',
//   ];

//   // Hardcoded realistic data for job order types
//   const jobordertypesRecords = [
//     {
//       name: 'Routine Maintenance',
//       description: 'Scheduled maintenance to ensure optimal performance.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Emergency Repair',
//       description: 'Urgent repair services for immediate issues.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Installation Service',
//       description: 'Professional installation services for new equipment.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Consultation',
//       description: 'Expert consultation services for project planning.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Product Warranty Service',
//       description: 'Service offered under product warranty agreements.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Upgrades and Modifications',
//       description: 'Enhancements to existing systems and processes.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Routine Inspection',
//       description: 'Regular inspection services to ensure compliance.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Special Request Service',
//       description: 'Custom services based on specific client requests.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Training Service',
//       description: 'Training and support services for staff.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//     {
//       name: 'Follow-Up Service',
//       description: 'Post-service follow-up to ensure satisfaction.',
//       joborder_types_status: faker.helpers.arrayElement(statuses),
//       created_at: faker.date.recent(),
//       last_updated: faker.date.recent(),
//     },
//   ];

//   // Insert job order types into the database
//   await db.insert(jobordertype).values(jobordertypesRecords);

//   log.info('Job Order Types seeded successfully.');
// }

// async function seedJobOrderServices(db: PostgresJsDatabase<SchemaType>) {
//   const jobordertypesIDs = await db.select().from(jobordertype);
//   const joborderIDs = await db.select().from(jobOrder);

//   const joborderservicesRecords = Array.from({ length: 50 }).map(() => ({
//     joborder_types_id:
//       faker.helpers.arrayElement(jobordertypesIDs).joborder_type_id,
//     job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
//     created_at: faker.date.recent(),
//     last_updated: faker.date.recent(),
//   }));

//   await db.insert(joborder_services).values(joborderservicesRecords);

//   log.info('Job Order Services records seeded successfully');
// }
// //  =======================================================================================
// // =================================== INVENTORY ==========================================

// async function seedItemRecord(db: PostgresJsDatabase<SchemaType>) {
//   const supplierIDs = await db.select().from(supplier); // Fetch existing supplier IDs
//   const productIds = await db.select().from(product); // Fetch existing product IDs
//   const itemTags = [
//     'New',
//     'Old',
//     'Damaged',
//     'Refurbished',
//     'Used',
//     'Antique',
//     'Repaired',
//   ] as const;

//   // Ensure there are suppliers and products to associate with the inventory
//   if (supplierIDs.length === 0 || productIds.length === 0) {
//     throw new Error('No suppliers or products found. Seed them first.');
//   }

//   // Generate inventory records dynamically
//   const itemRecords = Array.from({ length: 10 }, () => ({
//     supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
//     product_id: faker.helpers.arrayElement(productIds).product_id,
//     total_stock: faker.number.int({ min: 500, max: 5000 }),
//   }));

//   await db.transaction(async (tx) => {
//     for (const inventory of itemRecords) {
//       const [insertedRecord] = await tx
//         .insert(item_record)
//         .values(inventory)
//         .returning({
//           item_record_id: item_record.item_record_id,
//           product_id: item_record.product_id,
//           total_stock: item_record.total_stock,
//         });

//       await tx.insert(stocksLogs).values({
//         product_id: insertedRecord.product_id,
//         movement_type: 'Stock-In',
//       });
//     }
//   });
//   log.info('Item Records records seeded successfully');
// }

// async function seedProduct(db: PostgresJsDatabase<SchemaType>) {
//   const productRecords = [
//     {
//       name: 'Ram',
//       description:
//         'High-performance DDR4 RAM module with a clock speed of 3200MHz, designed to provide faster data transfer and improve overall system responsiveness.',
//       stock_limit: 5000,
//       created_at: new Date('2023-01-01'),
//       last_updated: new Date('2023-01-10'),
//     },
//     {
//       name: 'Laptop Pro 15',
//       description: 'A powerful laptop suitable for professionals and students.',
//       stock_limit: 5000,
//       created_at: new Date('2023-02-01'),
//       last_updated: new Date('2023-02-15'),
//     },
//     {
//       name: 'SSD',
//       description:
//         '"High-speed NVMe SSD with rapid data transfer and reliable performance."',
//       stock_limit: 5000,
//       created_at: new Date('2023-03-01'),
//       last_updated: new Date('2023-03-20'),
//     },
//     {
//       name: 'LCD',
//       description:
//         'Vibrant LCD monitor with sharp resolution and wide viewing angles, perfect for immersive gaming and professional work.',
//       stock_limit: 5000,
//       created_at: new Date('2023-03-01'),
//       last_updated: new Date('2023-03-20'),
//     },
//     {
//       name: 'Wireless Headphones',
//       description:
//         'Noise-cancelling wireless headphones with excellent sound quality.',
//       stock_limit: 5000,
//       created_at: new Date('2023-03-01'),
//       last_updated: new Date('2023-03-20'),
//     },
//     {
//       name: 'Mouse',
//       description:
//         'High-precision wired mouse with ergonomic design and customizable buttons for smooth navigation and enhanced gaming performance.',
//       stock_limit: 5000,
//       created_at: new Date('2023-03-01'),
//       last_updated: new Date('2023-03-20'),
//     },
//     {
//       name: 'Wireless Mouse',
//       description:
//         'Ergonomic wireless mouse with precise tracking and customizable buttons for seamless navigation and enhanced productivity',
//       stock_limit: 5000,
//       created_at: new Date('2023-03-01'),
//       last_updated: new Date('2023-03-20'),
//     },
//     {
//       name: 'Keyboard',
//       description:
//         'Mechanical keyboard with tactile switches and customizable RGB backlighting for an enhanced typing experience and personalized style.',
//       stock_limit: 5000,
//       created_at: new Date('2023-03-01'),
//       last_updated: new Date('2023-03-20'),
//     },
//     {
//       name: 'Nvidia GPU',
//       description:
//         'High-performance graphics card with advanced cooling technology and real-time ray tracing for stunning visuals and smooth gaming experiences.',
//       stock_limit: 5000,
//       created_at: new Date('2023-03-01'),
//       last_updated: new Date('2023-03-20'),
//     },
//     {
//       name: 'Amd GPU',
//       description:
//         'High-performance graphics card with advanced cooling technology and real-time ray tracing for stunning visuals and smooth gaming experiences.',
//       stock_limit: 5000,
//       created_at: new Date('2023-03-01'),
//       last_updated: new Date('2023-03-20'),
//     },
//     // Add more products as needed
//   ];

//   // Insert the real data into the database
//   await db.insert(product).values(productRecords);

//   log.info('Product records seeded successfully');
// }

// async function seedProductVariantSupplier(db: PostgresJsDatabase<SchemaType>) {
//   // Fetch existing variant and supplier data
//   const variants = await db.select().from(variant);
//   const suppliers = await db.select().from(supplier);

//   const productVariantSuppliers = [
//     {
//       variant_id: variants[0].variant_id,
//       supplier: suppliers[0].supplier_id,

//       supply_price: 150.25,
//       minimum_order_quan: 10,
//       lead_time_days: '7',
//     },
//     {
//       variant_id: variants[1].variant_id,
//       supplier: suppliers[1].supplier_id,

//       supply_price: 200.5,
//       minimum_order_quan: 20,
//       lead_time_days: '14',
//     },
//     {
//       variant_id: variants[2].variant_id,
//       supplier: suppliers[2].supplier_id,

//       supply_price: 100.75,
//       minimum_order_quan: 5,
//       lead_time_days: '3',
//     },
//     {
//       variant_id: variants[3].variant_id,
//       supplier: suppliers[0].supplier_id,

//       supply_price: 300.0,
//       minimum_order_quan: 50,
//       lead_time_days: '30',
//     },
//     {
//       variant_id: variants[4].variant_id,
//       supplier: suppliers[1].supplier_id,

//       supply_price: 250.0,
//       minimum_order_quan: 15,
//       lead_time_days: '10',
//     },
//     {
//       variant_id: variants[5].variant_id,
//       supplier: suppliers[0].supplier_id,
//       supply_price: 180.99,
//       minimum_order_quan: 25,
//       lead_time_days: '14-21 days',
//     },
//     {
//       variant_id: variants[6].variant_id,
//       supplier: suppliers[1].supplier_id,
//       supply_price: 75.5,
//       minimum_order_quan: 5,
//       lead_time_days: '2-3 days',
//     },
//     {
//       variant_id: variants[7].variant_id,
//       supplier: suppliers[2].supplier_id,
//       supply_price: 250.0,
//       minimum_order_quan: 30,
//       lead_time_days: '10-14 days',
//     },
//     {
//       variant_id: variants[8].variant_id,
//       supplier: suppliers[3].supplier_id,
//       supply_price: 140.75,
//       minimum_order_quan: 18,
//       lead_time_days: '6-9 days',
//     },
//     {
//       variant_id: variants[9].variant_id,
//       supplier: suppliers[4].supplier_id,
//       supply_price: 210.25,
//       minimum_order_quan: 22,
//       lead_time_days: '8-12 days',
//     },
//     {
//       variant_id: variants[10].variant_id,
//       supplier: suppliers[0].supplier_id,
//       supply_price: 95.4,
//       minimum_order_quan: 10,
//       lead_time_days: '3-4 days',
//     },
//     {
//       variant_id: variants[11].variant_id,
//       supplier: suppliers[1].supplier_id,
//       supply_price: 110.25,
//       minimum_order_quan: 12,
//       lead_time_days: '4-6 days',
//     },
//     {
//       variant_id: variants[12].variant_id,
//       supplier: suppliers[2].supplier_id,
//       supply_price: 135.0,
//       minimum_order_quan: 10,
//       lead_time_days: '6-8 days',
//     },
//     {
//       variant_id: variants[13].variant_id,
//       supplier: suppliers[3].supplier_id,
//       supply_price: 220.4,
//       minimum_order_quan: 18,
//       lead_time_days: '7-10 days',
//     },
//     {
//       variant_id: variants[14].variant_id,
//       supplier: suppliers[4].supplier_id,
//       supply_price: 165.0,
//       minimum_order_quan: 15,
//       lead_time_days: '10-14 days',
//     },
//     {
//       variant_id: variants[15].variant_id,
//       supplier: suppliers[0].supplier_id,
//       supply_price: 89.75,
//       minimum_order_quan: 8,
//       lead_time_days: '3-5 days',
//     },
//     {
//       variant_id: variants[16].variant_id,
//       supplier: suppliers[1].supplier_id,
//       supply_price: 145.5,
//       minimum_order_quan: 20,
//       lead_time_days: '14-21 days',
//     },
//     {
//       variant_id: variants[17].variant_id,
//       supplier: suppliers[2].supplier_id,
//       supply_price: 190.99,
//       minimum_order_quan: 25,
//       lead_time_days: '5-7 days',
//     },
//     {
//       variant_id: variants[18].variant_id,
//       supplier: suppliers[3].supplier_id,
//       supply_price: 115.3,
//       minimum_order_quan: 6,
//       lead_time_days: '2-4 days',
//     },
//     {
//       variant_id: variants[19].variant_id,
//       supplier: suppliers[4].supplier_id,
//       supply_price: 205.5,
//       minimum_order_quan: 30,
//       lead_time_days: '8-10 days',
//     },
//     {
//       variant_id: variants[20].variant_id,
//       supplier: suppliers[0].supplier_id,
//       supply_price: 140.0,
//       minimum_order_quan: 16,
//       lead_time_days: '6-9 days',
//     },
//   ];

//   // Insert the real data into the database
//   await db.insert(prdvariantsupp).values(productVariantSuppliers);

//   log.info('Product Variants Supplier records seeded successfully');
// }

// async function seedProductVariant(db: PostgresJsDatabase<SchemaType>) {
//   const products = await db.select().from(product);

//   const variants = [
//     {
//       product_id: products[0].product_id,
//       img_url: '',
//       variant_name: '16GB RAM - Silver',
//       attribute: { RAM: '16GB', Color: 'Silver', Storage: '512GB SSD' },
//     },
//     {
//       product_id: products[0].product_id,
//       variant_name: '16GB DDR4 RAM - 3200MHz',
//       attribute: { Size: '16GB', Type: 'DDR4', Speed: '3200MHz' },
//       img_url: '',
//     },
//     {
//       product_id: products[0].product_id,
//       variant_name: '32GB DDR4 RAM - 3600MHz',
//       attribute: { Size: '32GB', Type: 'DDR4', Speed: '3600MHz' },
//       img_url: '',
//     },
//     {
//       product_id: products[0].product_id,
//       variant_name: '8GB DDR5 RAM - 4800MHz',
//       attribute: { Size: '8GB', Type: 'DDR5', Speed: '4800MHz' },
//       img_url: '',
//     },
//     {
//       product_id: products[0].product_id,
//       variant_name: '16GB DDR5 RAM - 5200MHz',
//       attribute: { Size: '16GB', Type: 'DDR5', Speed: '5200MHz' },
//       img_url: '',
//     },
//     {
//       product_id: products[1].product_id,
//       img_url: '',
//       variant_name: '8GB RAM - Black',
//       attribute: { RAM: '8GB', Color: 'Black', Storage: '256GB SSD' },
//     },
//     {
//       product_id: products[1].product_id,
//       variant_name: 'NVIDIA RTX 3060 - 12GB',
//       attribute: { GPU: 'RTX 3060', Memory: '12GB', Type: 'GDDR6' },
//       img_url: '',
//     },
//     {
//       product_id: products[1].product_id,
//       variant_name: 'NVIDIA RTX 3070 - 8GB',
//       attribute: { GPU: 'RTX 3070', Memory: '8GB', Type: 'GDDR6' },
//       img_url: '',
//     },
//     {
//       product_id: products[1].product_id,
//       variant_name: 'NVIDIA RTX 3080 - 10GB',
//       attribute: { GPU: 'RTX 3080', Memory: '10GB', Type: 'GDDR6X' },
//       img_url: '',
//     },
//     {
//       product_id: products[1].product_id,
//       variant_name: 'AMD RX 6700 XT - 12GB',
//       attribute: { GPU: 'RX 6700 XT', Memory: '12GB', Type: 'GDDR6' },
//       img_url: '',
//     },
//     {
//       product_id: products[1].product_id,
//       variant_name: 'AMD RX 6800 XT - 16GB',
//       attribute: { GPU: 'RX 6800 XT', Memory: '16GB', Type: 'GDDR6' },
//       img_url: '',
//     },
//     {
//       product_id: products[2].product_id,
//       variant_name: '24-inch Full HD Monitor',
//       attribute: { Resolution: '1080p', Size: '24 inch', RefreshRate: '75Hz' },
//       img_url: '',
//     },
//     {
//       product_id: products[2].product_id,
//       variant_name: '27-inch QHD Monitor',
//       attribute: { Resolution: '1440p', Size: '27 inch', RefreshRate: '144Hz' },
//       img_url: '',
//     },
//     {
//       product_id: products[2].product_id,
//       variant_name: '32-inch UHD Monitor',
//       attribute: { Resolution: '4K', Size: '32 inch', RefreshRate: '60Hz' },
//       img_url: '',
//     },
//     {
//       product_id: products[2].product_id,
//       variant_name: '34-inch UltraWide Monitor',
//       attribute: {
//         Resolution: '3440x1440',
//         Size: '34 inch',
//         RefreshRate: '100Hz',
//       },
//       img_url: '',
//     },
//     {
//       product_id: products[2].product_id,
//       variant_name: '49-inch Super UltraWide Monitor',
//       attribute: {
//         Resolution: '5120x1440',
//         Size: '49 inch',
//         RefreshRate: '120Hz',
//       },
//       img_url: '',
//     },
//     {
//       product_id: products[2].product_id,
//       img_url: '',
//       variant_name: '64GB Storage - Blue',
//       attribute: { Storage: '64GB', Color: 'Blue', Camera: '12MP' },
//     },
//     {
//       product_id: products[3].product_id,
//       img_url: '',
//       variant_name: '128GB Storage - Red',
//       attribute: { Storage: '128GB', Color: 'Red', Battery: '4500mAh' },
//     },
//     {
//       product_id: products[4].product_id,
//       img_url: '',
//       variant_name: '4K Display - White',
//       attribute: { Resolution: '4K', Size: '27 inch', RefreshRate: '144Hz' },
//     },
//     {
//       product_id: products[3].product_id,
//       variant_name: 'Wireless Gaming Mouse',
//       attribute: { Connectivity: 'Wireless', DPI: '16000', Buttons: 6 },
//       img_url: '',
//     },
//     {
//       product_id: products[3].product_id,
//       variant_name: 'Wired Ergonomic Mouse',
//       attribute: { Connectivity: 'Wired', DPI: '12000', Buttons: 7 },
//       img_url: '',
//     },
//     {
//       product_id: products[3].product_id,
//       variant_name: 'Bluetooth Compact Mouse',
//       attribute: { Connectivity: 'Bluetooth', DPI: '8000', Buttons: 4 },
//       img_url: '',
//     },
//     {
//       product_id: products[3].product_id,
//       variant_name: 'RGB Gaming Mouse',
//       attribute: { Connectivity: 'Wired', DPI: '20000', Buttons: 8 },
//       img_url: '',
//     },
//     {
//       product_id: products[3].product_id,
//       variant_name: 'Trackball Precision Mouse',
//       attribute: { Connectivity: 'Wireless', DPI: '4000', Buttons: 5 },
//       img_url: '',
//     },
//     {
//       product_id: products[4].product_id,
//       variant_name: 'Mechanical Gaming Keyboard',
//       attribute: {
//         Switch: 'Cherry MX Red',
//         Layout: 'Full-size',
//         Backlight: 'RGB',
//       },
//       img_url: '',
//     },
//     {
//       product_id: products[4].product_id,
//       variant_name: 'Wireless Compact Keyboard',
//       attribute: {
//         Connectivity: 'Wireless',
//         Layout: 'Compact',
//         Backlight: 'White',
//       },
//       img_url: 'https://exam',
//     },
//     {
//       product_id: products[4].product_id,
//       variant_name: 'Ergonomic Split Keyboard',
//       attribute: { Layout: 'Split', Connectivity: 'Wired', Backlight: 'None' },
//       img_url: '',
//     },
//     {
//       product_id: products[4].product_id,
//       variant_name: 'Portable Bluetooth Keyboard',
//       attribute: {
//         Connectivity: 'Bluetooth',
//         Layout: 'Tenkeyless',
//         Backlight: 'None',
//       },
//       img_url: '',
//     },
//     {
//       product_id: products[4].product_id,
//       variant_name: 'Programmable Gaming Keyboard',
//       attribute: { Switch: 'Optical', Layout: 'Full-size', Backlight: 'RGB' },
//       img_url: '',
//     },
//     {
//       product_id: products[5].product_id,
//       variant_name: 'Gaming Laptop - High Performance',
//       attribute: {
//         CPU: 'Intel i7',
//         GPU: 'RTX 3070',
//         RAM: '16GB',
//         Storage: '1TB SSD',
//       },
//       img_url: '',
//     },
//     {
//       product_id: products[5].product_id,
//       variant_name: 'Ultrabook - Lightweight and Slim',
//       attribute: { CPU: 'Intel i5', RAM: '8GB', Storage: '512GB SSD' },
//       img_url: 'htt',
//     },
//     {
//       product_id: products[5].product_id,
//       variant_name: 'Business Laptop - Long Battery Life',
//       attribute: { CPU: 'Intel i7', RAM: '16GB', Storage: '1TB SSD' },
//       img_url: 'ht',
//     },
//     {
//       product_id: products[5].product_id,
//       variant_name: '2-in-1 Convertible Laptop',
//       attribute: { CPU: 'AMD Ryzen 5', RAM: '8GB', Storage: '512GB SSD' },
//       img_url: 'https',
//     },
//     {
//       product_id: products[5].product_id,
//       variant_name: 'Budget Laptop - Everyday Use',
//       attribute: { CPU: 'Intel i3', RAM: '4GB', Storage: '256GB SSD' },
//       img_url: '',
//     },
//   ];

//   // Insert the real data into the database
//   await db.insert(variant).values(variants);

//   log.info('Product Variants records seeded successfully');
// }

async function seedCategory(db: PostgresJsDatabase<SchemaType>) {
  const categoryRecords = [
    {
      name: 'Computers & Laptops',
      content:
        'Laptops, desktops, and all-in-one PCs for all your computing needs.',
    },
    {
      name: 'Components',
      content: 'Essential components to build or upgrade your system.',
    },
    {
      name: 'Peripherals',
      content: 'Accessories to enhance your computing experience.',
    },
    {
      name: 'Networking',
      content: 'Devices to ensure seamless connectivity and networking.',
    },
    {
      name: 'Accessories',
      content:
        'Supporting products like laptop bags, docking stations, and stands.',
    },
    {
      name: 'Software',
      content: 'Operating systems, productivity tools, and security software.',
    },
    {
      name: 'Others',
      content: 'Miscellaneous items like refurbished products and warranties.',
    },
  ];

  await db.insert(category).values(categoryRecords);

  log.info('Category records seeded successfully');
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

// async function seedOrder(db: PostgresJsDatabase<SchemaType>) {
//   const supplierIDs = await db.select().from(supplier);

//   const orderRecords = Array.from({ length: 7 }, () => ({
//     supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
//     ordered_value: 0,
//     expected_arrival: new Date('2023-11-15').toISOString(),
//     status: 'Pending',
//     created_at: new Date('2023-10-01'),
//     last_updated: new Date('2023-10-15'),
//   }));

//   await db.transaction(async (tx) => {
//     for (const orderData of orderRecords) {
//       const [insertedOrder] = await tx
//         .insert(order)
//         .values(orderData)
//         .returning({ order_id: order.order_id });
//     }
//   });

//   log.info('Order records seeded successfully');
// }

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

    // Inventory
    await seedCategory(db);
    await seedSupplier(db);
    // await seedProductVariant(db);
    // await seedProductVariantSupplier(db);

    // await seedItemRecord(db);

    // await seedOrder(db);
    // Participants and related data
    await seedCustomer(db); // Seed customers first
    // await seedInquiry(db);
    // await seedChannel(db);
    // await seedParticipants(db);
    // await seedMessage(db);

    // // Sales and related data
    // await seedService(db);
    // await seedPayment(db);
    // await seedReceipt(db);
    // await seedSalesItem(db);
    // await seedBorrow(db);
    // await seedReserve(db);

    // // Job Order and related data
    // await seedJobOrderTypes(db);
    // await seedJobOrder(db);
    // await seedJobOrderServices(db);

    // // Pass employee IDs to seedRemarkTickets
    // await seedRemarkType(db);
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
