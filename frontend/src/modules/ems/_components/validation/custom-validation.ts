import {z} from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

// Used on Create Employee Form
export const employeeFormSchema = z.object({
	employee_position_id: z.number().min(1),
	employee_firstname: z.string().min(1, 'First name is required'),
	employee_middlename: z.string().optional(),
	employee_lastname: z.string().min(1, 'Last name is required'),
	employee_email: z.string().email().min(1, 'Email is requred'),
	employee_profile_link: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			return !file || file.size <= MAX_UPLOAD_SIZE;
		}, 'File size must be less than 3MB')
		.refine((file) => {
			return !file || ACCEPTED_FILE_TYPES.includes(file.type);
		}, 'File must be a PNG or JPEG'),

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
export type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;
