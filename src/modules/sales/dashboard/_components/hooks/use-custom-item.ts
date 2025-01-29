import {z} from 'zod';
import {create} from 'zustand';

const batchItemSchema = z.object({
	batch_item_id: z.number().optional(),
	item_id: z.number().min(1),
	batch_number: z.string().min(1),
	item_condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	item_status: z.enum(['Active', 'Reserve', 'Depleted']),
	quantity: z.number().min(1),
	reserved_quantity: z.number().optional(),
	pending_quantity: z.number().optional(),
	unit_price: z.number().min(1),
	selling_price: z.number().min(1),
	production_date: z.string().optional(),
	expiration_date: z.string().optional(),
});
const serializeItemSchema = z.object({
	serialized_item_id: z.number().optional(),
	item_id: z.number().min(1),
	serial_number: z.string().min(1),
	condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	status: z.enum(['Active', 'Sold', 'Decommisioned']),
	unit_price: z.number().min(1),
	selling_price: z.number().min(1),
	warranty_expiry_date: z.string().optional(),
});
const productSchema = z.object({
	product_id: z.number().optional(),
	name: z.string().min(1),
	description: z.string().min(1),
	img_url: z.string(),
	stock_limit: z.number().min(1),
	total_stock: z.number().optional(),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().optional(),
});
const productVariantSchema = z.object({
	variant_id: z.number().optional(),
	product_id: z.number().optional(),
	variant_name: z.string().min(1),
	img_url: z.string().min(1),
	attribute: z.record(z.union([z.string(), z.number(), z.boolean()])),
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	product: productSchema.optional(),
});

export const customItemSchema = z.object({
	item_id: z.number().optional(),
	item_record_id: z.number().optional(),
	variant_id: z.number().min(1),
	item_type: z.enum(['Batch', 'Serialized', 'Both']),
	item_condition: z.enum([
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	]),
	item_status: z.enum([
		'OnStock',
		'Sold',
		'Depleted',
		'Returned',
		'Pending Payment',
		'On Order',
		'In Transit',
		'Return Requested',
		'Pending Inspection',
		'In Service',
		'Under Repair',
		'Awaiting Service',
		'Ready for Pickup',
		'Retired',
	]),
	quantity: z.number().min(1),
	reorder_level: z.number().optional(),
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),

	variant: productVariantSchema.optional(),
	serial: serializeItemSchema.optional(),
	batch: batchItemSchema.optional(),
});

export type CustomItem = z.infer<typeof customItemSchema>;

type PropsProps = {
	selectedItem: CustomItem | null;
	setSelectedItem: (newData: CustomItem) => void;
	resetSelectedItem: () => void;
};

const useItemStore = create<PropsProps>((set) => ({
	selectedItem: null,
	setSelectedItem: (newData: CustomItem) =>
		set(() => ({
			selectedItem: newData,
		})),
	resetSelectedItem: () =>
		set(() => ({
			selectedItem: null,
		})),
}));

export default useItemStore;
