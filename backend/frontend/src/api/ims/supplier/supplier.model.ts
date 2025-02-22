import { z } from 'zod';

export const CreateSupplier = z.object({
  company_name: z.string().min(1),
  contact_number: z.string().min(1),
  remarks: z.string().min(1),
  relationship: z.enum([
    'manufacturer',
    'distributor',
    'wholesaler',
    'vendor',
    'authorized dealer',
    'OEM (Original Equipment Manufacturer)',
    'peripheral supplier',
    'component reseller',
    'refurbished parts supplier',
    'specialized parts supplier',
    'network hardware supplier',
    'value-added reseller',
    'accessories supplier',
    'logistics partner',
  ]),
  profile_link: z.string().min(1),
});

export const UpdateSupplier = z.object({
  company_name: z.string().min(1),
  contact_number: z.string().min(1),
  remarks: z.string().min(1),
});

export type CreateSupplier = z.infer<typeof CreateSupplier>;
export type UpdateSupplier = z.infer<typeof UpdateSupplier>;
