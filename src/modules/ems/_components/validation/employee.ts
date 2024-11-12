import {z} from 'zod';
import {Department} from './department';
import {Designation} from './designation';
import {Position} from './position';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

export const employeeSchema = z.object({
	employee_id: z.number().optional(),
	position_id: z.string().min(1),
	firstname: z.string().min(1, 'First name is required'),
	middlename: z.string().optional(),
	lastname: z.string().min(1, 'Last name is required'),
	email: z.string().min(1),
	profile_link: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			return !file || file.size <= MAX_UPLOAD_SIZE;
		}, 'File size must be less than 3MB')
		.refine((file) => {
			return !file || ACCEPTED_FILE_TYPES.includes(file.type);
		}, 'File must be a PNG or JPEG'),
	// This is just form form submission on settings, not part of employee Schema
	role_id: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type EmployeeBasicInformation = z.infer<typeof employeeSchema>;

export type EmployeeWithDetails = {
	employee_id: number;
	position: Position;
	firstname: string;
	middlename: string;
	lastname: string;
	email: string;
	profile_link?: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
};

export const personalInformationSchema = z.object({
	personal_information_id: z.number().optional(),
	birthday: z.string().min(1, 'Birthday is required'), // Could be converted to date if needed
	sex: z.string().min(1), // Enum for gender
	phone: z.string().min(10, 'Phone number should be at least 10 digits'), // Min length check
	address_line: z.string().min(1, 'Address line is required'), // Non-empty string
	postal_code: z.string().min(5, 'Postal code should be at least 5 characters'), // Validate length
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type PersonalInformation = z.infer<typeof personalInformationSchema>;

export const employmentInformationSchema = z.object({
	employment_information_id: z.number().optional(),
	department_id: z.number().min(1, 'Department is required'),
	designation_id: z.number().min(1, 'Designation is required'),
	employee_type: z.string().min(1),
	employee_status: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type EmploymentInformation = z.infer<typeof employmentInformationSchema>;

export type EmploymentInformationWithDetails = {
	employment_information_id: number;
	employee_id: number;
	hireDate: string;
	department: Department;
	designation: Designation;
	employee_type: string;
	employee_status: string;
	created_at: string;
	last_updated: string;
	deleted_at?: string;
};

export type EmployeeWithRelatedDetails = {
	employee: EmployeeWithDetails;
	personal_information: PersonalInformation;
	employment_information: EmploymentInformationWithDetails;
};
