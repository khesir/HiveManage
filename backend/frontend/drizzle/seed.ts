import { faker } from '@faker-js/faker';

import log from '../lib/logger';
import { db, pool } from './pool';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SupabaseService } from '../supabase/supabase.service';
import * as fs from 'fs';
import * as path from 'path';
import mime from 'mime';
import { SchemaType } from './schema/type';
import { customer } from './schema/customer';
import {
  position,
  employee,
  roles,
  department,
  designation,
  employeeRoles,
  personalInformation,
} from './schema/ems';

import { service_Type, ticketType } from './schema/services';
import { category, supplier } from './schema/ims';

const supabase = new SupabaseService();

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
async function createBucketByName(bucketName: string) {
  try {
    if (!bucketName) {
      throw new Error(
        'Bucket Name is not set in the env variables(PROFILE_BUCKET)',
      );
    }
    const { data: buckets, error: listError } = await supabase
      .getSupabase()
      .storage.listBuckets();

    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    const bucketExists = buckets.some((bucket) => bucket.name === bucketName);
    if (!bucketExists) {
      const { data, error } = await supabase
        .getSupabase()
        .storage.createBucket(bucketName, {
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
      return `Image bucket '${bucketName}' already exists.`;
    }
  } catch (error) {
    console.log(error);
  }
}
// ===================== EMPLOYEE BASE =========================

async function seedEmployees(db: PostgresJsDatabase<SchemaType>) {
  const employees = [
    {
      position_id: 1,
      firstname: 'Aj',
      middlename: 'Rizaldo',
      lastname: 'Tollo',
      email: 'admin@example.com',
    },
    {
      position_id: 2,
      firstname: 'Clyde Cedrick',
      middlename: 'Fabro',
      lastname: 'Macabangon',
      email: 'tech@example.com',
    },
    {
      position_id: 3,
      firstname: 'Rey',
      middlename: 'Juson',
      lastname: 'Larombe',
      email: 'sales@example.com',
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

async function seedPersonalInformation(db: PostgresJsDatabase<SchemaType>) {
  const employeeIDs = await db.select().from(employee);

  const personalInfoRecords = [
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      birthday: faker.date
        .birthdate({ min: 18, max: 65, mode: 'age' })
        .toISOString()
        .split('T')[0],
      sex: faker.person.gender(),
      phone: faker.phone.number(),
      address_line: faker.phone.number(),
      postal_code: faker.location.zipCode(),
      emergency_contact_name: faker.person.firstName(),
      emergency_contact_phone: faker.phone.number(),
      emergency_contact_relationship: faker.person.fullName(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      birthday: faker.date
        .birthdate({ min: 18, max: 65, mode: 'age' })
        .toISOString()
        .split('T')[0],
      sex: faker.person.gender(),
      phone: faker.phone.number(),
      address_line: faker.phone.number(),
      postal_code: faker.location.zipCode(),
      emergency_contact_name: faker.person.firstName(),
      emergency_contact_phone: faker.phone.number(),
      emergency_contact_relationship: faker.person.fullName(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      birthday: faker.date
        .birthdate({ min: 18, max: 65, mode: 'age' })
        .toISOString()
        .split('T')[0],
      sex: faker.person.gender(),
      phone: faker.phone.number(),
      address_line: faker.phone.number(),
      postal_code: faker.location.zipCode(),
      emergency_contact_name: faker.person.firstName(),
      emergency_contact_phone: faker.phone.number(),
      emergency_contact_relationship: faker.person.fullName(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      birthday: faker.date
        .birthdate({ min: 18, max: 65, mode: 'age' })
        .toISOString()
        .split('T')[0],
      sex: faker.person.gender(),
      phone: faker.phone.number(),
      address_line: faker.phone.number(),
      postal_code: faker.location.zipCode(),
      emergency_contact_name: faker.person.firstName(),
      emergency_contact_phone: faker.phone.number(),
      emergency_contact_relationship: faker.person.fullName(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      employee_id: faker.helpers.arrayElement(employeeIDs).employee_id,
      birthday: faker.date
        .birthdate({ min: 18, max: 65, mode: 'age' })
        .toISOString()
        .split('T')[0], // Convert Date to string
      sex: faker.person.gender(),
      phone: faker.phone.number(),
      address_line: faker.phone.number(),
      postal_code: faker.location.zipCode(),
      emergency_contact_name: faker.person.firstName(),
      emergency_contact_phone: faker.phone.number(),
      emergency_contact_relationship: faker.person.fullName(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];
  await db.insert(personalInformation).values(personalInfoRecords);
  log.info('Personal Information records seeded successfully.');
}

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
async function seedTicketType(db: PostgresJsDatabase<SchemaType>) {
  const tickettypeRecords = [
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

  await db.insert(ticketType).values(tickettypeRecords);
  log.info('Ticket types seeded successfully.');
}

async function seedCategory(db: PostgresJsDatabase<SchemaType>) {
  const categoryRecords = [
    {
      name: 'Accessories',
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Components',
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Networking',
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Peripherals',
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Storage',
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Electronics',
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(category).values(categoryRecords);
  log.info('Category records seeded successfully');
}

async function seedSupplier(db: PostgresJsDatabase<SchemaType>) {
  const relationships = [
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
  ] as const;
  const supplierStatuses = [
    'Unavailable',
    'Available',
    'Discontinued',
  ] as const;

  const supplierRecords = [
    {
      name: 'ABC Computer Supplies',
      contact_number: '123-456-7890',
      remarks: 'Reliable supplier for all computer components.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-03-01'),
    },
    {
      name: 'XYZ Electronics',
      contact_number: '987-654-3210',
      remarks: 'Specializes in high-performance gaming hardware.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-03-15'),
    },
    {
      name: 'Tech Wholesalers Inc.',
      contact_number: '555-123-4567',
      remarks: 'Offers bulk discounts on all products.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-01-15'),
      last_updated: new Date('2023-03-10'),
    },
    {
      name: 'Gadget Hub',
      contact_number: '555-987-6543',
      remarks: 'New supplier focused on innovative tech solutions.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-02-10'),
      last_updated: new Date('2023-03-20'),
    },
    {
      name: 'CompTech Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Raqui Technology Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Aj Powerhouse Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Shaheen Computer Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Christian Computer World',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Paps Parts Supply',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      name: 'Reyminator Computer Paradise',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      status: faker.helpers.arrayElement(supplierStatuses),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
  ];

  await db.insert(supplier).values(supplierRecords);

  log.info('Supplier records seeded successfully');
}

async function seedServiceType(db: PostgresJsDatabase<SchemaType>) {
  const typesRecords = [
    {
      name: 'Repair',
      description:
        'A service for diagnosing and repairing customer-owned equipment or items.',
      duration: '3-5 days',
      is_active: true,
      customizable_fee: 1500,
    },
    {
      name: 'Cleaning',
      description:
        'A service for cleaning internal or external parts of devices, tools, or machinery.',
      duration: '1 day',
      is_active: true,
      customizable_fee: 500,
    },
    {
      name: 'Replacement',
      description:
        'A service for replacing defective or outdated components with new items.',
      duration: '2-3 days',
      is_active: true,
      customizable_fee: 1000,
    },
    {
      name: 'Build',
      description:
        'A custom assembly service where new systems or machines are built from parts.',
      duration: '5-7 days',
      is_active: true,
      customizable_fee: 2500,
    },
    {
      name: 'Upgrade',
      description:
        'Enhancement service for upgrading system specs or components.',
      duration: '1-3 days',
      is_active: true,
      customizable_fee: 1200,
    },
    {
      name: 'Rent',
      description:
        'A temporary service allowing customers to borrow company-owned items.',
      duration: '7 days',
      is_active: true,
      customizable_fee: 0,
    },
    {
      name: 'Reserve',
      description:
        'Reservation service for booking specific items or slots for future use.',
      duration: '1 day',
      is_active: true,
      customizable_fee: 0,
    },
  ];
  await db.insert(service_Type).values(typesRecords);
}

async function main() {
  try {
    await createBucketByName(process.env.PROFILE_BUCKET!);
    await createBucketByName(process.env.DR_BUCKET!);

    // Employee Data
    await seedDepartments(db);
    await seedDesignations(db);
    await seedEmployeePosition(db);
    await seedEmployeesRole(db);
    await seedEmployees(db);
    await seedEmployeesAccount(db);
    await seedPersonalInformation(db);

    // Inventory
    await seedCategory(db);
    await seedSupplier(db);

    await seedTicketType(db);
    await seedServiceType(db);
    // Participants
    await seedCustomer(db);
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
