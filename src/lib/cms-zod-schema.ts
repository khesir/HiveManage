import {z} from 'zod';

export const customerSchema = z.object({
	customer_id: z.number().optional(),
	firstname: z.string().min(1),
	middlename: z.string().optional(),
	lastname: z.string().min(1),
	contact_phone: z.string().min(1),
	email: z.string().min(1),
	socials: z.array(
		z.object({
			type: z.string(),
			link: z.string(),
		}),
	),
	addressline: z.string().min(1),
	barangay: z.string().min(1),
	province: z.string().min(1),
	standing: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type Customer = z.infer<typeof customerSchema>;
