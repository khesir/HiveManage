import {z} from 'zod';
const ticketTypeSchema = z.object({
	ticket_type_id: z.number().optional(),

	name: z.string().min(1),
	description: z.string().min(1),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
const employeeSchema = z.object({
	employee_id: z.number().optional(),
	position_id: z.string().optional(),
	firstname: z.string().optional(),
	middlename: z.string().optional(),
	lastname: z.string().optional(),
	email: z.string().optional(),
	profile_link: z.string().optional(),
	role_id: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

const assignedTicketSchema = z.object({
	service_id: z.number().optional(),
	employee_id: z.number().optional(),
	employee: employeeSchema.optional(),
});

export const ticketSchema = z.object({
	ticket_id: z.number().optional(),
	service_id: z.number().min(1),
	ticket_type_id: z.number().min(1),
	title: z.string().min(1),
	description: z.string().min(1),
	content: z.string().optional(),
	ticket_status: z.enum([
		'Pending',
		'In Review',
		'Approved',
		'Rejected',
		'Assigned',
		'In Progress',
		'On Hold',
		'Completed',
		'Cancelled',
		'Closed',
	]),
	deadline: z.string().optional(),
	ticket_type: ticketTypeSchema.optional(),
	assigned: z.array(assignedTicketSchema).optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),

	user_id: z.number().min(1),
});

export type Ticket = z.infer<typeof ticketSchema>;
