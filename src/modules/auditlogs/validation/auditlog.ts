import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee';
import {z} from 'zod';

export const auditLogSchema = z.object({
	employee_id: z.number().min(1),
	entity_id: z.number().optional(),
	entity_type: z.enum([
		'Employee',
		'JobOrder',
		'Sales',
		'Service',
		'Inventory',
		'Order',
	]),
	action: z.string().min(1),
	change: z.string().min(1),
});

export type AuditLogs = z.infer<typeof auditLogSchema>;

export type AuditLogsWithDetails = {
	auditlog_id: number;
	employee: EmployeeBasicInformation;
	entity_id: number;
	entity_type: string;
	action: string;
	change: object;
	created_at: string;
	deleted_at: string;
};
