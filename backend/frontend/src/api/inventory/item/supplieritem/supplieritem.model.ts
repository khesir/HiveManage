import { z } from 'zod';

export const CreateSupplierItem = z.object({
  supplier_id: z.number().min(1),
  item_id: z.number().min(1),
  tag: z.enum([
    'Active',
    'Inactive',
    'Pending Approval',
    'Verified',
    'Unverified',
    'Suspended',
    'Preferred',
    'Blacklisted',
    'Under Review',
    'Archived',
  ]),
  stock: z.number().min(1),
});

export const UpdateSupplierItem = z.object({
  supplier_id: z.number().min(1),
  item_id: z.number().min(1),
  tag: z.enum([
    'Active',
    'Inactive',
    'Pending Approval',
    'Verified',
    'Unverified',
    'Suspended',
    'Preferred',
    'Blacklisted',
    'Under Review',
    'Archived',
  ]),
  stock: z.number().min(1),
});

export type CreateSupplierItem = z.infer<typeof CreateSupplierItem>;
export type UpdateSupplierItem = z.infer<typeof UpdateSupplierItem>;
