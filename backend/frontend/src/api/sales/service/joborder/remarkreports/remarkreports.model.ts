import { z } from 'zod';

export const CreateRemarkReports = z.object({
  customer_id: z.number().min(1),
  remark_id: z.number().optional(),
});

export const UpdateRemarkReports = z.object({
  customer_id: z.number().min(1),
  remark_id: z.number().optional(),
});

export type CreateRemarkReports = z.infer<typeof CreateRemarkReports>;
export type UpdateRemarkReports = z.infer<typeof UpdateRemarkReports>;
