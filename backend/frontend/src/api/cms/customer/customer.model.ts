import { z } from 'zod';

// Define the structure for a single social profile
const socialSchema = z.object({
  platform: z.enum([
    'Facebook',
    'Twitter',
    'Instagram',
    'LinkedIn',
    'TikTok',
    'YouTube',
  ]),
  url: z.string().url(), // Ensures the URL is valid
});

export const CreateCustomer = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  contact_phone: z.string().min(1),
  socials: z.array(socialSchema).min(1),
  address_line: z.string().min(1),
  barangay: z.string().min(1),
  province: z.string().min(1),
  email: z.string().min(1),
  standing: z.enum([
    'Active',
    'Inactive',
    'Pending',
    'Suspended',
    'Banned',
    'VIP',
    'Delinquent',
    'Prospect',
  ]),
});

export const UpdateCustomer = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  contact_phone: z.number().min(1),
  socials: z.array(socialSchema).min(1),
  address_line: z.string().min(1),
  barangay: z.string().min(1),
  province: z.string().min(1),
  email: z.string().min(1),
  standing: z.enum([
    'Active',
    'Inactive',
    'Pending',
    'Suspended',
    'Banned',
    'VIP',
    'Delinquent',
    'Prospect',
  ]),
});

export type CreateCustomer = z.infer<typeof CreateCustomer>;
export type UpdateCustomer = z.infer<typeof UpdateCustomer>;
