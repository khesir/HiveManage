import { z } from 'zod';

const paymentSchema = z.object({
  payment_id: z.number().optional(),
  service_id: z.number().optional(),
  sales_id: z.number().optional(),
  amount: z.number().min(1, { message: 'Amount must be at least 1' }),
  vat_amount: z.number().optional(),
  discount_amount: z.number().optional(),
  paid_amount: z.number().min(1, { message: 'Paid amount must be at least 1' }),
  change_amount: z.number().optional(),
  payment_date: z.string().optional(),
  payment_method: z.enum(['Cash', 'Card', 'Online Payment'], {
    message: 'Invalid payment method',
  }),
  payment_type: z.enum(['Service', 'Sales'], {
    message: 'Invalid payment type',
  }),
  reference_number: z.string().optional(),
});

const customerSchema = z.object({
  customer_id: z.number().optional(),
  firstname: z.string().optional(),
  middlename: z.string().optional(),
  lastname: z.string().optional(),
  contact_phone: z.string().optional(),
  email: z.string().optional(),
  socials: z
    .array(
      z.object({
        type: z.string().optional(),
        link: z.string().optional(),
      }),
    )
    .optional(),
  addressline: z.string().optional(),
  barangay: z.string().optional(),
  province: z.string().optional(),
  standing: z.string().optional(),
});
const salesItemSchema = z.object({
  sales_items_id: z.number().optional(),

  product_id: z.number().optional(),
  sales_id: z.number().optional(),
  product_record_id: z.number().optional(),
  serial_id: z.number().optional(),

  quantity: z.number().optional(),
  total_price: z.number().optional(),
});

export const CreateSales = z.object({
  handled_by: z.number().min(1),
  status: z.enum(['Completed', 'Partially Completed', 'Cancelled']),
  salesItem: z.array(salesItemSchema).min(1),
  customer: customerSchema.optional(),
  payment: paymentSchema.optional(),
});

export const UpdateSales = z.object({
  handled_by: z.number().min(1),
  status: z.enum(['Completed', 'Partially Completed', 'Cancelled']),

  salesItem: z.array(salesItemSchema).min(1),
  customer: customerSchema.optional(),
  payment: paymentSchema.optional(),
});

export type CreateSales = z.infer<typeof CreateSales>;
export type UpdateSales = z.infer<typeof UpdateSales>;
