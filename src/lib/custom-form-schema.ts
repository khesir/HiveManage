import {z} from 'zod';
import {
	EmployeeBasicInformation,
	personalInformationSchema,
	employmentInformationSchema,
	salaryInformationSchema,
	financialInformationSchema,
} from './zod-schema';

// Used on Create Employee Form
const employeeFormSchema = z.object({
	employeeBasicInformation: EmployeeBasicInformation,
	personalInformation: personalInformationSchema,
	employmentInformation: employmentInformationSchema,
	salaryInformation: salaryInformationSchema,
	financialInformation: financialInformationSchema,
});

// Export the schema
export {employeeFormSchema};
export type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;
