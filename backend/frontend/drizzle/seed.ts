/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from '@faker-js/faker';

import log from '../lib/logger';
import { db, pool } from './pool';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SupabaseService } from '../supabase/supabase.service';
import * as fs from 'fs';
import * as path from 'path';
import mime from 'mime';
import { SchemaType } from './schema/type';

import { customer, customerGroup, inquiry } from './schema/customer';
import {
  position,
  employee,
  roles,
  department,
  designation,
  employeeRoles,
  personalInformation,
} from './schema/ems';
import {
  supplier,
  category,
  product,
  productRecord,
  productDetails,
  order,
  orderProduct,
  discount,
  discountProducts,
  discountCustomer,
  serializeProduct,
} from './schema/ims';
import {
  assignedEmployees,
  tickets,
  ticketType,
  service,
  serviceItems,
  reports,
  service_Type,
} from './schema/services';
import { payment, receipt } from './schema/payment';
import { sales, salesItems } from './schema/sales';
import { couponredemptions } from './schema/ims/schema/discount/couponredeem';

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
      email: 'ajrizaldo2@example.com',
    },
    {
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Jane',
      middlename: 'Ann',
      lastname: 'Smith',
      email: 'jane.smith1@example.com',
    },
    {
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Jacob',
      middlename: 'Ann',
      lastname: 'Thompson',
      email: 'Jacob.Thompson1@example.com',
    },
    {
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Olivia ',
      middlename: 'Ann',
      lastname: 'Martinez',
      email: 'Olivia.Martinez1@example.com',
    },
    {
      position_id: faker.helpers.arrayElement(employeePositions).position_id,
      firstname: 'Ethan',
      middlename: 'Ann',
      lastname: 'Lewis',
      email: 'Ethan.Lewis1@example.com',
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

  const employeeStatuses: (
    | 'Active'
    | 'On Leave'
    | 'Terminated'
    | 'Resigned'
    | 'Suspended'
    | 'Retired'
    | 'Inactive'
  )[] = [
    'Active',
    'On Leave',
    'Terminated',
    'Resigned',
    'Suspended',
    'Retired',
    'Inactive',
  ] as const;
  const employeeTypes: (
    | 'Regular'
    | 'Probationary'
    | 'Seasonal'
    | 'Contractual'
    | 'Temporary'
  )[] = [
    'Regular',
    'Probationary',
    'Seasonal',
    'Contractual',
    'Temporary',
  ] as const;

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
  const customergroupIDs = await db.select().from(customerGroup);
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
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,
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
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,
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
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,
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
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,
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
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,
      created_at: new Date(),
      last_updated: new Date(),
    },
  ];

  // Insert customer records into the database
  await db.insert(customer).values(customerRecords);
  log.info('Customer records seeded successfully');
}

