import { z } from 'zod';

export const CreateEmployeeRoles = z.object({
  employee_position_id: z.string().min(1),
  employee_firstname: z.string().min(1, 'First name is required'),
  employee_middlename: z.string().optional(),
  employee_lastname: z.string().min(1, 'Last name is required'),
  employee_email: z.string().min(1),
  personal_information_birthday: z.string().min(1, 'Birthday is required'),
  personal_information_sex: z.string().min(1),
  personal_information_phone: z
    .string()
    .min(10, 'Phone number should be at least 10 digits'),
  personal_information_address_line: z
    .string()
    .min(1, 'Address line is required'),
  personal_information_postal_code: z
    .string()
    .min(5, 'Postal code should be at least 5 characters'),

  employment_information_department_id: z
    .string()
    .min(1, 'Department is required'),
  employment_information_designation_id: z
    .string()
    .min(1, 'Designation is required'),
  employment_information_employee_type: z.string().min(1),
  employment_information_employee_status: z.string().min(1),
  employee_role_role_id: z.string().min(1),
});

export const UpdateEmployeeRoles = z.object({
  employee_position_id: z.number().min(1),
  employee_firstname: z.string().min(1, 'First name is required'),
  employee_middlename: z.string().optional(),
  employee_lastname: z.string().min(1, 'Last name is required'),
  employee_email: z.string().min(1),
  personal_information_birthday: z.string().min(1, 'Birthday is required'),
  personal_information_sex: z.string().min(1),
  personal_information_phone: z
    .string()
    .min(10, 'Phone number should be at least 10 digits'),
  personal_information_address_line: z
    .string()
    .min(1, 'Address line is required'),
  personal_information_postal_code: z
    .string()
    .min(5, 'Postal code should be at least 5 characters'),

  employment_information_department_id: z
    .string()
    .min(1, 'Department is required'),
  employment_information_designation_id: z
    .string()
    .min(1, 'Designation is required'),
  employment_information_employee_type: z.string().min(1),
  employment_information_employee_status: z.string().min(1),
  employee_role_role_id: z.number().min(1),
});

export type CreateEmployeeRoles = z.infer<typeof CreateEmployeeRoles>;
export type UpdateEmployeeRoles = z.infer<typeof UpdateEmployeeRoles>;

export const status = z.object({
  status: z.string().min(1),
});
export type Status = z.infer<typeof status>;
