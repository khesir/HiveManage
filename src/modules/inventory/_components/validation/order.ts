import {z} from 'zod';
import {SupplierWithRelatedData} from './supplier';
import {ProductWithRelatedTables} from './product';

const orderItemEnum = z.enum([
	'Pending',
	'Partially Delivered',
	'Delivered',
	'Damaged',
	'Returned',
	'Cancelled',
]);

export const orderItemSchema = z.object({
	order_item_id: z.number().optional(),
	order_id: z.number().optional(),
	product_id: z.number().min(1),
	quantity: z.string().min(1),
	price: z.string().min(1),
	status: orderItemEnum,
	created_at: z.date().optional(),
	last_updated: z.date().optional(),
	deleted_at: z.date().nullable().optional(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderItemWithDetails = {
	orderItem_id: number;
	order_id: number;
	product_id: number;
	quantity: number;
	price: number;
	status: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string | undefined;
	product: ProductWithRelatedTables;
	order: OrderWithDetails;
};

const orderStatusEnum = z.enum([
	'Pending',
	'Processing',
	'Delivered',
	'Cancelled',
	'Return',
	'Shipped',
	'Verification',
	'Moved to Inventory',
]);

export const orderSchema = z.object({
	order_id: z.number().optional(),
	supplier_id: z.string().nullable().optional(),
	ordered_value: z.string().min(1),
	expected_arrival: z.string().optional(),
	status: orderStatusEnum,
	created_at: z.string().optional(),
	last_updated: z.string().optional(),
	deleted_at: z.string().nullable().optional(),
	order_items: z.array(orderItemSchema).optional(),
});

export type Order = z.infer<typeof orderSchema>;

export const messageSchema = z.object({
	order_logs: z.number().optional(),
	title: z.string(),
	message: z.string(),
	created_at: z.string(),
});
export type Message = z.infer<typeof messageSchema>;

export type OrderWithDetails = {
	order_id: number;
	supplier_id?: number;
	ordered_value: number;
	expected_arrival?: string;
	status: string;
	created_at?: string;
	last_updated?: string;
	deleted_at?: string | undefined;
	supplier?: SupplierWithRelatedData;
	order_item?: OrderItemWithDetails[];
	messages: Message[];
};

// const validTags = ['good', 'damaged', 'scratched', 'missing', 'expired'];
// 	const validStatuses = [
// 		'pending',
// 		'accepted',
// 		'returned',
// 		'replacement_requested',
// 		'disposed',
// 		'held',
// 	];

export const orderTrackItemSchema = z.object({
	track_record: z.array(
		z.object({
			orderItem_id: z.string().optional(),
			tag: z.string().min(1),
			status: z.string().min(1),
			quantity: z.string().min(1),
			remark: z.string().optional(),
		}),
	),
});
export type OrderTrackItem = z.infer<typeof orderTrackItemSchema>;

export type OrderTrackingItemWithDetails = {
	tracking_id: number;
	orderItem_id: number;
	tag: string;
	status: string;
	quantity: number;
	remarks: string;
	created_at?: string;
	last_updated?: string;
	product?: ProductWithRelatedTables;
	order?: Order;
};
