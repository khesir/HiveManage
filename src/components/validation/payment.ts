import {z} from 'zod';

export const paymentSchema = z.object({
	payment_id: z.number().optional(),
	service_id: z.number().optional(),
	sales_id: z.number().optional(),
	amount: z.number().min(1, {message: 'Amount must be at least 1'}),
	vat_amount: z.number().optional(),
	discount_amount: z.number().optional(),
	paid_amount: z.number().min(1, {message: 'Paid amount must be at least 1'}),
	change_amount: z.number().optional(),
	payment_date: z.string().optional(),
	payment_method: z.enum(['Cash', 'Card', 'Online Payment'], {
		message: 'Invalid payment method',
	}),
	payment_type: z.enum(['Service', 'Sales'], {message: 'Invalid payment type'}),
	reference_number: z.string().optional(),
});
export type Payment = z.infer<typeof paymentSchema>;
