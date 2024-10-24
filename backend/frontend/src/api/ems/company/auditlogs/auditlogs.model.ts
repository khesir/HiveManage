import { z } from 'zod';

// Validation Schema
export const CreateAuditLog = z.object({
  employee_id: z.number().min(1),
  entity_id: z.number().min(1),
  entity_type: z.enum([
    'Employee',
    'JobOrder',
    'Sales',
    'Service',
    'Inventory',
    'Order',
  ]),
  action: z.string().min(1),
  change: z.string().min(1),
});

export const UpdateAuditLog = z.object({
  employee_id: z.number().min(1),
  entity_id: z.number().min(1),
  entity_type: z.enum([
    'Employee',
    'JobOrder',
    'Sales',
    'Service',
    'Inventory',
    'Order',
  ]),
  action: z.string().min(1),
  change: z.string().min(1),
});

export type CreateAuditLog = z.infer<typeof CreateAuditLog>;
export type UpdateAuditLog = z.infer<typeof UpdateAuditLog>;