async function seedCustomerGroup(db: PostgresJsDatabase<SchemaType>) {
  const customersgroup = [
    {
      name: faker.company.name(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      name: faker.company.name(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      name: faker.company.name(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      name: faker.company.name(),
      created_at: new Date(),
      last_updated: new Date(),
    },
    {
      name: faker.company.name(),
      created_at: new Date(),
      last_updated: new Date(),
    },
  ];
  await db.insert(customerGroup).values(customersgroup);
  log.info('Customer Group records seeded successfully.');
}

async function seedInquiry(db: PostgresJsDatabase<SchemaType>) {
  const customerIDs = await db.select().from(customer);

  const inquiryTypes: (
    | 'Product'
    | 'Pricing'
    | 'Order Status'
    | 'Technical Support'
    | 'Billing'
    | 'Complaint'
    | 'Feedback'
    | 'Return/Refund'
  )[] = [
    'Product',
    'Pricing',
    'Order Status',
    'Technical Support',
    'Billing',
    'Complaint',
    'Feedback',
    'Return/Refund',
  ];

  const inquirys = [
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      inquiryTitle: 'Software Engineer',
      inquiry_type: faker.helpers.arrayElement(inquiryTypes),
    },
  ];

  await db.insert(inquiry).values(inquirys);
  log.info('Inquiry records seeded successfully.');
}

//  =======================================================================================
// ===================================== SALES ======================================

async function seedPayment(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);
  const salesIDs = await db.select().from(sales);
  const discountIDs = await db.select().from(discount);

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

  const paymentType: Array<'Borrow' | 'Reservation' | 'Sales' | 'Joborder'> = [
    'Borrow',
    'Reservation',
    'Sales',
    'Joborder',
  ];

  const paymentRecords = [
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 50,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 75,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-02-20T11:00:00Z'),
      last_updated: new Date('2024-02-20T11:00:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 100,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-03-05T12:00:00Z'),
      last_updated: new Date('2024-03-05T12:00:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 20,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-04-10T09:45:00Z'),
      last_updated: new Date('2024-04-10T09:45:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 150,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 150,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 150,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 150,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 150,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 150,
      payment_date: faker.date.past().toISOString(),
      payment_method: faker.helpers.arrayElement(paymentMethods),
      payment_status: faker.helpers.arrayElement(paymentStatuses),
      created_at: new Date('2024-05-15T14:30:00Z'),
      last_updated: new Date('2024-05-15T14:30:00Z'),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      service_type: faker.helpers.arrayElement(paymentType),
      vat_rate: 12,
      amount: 150,
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

async function seedSales(db: PostgresJsDatabase<SchemaType>) {
  const customerIDs = await db.select().from(customer);

  const salesStatuses = [
    'Completed',
    'Partially Completed',
    'Cancelled',
  ] as const;

  const salesRecords = [
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      status: faker.helpers.arrayElement(salesStatuses),
    },
  ];

  await db.insert(sales).values(salesRecords);
  log.info('Sales records seeded successfully');
}

async function seedSalesItem(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const salesIDs = await db.select().from(sales);

  const salesitemsRecords = [
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      total_price: 150,
    },
  ];

  await db.insert(salesItems).values(salesitemsRecords);
  log.info('Sales Items records seeded successfully');
}

async function seedReceipt(db: PostgresJsDatabase<SchemaType>) {
  const paymentIDs = await db.select().from(payment);

  const receiptRecords = [
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 50,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 100,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 20.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      payment_id: faker.helpers.arrayElement(paymentIDs).payment_id,
      issued_date: faker.date.past().toISOString(),
      total_amount: 150,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(receipt).values(receiptRecords);
  log.info('Receipt records seeded successfully');
}
//  =======================================================================================
// ==================================== SERVICES ======================================

async function seedAssignedEmployees(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);
  const employees = await db.select().from(employee);

  const assignedEmployeesRecords = [
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'John Doe',
      is_leader: true,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Jane Smith',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Alice Johnson',
      is_leader: true,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Michael Brown',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Emily Davis',
      is_leader: true,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Rey Larombe',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Aj Tollo',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Catto Akii',
      is_leader: true,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Shaheen Adlawin',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Rhyss Jimenez',
      is_leader: true,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(assignedEmployees).values(assignedEmployeesRecords);
  log.info('Assigned Employees seeded successfully');
}

async function seedTickets(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);
  const tickettypeIDs = await db.select().from(ticketType);

  const tickets_status: ('Resolved' | 'Removed' | 'Pending')[] = [
    'Resolved',
    'Pending',
    'Removed',
  ];

  const ticketsRecords = [
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Quality Issue on Job #123',
      content: faker.lorem.paragraph(),
      description: 'There was a quality issue with the materials used.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Delayed Delivery for Job #456',
      content: faker.lorem.paragraph(),
      description: 'The delivery is delayed due to supplier issues.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Customer Complaint on Job #789',
      content: faker.lorem.paragraph(),
      description: 'The customer reported issues with the service provided.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Job Completed for Job #321',
      content: faker.lorem.paragraph(),
      description: 'The job was completed successfully and closed.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Urgent Issue with Job #654',
      content: faker.lorem.paragraph(),
      description: 'An urgent issue has arisen that needs immediate attention.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Follow-Up Needed for Job #888',
      content: faker.lorem.paragraph(),
      description:
        'A follow-up is required for additional details on Job #888.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Payment Dispute for Job #234',
      content: faker.lorem.paragraph(),
      description:
        'There is a dispute regarding the payment for Job #234 that needs resolution.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Quality Feedback for Job #567',
      content: faker.lorem.paragraph(),
      description: 'Feedback from the quality assurance team on Job #567.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Client Request for Job #876',
      content: faker.lorem.paragraph(),
      description: 'The client has made a special request regarding Job #876.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Follow-Up on Warranty for Job #345',
      content: faker.lorem.paragraph(),
      description:
        'A follow-up is required regarding the warranty for Job #345.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      ticket_type_id: faker.helpers.arrayElement(tickettypeIDs).ticket_type_id,
      title: 'Issue with Job #135',
      content: faker.lorem.paragraph(),
      description:
        'There is a technical issue with Job #135 that requires urgent attention.',
      ticket_status: faker.helpers.arrayElement(tickets_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(tickets).values(ticketsRecords);
  log.info('Tickets seeded successfully');
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

async function seedService(db: PostgresJsDatabase<SchemaType>) {
  const servicetypeIDs = await db.select().from(service_Type);
  const customerIDs = await db.select().from(customer);

  const service_status: ('Pending' | 'In Progress' | 'Complete')[] = [
    'Pending',
    'In Progress',
    'Complete',
  ];

  const serviceRecords = [
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_type_id:
        faker.helpers.arrayElement(servicetypeIDs).service_type_id,
      uuid: faker.string.uuid(),
      description: faker.lorem.paragraph(),
      fee: faker.number.int({ min: 100, max: 1000 }),
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      service_status: faker.helpers.arrayElement(service_status),
      total_cost_price: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(service).values(serviceRecords);

  log.info('Service records seeded successfully');
}

async function seedServiceItems(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const serviceIDs = await db.select().from(service);
  const productrecordIDs = await db.select().from(productRecord);
  const serializeditemIDs = await db.select().from(serializeProduct);

  const serviceitemRecords = [
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      product_record_id:
        faker.helpers.arrayElement(productrecordIDs).product_record_id,
      serial_id: faker.helpers.arrayElement(serializeditemIDs).serial_id,
      serviceitem_status: faker.lorem.word(),
      quantity: faker.number.int({ min: 100, max: 1000 }),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(serviceItems).values(serviceitemRecords);

  log.info('Service Items records seeded successfully');
}

async function seedServiceType(db: PostgresJsDatabase<SchemaType>) {
  const servicetypeRecords = [
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(service_Type).values(servicetypeRecords);

  log.info('Service Type records seeded successfully');
}

//  =======================================================================================
// =================================== JOB ORDER ==========================================

async function seedReports(db: PostgresJsDatabase<SchemaType>) {
  const serviceIDs = await db.select().from(service);

  const reportsRecords = [
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Initial Review of Job Order #1',
      tickets: 'All documents are in order, ready for processing.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Progress Update for Job Order #2',
      tickets:
        'Work is currently in progress, slight delays due to material shortage.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Completion Report for Job Order #3',
      tickets:
        'The job order has been completed successfully, awaiting customer feedback.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Issues Reported for Job Order #4',
      tickets: 'Customer reported a discrepancy in billing; review initiated.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Final Assessment for Job Order #5',
      tickets: 'All requirements have been met; closing report prepared.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Follow-Up for Job Order #6',
      tickets:
        "Scheduled follow-up on the customer's feedback; no issues reported.",
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Alert for Job Order #7',
      tickets:
        'Critical delays in the supply chain; immediate action required.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Evaluation Report for Job Order #8',
      tickets:
        'Evaluation completed; improvements suggested for future orders.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Customer Satisfaction for Job Order #9',
      tickets: 'Customer feedback is positive; satisfaction survey completed.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      service_id: faker.helpers.arrayElement(serviceIDs).service_id,
      reports_title: 'Closure Notice for Job Order #10',
      tickets:
        'Job order has been officially closed; all documentation submitted.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(reports).values(reportsRecords);

  log.info('Report records seeded successfully.');
}

//  =======================================================================================
// =================================== INVENTORY ==========================================

async function seedProductRecord(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const recordCondition = ['New', 'Secondhand', 'Broken'] as const;
  const status = [
    'Available',
    'Sold',
    'On Order',
    'In Service',
    'Sold out',
  ] as const;
  const productrecordRecords = [
    {
      product_id: 1,
      supplier_id: 1,
      quantity: Number(faker.number.int({ min: 10, max: 100 })),
      price: Number(faker.number.int({ min: 100, max: 1000 })),
      condition: faker.helpers.arrayElement(recordCondition),
      status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: 2,
      supplier_id: 1,
      quantity: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.int({ min: 100, max: 1000 }),
      condition: faker.helpers.arrayElement(recordCondition),
      status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: 3,
      supplier_id: 1,
      quantity: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.int({ min: 100, max: 1000 }),
      condition: faker.helpers.arrayElement(recordCondition),
      status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: 4,
      supplier_id: 1,
      quantity: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.int({ min: 100, max: 1000 }),
      condition: faker.helpers.arrayElement(recordCondition),
      status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: 5,
      supplier_id: 1,
      quantity: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.int({ min: 100, max: 1000 }),
      condition: faker.helpers.arrayElement(recordCondition),
      status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: 6,
      supplier_id: 1,
      quantity: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.int({ min: 100, max: 1000 }),
      condition: faker.helpers.arrayElement(recordCondition),
      status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: 7,
      supplier_id: 1,
      quantity: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.int({ min: 100, max: 1000 }),
      condition: faker.helpers.arrayElement(recordCondition),
      status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: 8,
      supplier_id: 1,
      quantity: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.int({ min: 100, max: 1000 }),
      condition: faker.helpers.arrayElement(recordCondition),
      status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];
  await db.insert(productRecord).values(productrecordRecords);
  log.info('Product Records seeded successfully!');
}
async function seedProduct(db: PostgresJsDatabase<SchemaType>) {
  const supplierIDs = await db.select().from(supplier);

  const statuses = ['Unavailable'] as const;

  const productsRecords = [
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Lenovo ThinkPad X1 Carbon',
      is_serialize: false,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-10'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Razer Blackshark V3 Pro',
      is_serialize: false,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-02-15'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Dell XPS 15',
      is_serialize: false,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Sony WH-1000XM5',
      is_serialize: false,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Logitech MX Master 3S',
      is_serialize: false,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'WD Black NVMe SSD 1TB',
      is_serialize: false,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Corsair Vengeance RGB Pro 32GB RAM',
      is_serialize: false,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Asus ROG Strix RTX 4080 GPU',
      is_serialize: false,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Samsung SSD 970 EVO Plus 1TB',
      is_serialize: true,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Seagate IronWolf 4TB NAS HDD',
      is_serialize: true,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-03-01'),
      last_updated: new Date('2023-03-20'),
    },
  ];

  await db.insert(product).values(productsRecords);
  log.info('Product records seeded successfully');
}

async function seedProductDetails(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);

  const productdetailsRecords = [
    {
      product_id: 1,
      description:
        'Flagship smartphone with A16 Bionic chip and ProMotion display.',
      warranty_date: new Date('2026-10-01'),
      size: '6.1 inches',
      color: 'Space Black',
    },
    {
      product_id: 2,
      description:
        'High-end Android phone with 200MP camera and Snapdragon 8 Gen 2.',
      warranty_date: new Date('2026-09-15'),
      size: '6.8 inches',
      color: 'Phantom Black',
    },
    {
      product_id: 3,
      description: 'Premium laptop with Intel Core i9 and 4K OLED display.',
      warranty_date: new Date('2027-01-10'),
      size: '15.6 inches',
      color: 'Silver',
    },
    {
      product_id: 4,
      description:
        'Wireless noise-canceling headphones with industry-leading ANC.',
      warranty_date: new Date('2025-12-30'),
      size: 'Over-Ear',
      color: 'Black',
    },
    {
      product_id: 5,
      description: 'Advanced ergonomic wireless mouse with precise tracking.',
      warranty_date: new Date('2025-06-20'),
      size: 'Standard',
      color: 'Graphite',
    },
    {
      product_id: 6,
      description: 'High-speed SSD for gaming and content creation.',
      warranty_date: new Date('2028-03-05'),
      size: '1TB',
      color: 'Black',
    },
    {
      product_id: 7,
      description: 'DDR4 memory with dynamic RGB lighting for gaming rigs.',
      warranty_date: new Date('2027-08-15'),
      size: '32GB',
      color: 'RGB',
    },
    {
      product_id: 8,
      description: 'High-end graphics card for 4K gaming and AI rendering.',
      warranty_date: new Date('2027-02-28'),
      size: 'Triple Slot',
      color: 'Black',
    },
    {
      product_id: 9,
      description:
        'High-efficiency printer with cost-effective ink tank system.',
      warranty_date: new Date('2026-05-10'),
      size: 'Standard',
      color: 'White',
    },
    {
      product_id: 10,
      description: 'Durable and high-capacity hard drive for NAS systems.',
      warranty_date: new Date('2028-09-30'),
      size: '4TB',
      color: 'Red',
    },
  ];
  await db.insert(productDetails).values(productdetailsRecords);
  log.info('Product details seeded successfully!');
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

  const supplierRecords = [
    {
      company_name: 'ABC Computer Supplies',
      contact_number: '123-456-7890',
      remarks: 'Reliable supplier for all computer components.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-03-01'),
    },
    {
      company_name: 'XYZ Electronics',
      contact_number: '987-654-3210',
      remarks: 'Specializes in high-performance gaming hardware.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-03-15'),
    },
    {
      company_name: 'Tech Wholesalers Inc.',
      contact_number: '555-123-4567',
      remarks: 'Offers bulk discounts on all products.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-01-15'),
      last_updated: new Date('2023-03-10'),
    },
    {
      company_name: 'Gadget Hub',
      contact_number: '555-987-6543',
      remarks: 'New supplier focused on innovative tech solutions.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-02-10'),
      last_updated: new Date('2023-03-20'),
    },
    {
      company_name: 'CompTech Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Raqui Technology Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Aj Powerhouse Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Shaheen Computer Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Christian Computer World',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Paps Parts Supply',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Reyminator Computer Paradise',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      name: faker.company.name(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
  ];

  await db.insert(supplier).values(supplierRecords);

  log.info('Supplier records seeded successfully');
}

async function seedOrder(db: PostgresJsDatabase<SchemaType>) {
  const supplierIDs = await db.select().from(supplier);

  const orderStatus = [
    'Draft',
    'Finalized',
    'Awaiting Arrival',
    'Partially Fulfiled',
    'Fulfilled',
    'Cancelled',
  ] as const;
  const paymentStatus = ['Pending', 'Partially Paid', 'Paid'] as const;
  const paymentMethod = [
    'Cash',
    'Credit Card',
    'Bank Transfer',
    'Check',
    'Digital Wallet',
  ] as const;
  const orderRecords = [
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-02-15'),
      order_value: '50000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'Urgent order for motherboard components.',
      receive_at: new Date('2024-02-16'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-02-20'),
      order_value: '90000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'Bulk purchase of SSDs.',
      receive_at: new Date('2024-02-21'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-03-05'),
      order_value: '250000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'Order for gaming keyboards and mice.',
      receive_at: new Date('2024-03-06'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-02-18'),
      order_value: '70000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'Replacement parts for damaged inventory.',
      receive_at: new Date('2024-02-19'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-02-25'),
      order_value: '180000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'Order for networking cables and routers.',
      receive_at: new Date('2024-02-26'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-03-01'),
      order_value: '400000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'High-end GPUs for gaming PC builds.',
      receive_at: new Date('2024-03-02'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-02-22'),
      order_value: '125000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'Urgent CPU stock replenishment.',
      receive_at: new Date('2024-02-23'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-03-10'),
      order_value: '225000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'Bulk order for office workstation components.',
      receive_at: new Date('2024-03-11'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-02-28'),
      order_value: '140000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'Order for high-capacity external hard drives.',
      receive_at: new Date('2024-02-29'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      expected_arrival: new Date('2024-03-05'),
      order_value: '320000.0',
      order_status: faker.helpers.arrayElement(orderStatus),
      order_payment_status: faker.helpers.arrayElement(paymentStatus),
      order_payment_method: faker.helpers.arrayElement(paymentMethod),
      notes: 'Stocking up on premium power supplies.',
      receive_at: new Date('2024-03-06'),
    },
  ];

  await db.insert(order).values(orderRecords);
  log.info('Order records seeded successfully');
}

async function seedOrderItems(db: PostgresJsDatabase<SchemaType>) {
  const orderIDs = await db.select().from(order);

  const orderitemsRecords = [
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 2,
      total_quantity: 2,
      unit_price: '59999.99',
      discount_amount: '0.00',
      status: 'Awaiting Arrival' as const,
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 1,
      total_quantity: 1,
      unit_price: '12999.50',
      discount_amount: '500.00',
      status: 'Draft' as const,
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 3,
      total_quantity: 3,
      unit_price: '1499.75',
      discount_amount: '100.00',
      status: 'Delivered' as const,
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 5,
      total_quantity: 5,
      unit_price: '249.99',
      discount_amount: '50.00',
      status: 'Partially Delivered' as const,
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 1,
      total_quantity: 1,
      unit_price: '7999.99',
      discount_amount: '0.00',
      status: 'Cancelled' as const,
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 2,
      total_quantity: 2,
      unit_price: '999.99',
      discount_amount: '20.00',
      status: 'Stocked' as const,
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 4,
      total_quantity: 4,
      unit_price: '3499.00',
      discount_amount: '200.00',
      status: 'Finalized' as const,
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 1,
      total_quantity: 1,
      unit_price: '55999.99',
      discount_amount: '1000.00',
      status: 'Awaiting Arrival' as const,
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 3,
      total_quantity: 3,
      unit_price: '1199.50',
      discount_amount: '50.00',
      status: 'Delivered' as const,
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      product_id: faker.number.int({ min: 1, max: 10 }),
      quantity: 2,
      total_quantity: 2,
      unit_price: '2099.99',
      discount_amount: '100.00',
      status: 'Stocked' as const,
    },
  ];

  await db.insert(orderProduct).values(orderitemsRecords);
}

async function seedSerializedItems(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const recordCondition = ['New', 'Secondhand', 'Broken'] as const;

  const statuses = [
    'Available',
    'Returned',
    'Sold',
    'On Order',
    'In Service',
    'Damage',
    'Retired',
  ] as const;

  const serializedproductsRecords = [
    {
      product_id: 9,
      supplier_id: 1,
      serial_number: faker.string.uuid(),
      status: faker.helpers.arrayElement(statuses),
      condition: faker.helpers.arrayElement(recordCondition),
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-10'),
    },
    {
      product_id: 10,
      supplier_id: 1,
      serial_number: faker.string.uuid(),
      status: faker.helpers.arrayElement(statuses),
      condition: faker.helpers.arrayElement(recordCondition),
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-10'),
    },
  ];

  await db.insert(serializeProduct).values(serializedproductsRecords);
  log.info('Serialized Products records seeded successfully');
}
//  =======================================================================================
// =================================== PARTORDER ==========================================

async function seedCouponRedemptions(db: PostgresJsDatabase<SchemaType>) {
  const discountIDs = await db.select().from(discount);
  const customerIDs = await db.select().from(customer);

  const couponredemptionsRecords = [
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
  ];

  await db.insert(couponredemptions).values(couponredemptionsRecords);
  log.info('Coupon Redemptions records seeded successfully');
}

async function seedDiscountProducts(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const discountIDs = await db.select().from(discount);
  const cateagoryIDs = await db.select().from(category);

  const discountproductRecords = [
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      discount_id: faker.helpers.arrayElement(discountIDs).discount_id,
      category_id: faker.helpers.arrayElement(cateagoryIDs).category_id,
      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
  ];

  await db.insert(discountProducts).values(discountproductRecords);
  log.info('Discount Products records seeded successfully');
}

async function seedDiscountCustomer(db: PostgresJsDatabase<SchemaType>) {
  const customerIDs = await db.select().from(customer);
  const customergroupIDs = await db.select().from(customerGroup);

  const discountcustomerRecords = [
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      customer_group_id:
        faker.helpers.arrayElement(customergroupIDs).customer_group_id,

      created_at: new Date('2024-01-15T10:30:00Z'),
      last_updated: new Date('2024-01-15T10:30:00Z'),
    },
  ];

  await db.insert(discountCustomer).values(discountcustomerRecords);
  log.info('Discount Customer records seeded successfully');
}

async function seedDiscount(db: PostgresJsDatabase<SchemaType>) {
  const discountTypes: Array<
    | 'Percentage Discount'
    | 'Fixed Amount Discount'
    | 'BOGO (Buy x, Get y Free)'
    | 'Bulk Discount'
    | 'Seasonal Discount'
    | 'Clearance Sale'
    | 'Loyalty Discount'
    | 'First-Time Buyer Discount'
    | 'Referral Discount'
    | 'Referral Discount'
    | 'Employee Discount'
    | 'Cash Payment'
    | 'Coupon'
  > = [
    'Percentage Discount',
    'Fixed Amount Discount',
    'BOGO (Buy x, Get y Free)',
    'Bulk Discount',
    'Seasonal Discount',
    'Clearance Sale',
    'Loyalty Discount',
    'First-Time Buyer Discount',
    'Referral Discount',
    'Employee Discount',
    'Cash Payment',
    'Coupon',
  ];

  const discountRecords = [
    {
      discount_name: 'New Year Sale',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 20.0,
      coupon_code: 'NY2025',
      is_single_use: false,
      max_redemption: 500,
      start_date: new Date('2025-01-01T00:00:00Z'),
      end_date: new Date('2025-01-10T23:59:59Z'),
      is_active: true,
      min_purchase_amount: 1000.0,
      max_discount_amount: 500.0,
      usage_limit: 3,
      times_used: 120,
      created_at: new Date('2024-12-15T10:00:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
    {
      discount_name: 'Flash Sale',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 100.0,
      coupon_code: 'FLASH100',
      is_single_use: true,
      max_redemption: 100,
      start_date: new Date('2024-11-15T12:00:00Z'),
      end_date: new Date('2024-11-15T18:00:00Z'),
      is_active: false,
      min_purchase_amount: 500.0,
      max_discount_amount: 100.0,
      usage_limit: 1,
      times_used: 98,
      created_at: new Date('2024-11-10T14:30:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
    {
      discount_name: 'Black Friday Special',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 50.0,
      coupon_code: 'BF2024',
      is_single_use: false,
      max_redemption: 1000,
      start_date: new Date('2024-11-29T00:00:00Z'),
      end_date: new Date('2024-11-30T23:59:59Z'),
      is_active: true,
      min_purchase_amount: 2000.0,
      max_discount_amount: 1000.0,
      usage_limit: 2,
      times_used: 520,
      created_at: new Date('2024-10-01T08:00:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
    {
      discount_name: 'Student Discount',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 150.0,
      coupon_code: 'STUDENT150',
      is_single_use: false,
      max_redemption: 200,
      start_date: new Date('2024-09-01T00:00:00Z'),
      end_date: new Date('2025-08-31T23:59:59Z'),
      is_active: true,
      min_purchase_amount: 500.0,
      max_discount_amount: 150.0,
      usage_limit: 5,
      times_used: 85,
      created_at: new Date('2024-08-20T10:00:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
    {
      discount_name: 'Cyber Monday Deal',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 40.0,
      coupon_code: 'CYBER40',
      is_single_use: false,
      max_redemption: 700,
      start_date: new Date('2024-12-02T00:00:00Z'),
      end_date: new Date('2024-12-02T23:59:59Z'),
      is_active: true,
      min_purchase_amount: 1500.0,
      max_discount_amount: 700.0,
      usage_limit: 2,
      times_used: 310,
      created_at: new Date('2024-11-15T12:00:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
    {
      discount_name: 'Holiday Special',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 200.0,
      coupon_code: 'HOLIDAY200',
      is_single_use: false,
      max_redemption: 500,
      start_date: new Date('2024-12-20T00:00:00Z'),
      end_date: new Date('2024-12-31T23:59:59Z'),
      is_active: true,
      min_purchase_amount: 1000.0,
      max_discount_amount: 200.0,
      usage_limit: 3,
      times_used: 250,
      created_at: new Date('2024-11-25T08:00:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
    {
      discount_name: 'Referral Bonus',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 10.0,
      coupon_code: 'REFER10',
      is_single_use: true,
      max_redemption: 300,
      start_date: new Date('2024-07-01T00:00:00Z'),
      end_date: new Date('2025-07-01T23:59:59Z'),
      is_active: true,
      min_purchase_amount: 500.0,
      max_discount_amount: 300.0,
      usage_limit: 1,
      times_used: 75,
      created_at: new Date('2024-06-15T14:30:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
    {
      discount_name: 'Loyalty Reward',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 500.0,
      coupon_code: 'LOYAL500',
      is_single_use: false,
      max_redemption: 150,
      start_date: new Date('2024-06-01T00:00:00Z'),
      end_date: new Date('2025-06-01T23:59:59Z'),
      is_active: true,
      min_purchase_amount: 3000.0,
      max_discount_amount: 500.0,
      usage_limit: 1,
      times_used: 40,
      created_at: new Date('2024-05-15T10:00:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
    {
      discount_name: 'Birthday Discount',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 15.0,
      coupon_code: 'BIRTHDAY15',
      is_single_use: true,
      max_redemption: 500,
      start_date: new Date('2024-01-01T00:00:00Z'),
      end_date: new Date('2024-12-31T23:59:59Z'),
      is_active: true,
      min_purchase_amount: 1000.0,
      max_discount_amount: 500.0,
      usage_limit: 1,
      times_used: 150,
      created_at: new Date('2023-12-20T10:00:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
    {
      discount_name: 'Summer Sale',
      discount_type: faker.helpers.arrayElement(discountTypes),
      discount_value: 25.0,
      coupon_code: 'SUMMER25',
      is_single_use: false,
      max_redemption: 600,
      start_date: new Date('2024-06-15T00:00:00Z'),
      end_date: new Date('2024-07-15T23:59:59Z'),
      is_active: true,
      min_purchase_amount: 1200.0,
      max_discount_amount: 600.0,
      usage_limit: 3,
      times_used: 280,
      created_at: new Date('2024-05-30T12:00:00Z'),
      last_updated: new Date(),
      deleted_at: null,
    },
  ];

  await db.insert(discount).values(discountRecords);
  log.info('Discount records seeded successfully');
}

async function main() {
  try {
    await createProfileBucketIfNotExists();

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
    await seedProduct(db);
    await seedProductDetails(db);
    await seedProductRecord(db);
    await seedOrder(db);
    await seedOrderItems(db);
    await seedSerializedItems(db);

    // Participants
    await seedCustomerGroup(db);
    await seedCustomer(db);
    // await seedInquiry(db);

    // Sales and related data
    // await seedSales(db);
    // await seedSalesItem(db);
    // await seedBorrow(db);
    // await seedBorrowItem(db);
    // await seedReserve(db);
    // await seedReserveItem(db);
    // await seedDiscount(db);
    // await seedDiscountCustomer(db);
    // await seedDiscountProducts(db);
    // await seedCouponRedemptions(db);

    // Job Order and related data
    // await seedJobOrderTypes(db);
    // await seedJobOrder(db);
    // await seedJobOrderItems(db);
    // await seedPayment(db);
    // await seedReceipt(db);

    // Pass employee IDs to seedRemarkTickets
    // await seedRemarkType(db);
    // await seedRemarkTickets(db);
    // await seedReports(db);
    // await seedAssignedEmployees(db);

    // logs
    // await seedOrderTransactionLogs(db);
    // await seedProductTransactionLogs(db);
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
