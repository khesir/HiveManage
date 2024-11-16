import {z} from 'zod';

export const supplierSchema = z.object({
	supplier_id: z.number().optional(),
	name: z.string().min(1),
	contact_number: z.number().min(1),
	remarks: z.string().min(1),
	profile_link: z.string().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export type Supplier = z.infer<typeof supplierSchema>;
