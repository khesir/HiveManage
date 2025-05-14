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
const createSerializeSchema = z.object({
  serial_id: z.number().optional(),
  product_id: z.number().optional(),
  supplier_id: z.number().optional(),
  serial_code: z.string().optional().nullable(),
  warranty_date: z.string().optional().nullable(),
  condition: z.enum(['New', 'Secondhand', 'Broken']).optional(),
  status: z
    .enum([
      'Sold',
      'Available',
      'In Service',
      'On Order',
      'Returned',
      'Damage',
      'Retired',
    ])
    .optional(),
});
const productSchema = z.object({
  product_id: z.number().optional(),
  name: z.string(),
  is_serialize: z.boolean(),
  status: z.enum(['Unavailable', 'Available']),
  product_categories: z
    .array(
      z.object({
        category_id: z.number().optional(),
      }),
    )
    .optional(),
  product_details: z
    .object({
      description: z.string(),
      color: z.string(),
      size: z.string(),
    })
    .optional(),
  re_order_level: z.number().optional(),
  selling_price: z.string().optional(),
});
const salesItemSchema = z.object({
  is_serialize: z.boolean().optional(),
  quantity: z.number().optional(),
  sold_price: z.string().optional(),
  data: productSchema.optional(),
  serializeData: z.array(createSerializeSchema).optional(),
});

export const CreateSales = z.object({
  handled_by: z.number().min(1),
  status: z.enum(['Completed', 'Partially Completed', 'Cancelled']),
  salesItems: z.array(salesItemSchema).min(1),
  customer: customerSchema.optional(),
  payment: paymentSchema.optional(),
});

export const UpdateSales = z.object({
  handled_by: z.number().min(1),
  status: z.enum(['Completed', 'Partially Completed', 'Cancelled']),

  salesItems: z.array(salesItemSchema).min(1),
  customer: customerSchema.optional(),
  payment: paymentSchema.optional(),
});

export type CreateSales = z.infer<typeof CreateSales>;
export type UpdateSales = z.infer<typeof UpdateSales>;
