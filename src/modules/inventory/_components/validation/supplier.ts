import {z} from 'zod';
import {ProductCategoryWithDetails} from './category';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];
// For the purpose of using in supplier Schema
const productCategorySchema = z.object({
	product_category_id: z.number().min(1),
	product_id: z.number().min(1),
	category_id: z.number().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});

export const supplierSchema = z.object({
	supplier_id: z.number().optional(),
	name: z.string().min(1),
	contact_number: z.string().min(1),
	remarks: z.string().min(1),
	profile_link: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			return !file || file.size <= MAX_UPLOAD_SIZE;
		}, 'File size must be less than 3MB')
		.refine((file) => {
			return !file || ACCEPTED_FILE_TYPES.includes(file.type);
		}, 'File must be a PNG or JPEG'),
	relationship: z.string().min(1),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
	categories: z.array(productCategorySchema).optional(),
});

export type Supplier = z.infer<typeof supplierSchema>;

export type SupplierWithRelatedData = {
	supplier_id?: number;
	name: string;
	contact_number: string;
	remarks: string;
	profile_link?: string;
	relationship: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string;
	categories?: ProductCategoryWithDetails[];
};
