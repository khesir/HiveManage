import {z} from 'zod';

export const ownedItemsSchema = z.object({
	service_owned_id: z.number().optional(),
	service_id: z.number().min(1),
	name: z.string().optional(),
	item_description: z.string().optional().nullable(),
	serial_number: z.string(),
	brand: z.string(),
	model: z.string(),
	notes: z.string(),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
export type OwnedItems = z.infer<typeof ownedItemsSchema>;
