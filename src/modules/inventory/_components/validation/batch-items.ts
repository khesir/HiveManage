import {z} from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

const supplierSchema = z.object({
	supplier_id: z.number().optional(),
	name: z.string().min(1),
	contact_number: z.string().min(1),
	remarks: z.string().min(1),
	profile_link: z.union([
		z
			.instanceof(File)
			.optional()
			.refine((file) => {
				return !file || file.size <= MAX_UPLOAD_SIZE;
			}, 'File size must be less than 3MB')
			.refine((file) => {
				return !file || ACCEPTED_FILE_TYPES.includes(file.type);
			}, 'File must be a PNG or JPEG'),
		z.string(),
	]),
	relationship: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export const batchRecordSchema = z.object({
	product_record_id: z.number().optional(),
	product_id: z.number().min(1),
	supplier_id: z.number().min(1),

	qty: z.number().min(1),
	price: z.number().min(1),
	condition: z.enum(['New', 'Secondhand', 'Broken']),
	status: z.enum([
		'Sold',
		'Pending Payment',
		'On Order',
		'In Service',
		'Awaiting Service',
		'Return Requested',
	]),

	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().nullable().optional(),

	supplier: supplierSchema.optional(),
});

export type BatchItem = z.infer<typeof batchRecordSchema>;
