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
  borrow,
  borrowItems,
  jobOrder,
  jobOrderItem,
  remarkTickets,
  remarkType,
  reports,
  reserve,
  reserveItems,
} from './schema/services';
import { jobOrderType } from './schema/services/schema/joborder/jobOrderType.schema';
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
  const joborderIDs = await db.select().from(jobOrder);
  const borrowIDs = await db.select().from(borrow);
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
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

  const salesStatuses: (
    | 'Completed'
    | 'Partially Completed'
    | 'Cancelled'
    | 'Pending'
  )[] = ['Completed', 'Partially Completed', 'Cancelled', 'Pending'];

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

  const salesitemStatuses: ('Job Order' | 'Borrow' | 'Sales' | 'Purchase')[] = [
    'Job Order',
    'Borrow',
    'Sales',
    'Purchase',
  ];

  const salesitemsRecords = [
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
      total_price: 150,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      sales_id: faker.helpers.arrayElement(salesIDs).sales_id,
      quantity: 10,
      salesItem_type: faker.helpers.arrayElement(salesitemStatuses),
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

//Done
async function seedReserve(db: PostgresJsDatabase<SchemaType>) {
  const customerIDs = await db.select().from(customer);

  const status = [
    'Reserved',
    'Confirmed', // This status was missing in your original list
    'Cancelled',
    'Pending',
    'Completed',
  ] as const;

  const reserveRecords = [
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      reserve_status: faker.helpers.arrayElement(status),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(reserve).values(reserveRecords);
  log.info('Reserve records seeded successfully');
}

async function seedReserveItem(db: PostgresJsDatabase<SchemaType>) {
  const reserveIDs = await db.select().from(reserve);
  const productIDs = await db.select().from(product);

  const status = [
    'Reserved',
    'Confirmed',
    'Cancelled',
    'Pending',
    'Completed',
  ] as const;

  const reserveitemRecords = [
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      reserve_id: faker.helpers.arrayElement(reserveIDs).reserve_id,
      status: faker.helpers.arrayElement(status),
      created_at: new Date('2025-02-01T08:30:00.000Z'),
      last_updated: new Date('2025-02-01T08:30:00.000Z'),
      deleted_at: null,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      reserve_id: faker.helpers.arrayElement(reserveIDs).reserve_id,
      status: faker.helpers.arrayElement(status),
      created_at: new Date('2025-02-05T10:00:00.000Z'),
      last_updated: new Date('2025-02-06T14:45:00.000Z'),
      deleted_at: null,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      reserve_id: faker.helpers.arrayElement(reserveIDs).reserve_id,
      status: faker.helpers.arrayElement(status),
      created_at: new Date('2025-01-25T15:20:00.000Z'),
      last_updated: new Date('2025-01-29T12:00:00.000Z'),
      deleted_at: new Date('2025-01-30T08:00:00.000Z'),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      reserve_id: faker.helpers.arrayElement(reserveIDs).reserve_id,
      status: faker.helpers.arrayElement(status),
      created_at: new Date('2025-02-10T11:10:00.000Z'),
      last_updated: new Date('2025-02-10T11:10:00.000Z'),
      deleted_at: null,
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      reserve_id: faker.helpers.arrayElement(reserveIDs).reserve_id,
      status: faker.helpers.arrayElement(status),
      created_at: new Date('2025-02-07T09:45:00.000Z'),
      last_updated: new Date('2025-02-07T10:15:00.000Z'),
      deleted_at: null,
    },
  ];

  await db.insert(reserveItems).values(reserveitemRecords);
  log.info('Reserve Item records seeded successfully');
}

async function seedBorrow(db: PostgresJsDatabase<SchemaType>) {
  const customerIDs = await db.select().from(customer);

  const statuses = [
    'Borrowed',
    'Confirmed',
    'Cancelled',
    'Pending',
    'Completed',
  ] as const;

  const borrowRecords = [
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 20,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 15,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 30,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 5,
      status: faker.helpers.arrayElement(statuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(borrow).values(borrowRecords);
  log.info('Borrow records seeded successfully');
}

async function seedBorrowItem(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const borrowIDs = await db.select().from(borrow);

  const borrowitemstatuses = [
    'Requested',
    'Approved',
    'Borrowed',
    'Returned',
    'Overdue',
    'Rejected',
    'Cancelled',
    'Lost',
    'Damaged',
  ] as const;

  const borrowitemRecords = [
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      cproduct_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      borrow_id: faker.helpers.arrayElement(borrowIDs).borrow_id,
      borrow_date: faker.date.past().toISOString(),
      return_date: faker.date.future().toISOString(),
      fee: 10,
      status: faker.helpers.arrayElement(borrowitemstatuses),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(borrowItems).values(borrowitemRecords);
  log.info('Borrow Items records seeded successfully');
}

async function seedAssignedEmployees(db: PostgresJsDatabase<SchemaType>) {
  const jobOrdersIDs = await db.select().from(jobOrder);
  const employees = await db.select().from(employee);

  if (jobOrdersIDs.length === 0 || employees.length === 0) {
    log.error(
      'No job orders or employees found. Cannot seed assigned employees.',
    );
    return;
  }

  const assignedEmployeesRecords = [
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'John Doe',
      is_leader: true,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Jane Smith',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Alice Johnson',
      is_leader: true,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Michael Brown',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Emily Davis',
      is_leader: true,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Rey Larombe',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Aj Tollo',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Catto Akii',
      is_leader: true,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      employee_id: faker.helpers.arrayElement(employees).employee_id,
      assigned_by: 'Shaheen Adlawin',
      is_leader: false,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
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

async function seedRemarkTickets(db: PostgresJsDatabase<SchemaType>) {
  const jobOrdersIDs = await db.select().from(jobOrder);
  const remarktypeIDs = await db.select().from(remarkType);

  const remark_status: ('Resolved' | 'Removed' | 'Pending')[] = [
    'Resolved',
    'Pending',
    'Removed',
  ];

  const remarkticketsRecords = [
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Quality Issue on Job #123',
      content: faker.lorem.paragraph(),
      description: 'There was a quality issue with the materials used.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Delayed Delivery for Job #456',
      content: faker.lorem.paragraph(),
      description: 'The delivery is delayed due to supplier issues.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Customer Complaint on Job #789',
      content: faker.lorem.paragraph(),
      description: 'The customer reported issues with the service provided.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Job Completed for Job #321',
      content: faker.lorem.paragraph(),
      description: 'The job was completed successfully and closed.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Urgent Issue with Job #654',
      content: faker.lorem.paragraph(),
      description: 'An urgent issue has arisen that needs immediate attention.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Follow-Up Needed for Job #888',
      content: faker.lorem.paragraph(),
      description:
        'A follow-up is required for additional details on Job #888.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Payment Dispute for Job #234',
      content: faker.lorem.paragraph(),
      description:
        'There is a dispute regarding the payment for Job #234 that needs resolution.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Quality Feedback for Job #567',
      content: faker.lorem.paragraph(),
      description: 'Feedback from the quality assurance team on Job #567.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Client Request for Job #876',
      content: faker.lorem.paragraph(),
      description: 'The client has made a special request regarding Job #876.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Follow-Up on Warranty for Job #345',
      content: faker.lorem.paragraph(),
      description:
        'A follow-up is required regarding the warranty for Job #345.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      job_order_id: faker.helpers.arrayElement(jobOrdersIDs).job_order_id,
      remark_type_id: faker.helpers.arrayElement(remarktypeIDs).remark_type_id,
      title: 'Issue with Job #135',
      content: faker.lorem.paragraph(),
      description:
        'There is a technical issue with Job #135 that requires urgent attention.',
      remarktickets_status: faker.helpers.arrayElement(remark_status),
      deadline: faker.date.future().toISOString(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(remarkTickets).values(remarkticketsRecords);
  log.info('Remark Tickets seeded successfully');
}

async function seedRemarkType(db: PostgresJsDatabase<SchemaType>) {
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

  await db.insert(remarkType).values(remarktypeRecords);
  log.info('Remark types seeded successfully.');
}

//  =======================================================================================
// =================================== JOB ORDER ==========================================

async function seedJobOrder(db: PostgresJsDatabase<SchemaType>) {
  const jobordertypeIDs = await db.select().from(jobOrderType);
  const customerIDs = await db.select().from(customer);

  const statuses: ('Pending' | 'In Progress' | 'Completed')[] = [
    'Pending',
    'In Progress',
    'Completed',
  ];

  const joborderRecords = [
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: 'e6e1c3b1-4eab-4bc9-899c-7300a702f7f3',
      description: faker.lorem.paragraph(),
      fee: 75,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 150.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: '7b63e580-3e6f-45eb-b5f2-d1e8602392f9',
      description: faker.lorem.paragraph(),
      fee: 50,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 100.5,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: '99342869-3f69-4047-b477-d54c780a0c04',
      description: faker.lorem.paragraph(),
      fee: 100,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 200.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: 'd18e55cb-5c97-4c4e-81a0-5c8965b0982c',
      description: faker.lorem.paragraph(),
      fee: 20,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 40.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: 'c0fca47c-04fa-4eec-ae90-514b7d84d6f0',
      description: faker.lorem.paragraph(),
      fee: 30,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 60.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: '7a52c4a8-b6c0-4d12-a50e-2e3acde32bfa',
      description: faker.lorem.paragraph(),
      fee: 150,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 300.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: '14bbaeb7-e46e-4049-a321-1f8a71eae2c7',
      description: faker.lorem.paragraph(),
      fee: 200,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 400.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: '44e54e8d-9338-4de9-9e4b-0b6cf4467ca1',
      description: faker.lorem.paragraph(),
      fee: 90,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 180.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: '5d793337-7d4b-4e38-9fb4-6cb7aa205eeb',
      description: faker.lorem.paragraph(),
      fee: 80,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 160.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      joborder_type_id:
        faker.helpers.arrayElement(jobordertypeIDs).joborder_type_id,
      customer_id: faker.helpers.arrayElement(customerIDs).customer_id,
      uuid: 'efbfa15b-9283-490f-8181-488b488a8fef',
      description: faker.lorem.paragraph(),
      fee: 120,
      joborder_status: faker.helpers.arrayElement(statuses),
      total_cost_price: 240.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];
  await db.insert(jobOrder).values(joborderRecords);

  log.info('Job Order records seeded successfully.');
}

async function seedReports(db: PostgresJsDatabase<SchemaType>) {
  const joborderIDs = await db.select().from(jobOrder);

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

  await db.insert(reports).values(reportsRecords);

  log.info('Report records seeded successfully.');
}

async function seedJobOrderTypes(db: PostgresJsDatabase<SchemaType>) {
  const jobordertypesRecords = [
    {
      name: 'Routine Maintenance',
      description: 'Scheduled maintenance to ensure optimal performance.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Emergency Repair',
      description: 'Urgent repair services for immediate issues.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Installation Service',
      description: 'Professional installation services for new equipment.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Consultation',
      description: 'Expert consultation services for project planning.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Product Warranty Service',
      description: 'Service offered under product warranty agreements.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Upgrades and Modifications',
      description: 'Enhancements to existing systems and processes.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Routine Inspection',
      description: 'Regular inspection services to ensure compliance.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Special Request Service',
      description: 'Custom services based on specific client requests.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Training Service',
      description: 'Training and support services for staff.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: 'Follow-Up Service',
      description: 'Post-service follow-up to ensure satisfaction.',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(jobOrderType).values(jobordertypesRecords);
  log.info('Job Order Types seeded successfully.');
}

async function seedJobOrderItems(db: PostgresJsDatabase<SchemaType>) {
  const joborderIDs = await db.select().from(jobOrder);
  const productIDs = await db.select().from(product);

  const joborderitemsRecords = [
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Pending',
      quantity: 5.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Processing',
      quantity: 2.5,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Completed',
      quantity: 10.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Pending',
      quantity: 7.75,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Processing',
      quantity: 3.25,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Completed',
      quantity: 1.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Pending',
      quantity: 4.5,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Processing',
      quantity: 8.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Completed',
      quantity: 6.25,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      product_id: faker.helpers.arrayElement(productIDs).product_id,
      job_order_id: faker.helpers.arrayElement(joborderIDs).job_order_id,
      status: 'Pending',
      quantity: 2.0,
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(jobOrderItem).values(joborderitemsRecords);
  log.info('Job Order Items seeded successfully.');
}
//  =======================================================================================
// =================================== INVENTORY ==========================================

async function seedProductRecord(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const recordCondition = ['New', 'Secondhand', 'Broken'] as const;
  const status = [
    'Sold',
    'Pending Payment',
    'On Order',
    'In Service',
    'Awaiting Service',
    'Return Requested',
  ] as const;
  const productrecordRecords = [
    {
      product_id: 1,
      supplier_id: 1,
      quantity: faker.number.int({ min: 10, max: 100 }),
      price: faker.number.int({ min: 100, max: 1000 }),
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

  const statuses = ['Unavailable', 'Available'] as const;

  const productsRecords = [
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Apple iPhone 14 Pro',
      is_serialize: false,
      status: faker.helpers.arrayElement(statuses),
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-01-10'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      name: 'Samsung Galaxy S23 Ultra',
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
      name: 'Epson L3210 Ink Tank Printer',
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
      name: faker.commerce.productName(),
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.commerce.productName(),
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.commerce.productName(),
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.commerce.productName(),
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.commerce.productName(),
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.commerce.productName(),
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.commerce.productName(),
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.commerce.productName(),
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.commerce.productName(),
      content: faker.lorem.sentence(),
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      name: faker.commerce.productName(),
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
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-01-01'),
      last_updated: new Date('2023-03-01'),
    },
    {
      company_name: 'XYZ Electronics',
      contact_number: '987-654-3210',
      remarks: 'Specializes in high-performance gaming hardware.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-02-01'),
      last_updated: new Date('2023-03-15'),
    },
    {
      company_name: 'Tech Wholesalers Inc.',
      contact_number: '555-123-4567',
      remarks: 'Offers bulk discounts on all products.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-01-15'),
      last_updated: new Date('2023-03-10'),
    },
    {
      company_name: 'Gadget Hub',
      contact_number: '555-987-6543',
      remarks: 'New supplier focused on innovative tech solutions.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-02-10'),
      last_updated: new Date('2023-03-20'),
    },
    {
      company_name: 'CompTech Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Raqui Technology Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Aj Powerhouse Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Shaheen Computer Solutions',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Christian Computer World',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Paps Parts Supply',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
      created_at: new Date('2023-01-05'),
      last_updated: new Date('2023-03-05'),
    },
    {
      company_name: 'Reyminator Computer Paradise',
      contact_number: '555-456-7890',
      remarks: 'Provides a wide range of computer parts and accessories.',
      relationship: faker.helpers.arrayElement(relationships),
      profile_link: faker.lorem.sentence(),
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
    'Waiting for Arrival',
    'Pending',
    'Delivered',
    'Returned',
    'Pending Payment',
    'Cancelled',
  ] as const;

  const orderRecords = [
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 50,
      message: 'Urgent order for motherboard components.',
      expected_arrival: '2024-02-15',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 150000,
      created_at: new Date('2024-02-01'),
      last_updated: new Date('2024-02-01'),
      deleted_at: null,
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 30,
      message: 'Bulk purchase of SSDs.',
      expected_arrival: '2024-02-20',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 90000,
      created_at: new Date('2024-02-03'),
      last_updated: new Date('2024-02-05'),
      deleted_at: null,
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 100,
      message: 'Order for gaming keyboards and mice.',
      expected_arrival: '2024-03-05',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 250000,
      created_at: new Date('2024-02-10'),
      last_updated: new Date('2024-02-15'),
      deleted_at: null,
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 20,
      message: 'Replacement parts for damaged inventory.',
      expected_arrival: '2024-02-18',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 70000,
      created_at: new Date('2024-02-07'),
      last_updated: new Date('2024-02-17'),
      deleted_at: null,
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 60,
      message: 'Order for networking cables and routers.',
      expected_arrival: '2024-02-25',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 180000,
      created_at: new Date('2024-02-05'),
      last_updated: new Date('2024-02-10'),
      deleted_at: new Date('2024-02-11'),
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 40,
      message: 'High-end GPUs for gaming PC builds.',
      expected_arrival: '2024-03-01',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 400000,
      created_at: new Date('2024-02-09'),
      last_updated: new Date('2024-02-09'),
      deleted_at: null,
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 25,
      message: 'Urgent CPU stock replenishment.',
      expected_arrival: '2024-02-22',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 125000,
      created_at: new Date('2024-02-12'),
      last_updated: new Date('2024-02-14'),
      deleted_at: null,
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 75,
      message: 'Bulk order for office workstation components.',
      expected_arrival: '2024-03-10',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 225000,
      created_at: new Date('2024-02-14'),
      last_updated: new Date('2024-02-18'),
      deleted_at: null,
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 35,
      message: 'Order for high-capacity external hard drives.',
      expected_arrival: '2024-02-28',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 140000,
      created_at: new Date('2024-02-15'),
      last_updated: new Date('2024-02-25'),
      deleted_at: null,
    },
    {
      supplier_id: faker.helpers.arrayElement(supplierIDs).supplier_id,
      ordered_value: 80,
      message: 'Stocking up on premium power supplies.',
      expected_arrival: '2024-03-05',
      status: faker.helpers.arrayElement(orderStatus),
      order_total: 320000,
      created_at: new Date('2024-02-20'),
      last_updated: new Date('2024-02-27'),
      deleted_at: new Date('2024-02-28'),
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
      quantity: 2,
      price: '59999.99',
      status: 'Shipped',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      quantity: 1,
      price: '12999.5',
      status: 'Processing',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      quantity: 3,
      price: '1499.75',
      status: 'Delivered',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      quantity: 5,
      price: '249.99',
      status: 'Cancelled',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      quantity: 1,
      price: '7999.99',
      status: 'Pending',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      quantity: 2,
      price: '999.99',
      status: 'Processing',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      quantity: 4,
      price: '3499.0',
      status: 'Delivered',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      quantity: 1,
      price: '55999.99',
      status: 'Shipped',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      quantity: 3,
      price: '1199.5',
      status: 'Pending',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
    {
      order_id: faker.helpers.arrayElement(orderIDs).order_id,
      quantity: 2,
      price: '2099.99',
      status: 'Delivered',
      created_at: faker.date.recent(),
      last_updated: faker.date.recent(),
    },
  ];

  await db.insert(orderProduct).values(orderitemsRecords);
  log.info('Order Items records seeded successfully');
}

async function seedSerializedItems(db: PostgresJsDatabase<SchemaType>) {
  const productIDs = await db.select().from(product);
  const recordCondition = ['New', 'Secondhand', 'Broken'] as const;

  const statuses = [
    'Sold',
    'Pending Payment',
    'On Order',
    'In Service',
    'Awaiting Service',
    'Return Requested',
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
    await seedInquiry(db);

    // Sales and related data
    await seedSales(db);
    await seedSalesItem(db);
    await seedBorrow(db);
    await seedBorrowItem(db);
    await seedReserve(db);
    await seedReserveItem(db);
    await seedDiscount(db);
    await seedDiscountCustomer(db);
    await seedDiscountProducts(db);
    await seedCouponRedemptions(db);

    // Job Order and related data
    await seedJobOrderTypes(db);
    await seedJobOrder(db);
    await seedJobOrderItems(db);
    await seedPayment(db);
    await seedReceipt(db);

    // Pass employee IDs to seedRemarkTickets
    await seedRemarkType(db);
    await seedRemarkTickets(db);
    await seedReports(db);
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
