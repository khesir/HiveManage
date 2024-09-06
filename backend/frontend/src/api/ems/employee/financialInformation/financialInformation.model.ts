import z from 'zod';

export const FinancialInformation = z.object({
  employee_id: z.number().min(1),
  pag_ibig_id: z.string().min(1),
  sss_id: z.string().min(1),
  philhealth_id: z.string().min(1),
  tin: z.string().min(1),
  bank_account_number: z.string().min(1),
});

export type FinancialInformation = z.infer<typeof FinancialInformation>;
