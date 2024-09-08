import { z } from 'zod';

export const CreatePayrollApproval = z.object({
  on_payroll_id: z.number().min(1),
  signatory_id: z.number().min(1),
  approval_status: z.string().min(1),
  approval_date: z.date().optional(),
});

export type CreatePayrollApprovalData = z.infer<typeof CreatePayrollApproval>;

export const UpdatePayrollApproval = z.object({
  on_payroll_id: z.number().min(1).optional(),
  signatory_id: z.number().min(1).optional(),
  approval_status: z.string().min(1).optional(),
  approval_date: z.date().optional(),
});

export type UpdatePayrollApproval = z.infer<typeof UpdatePayrollApproval>;
