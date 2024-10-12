import {z} from 'zod';
import {
	personalInformationSchema,
	employmentInformationSchema,
	salaryInformationSchema,
	financialInformationSchema,
	employeeBasicInformationSchema,
	OnPayrollSchema,
	PayollApprovalSchema,
} from './zod-schema';

// Used on Create Employee Form
const employeeFormSchema = z.object({
	employeeBasicInformation: employeeBasicInformationSchema,
	personalInformation: personalInformationSchema,
	employmentInformation: employmentInformationSchema,
	salaryInformation: salaryInformationSchema,
	financialInformation: financialInformationSchema,
});

// Export the schema
export {employeeFormSchema};
export type EmployeeFormSchema = z.infer<typeof employeeFormSchema>;

export const onPayrollFormSchema = z.object({
	on_payroll: OnPayrollSchema,
	employee: employeeBasicInformationSchema,
	payroll_approval: PayollApprovalSchema,
});

export type OnPayrollJoin = z.infer<typeof onPayrollFormSchema>;

export const activityLogEmployeeSchema = z.object({
	activity_id: z.number().optional(),
	employee: employeeBasicInformationSchema,
	action: z.string().min(1),
	created_at: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type ActivityLogsJoin = z.infer<typeof activityLogEmployeeSchema>;
