import { z } from 'zod';

export const CreateInquiry = z.object({
  customer_id: z.number().min(1),
  inquiryTitle: z.string().min(1),
  inquiry_type: z.enum([
    'Product',
    'Pricing',
    'Order Status',
    'Technical Support',
    'Billing',
    'Complaint',
    'Feedback',
    'Return/Refund',
  ]),
});

export const UpdateInquiry = z.object({
  customer_id: z.number().min(1),
  inquiryTitle: z.string().min(1),
  inquiry_type: z.enum([
    'Product',
    'Pricing',
    'Order Status',
    'Technical Support',
    'Billing',
    'Complaint',
    'Feedback',
    'Return/Refund',
  ]),
});

export type CreateInquiry = z.infer<typeof CreateInquiry>;
export type UpdateInquiry = z.infer<typeof UpdateInquiry>;
