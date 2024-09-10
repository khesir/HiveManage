import { z } from 'zod';

export const Employeees = z.object({
  employee_id: z.number().min(1),
});

export const CreateOnPayrollArray = z.object({
  employees: z.array(Employeees),
});

export const UpadteOnPayrollArray = z.object({
  toAddEmployee: z.array(Employeees).optional(),
  toDeleteEmployee: z.array(Employeees).optional(),
});

export type OnPayroll = z.infer<typeof Employeees>;
export type CreateOnPayrollArray = z.infer<typeof CreateOnPayrollArray>;
export type UpdateOnPayrollArray = z.infer<typeof UpadteOnPayrollArray>;
