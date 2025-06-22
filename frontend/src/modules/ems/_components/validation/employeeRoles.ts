import {z} from 'zod';
import {EmployeeWithDetails} from './employee';
import {Role} from './role';

export const employeeRolesSchema = z.object({
	employee_roles_id: z.number().optional(),
	employe_id: z.number().min(1).optional(),
	role_id: z.number().min(1),
	last_updated: z.string().optional(),
	created_at: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type EmployeeRoles = z.infer<typeof employeeRolesSchema>;

export type EmployeeRolesWithDetails = {
	employee_roles_id: number;
	employee: EmployeeWithDetails;
	role: Role;
	status: string;
	created_at: string;
	last_updated: string;
	deleted_at: string;
};
