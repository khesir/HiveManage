import { z } from 'zod';

export const CreateInventoryRecord = z.object({
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

export const UpdateInventoryRecord = z.object({
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

export type CreateInventoryRecord = z.infer<typeof CreateInventoryRecord>;
export type UpdateInventoryRecord = z.infer<typeof UpdateInventoryRecord>;
