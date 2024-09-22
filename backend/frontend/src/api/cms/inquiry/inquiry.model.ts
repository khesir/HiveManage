import { z } from 'zod';

export const CreateInquiry = z.object({
  customer_id: z.number().min(1),
  inquiryTitle: z.string().min(1),
  inquiry_type: z.string().min(1),
});

export const UpdateInquiry = z.object({
  customer_id: z.number().min(1),
  inquiryTitle: z.string().min(1),
  inquiry_type: z.string().min(1),
});

export type CreateInquiry = z.infer<typeof CreateInquiry>;
export type UpdateInquiry = z.infer<typeof UpdateInquiry>;
