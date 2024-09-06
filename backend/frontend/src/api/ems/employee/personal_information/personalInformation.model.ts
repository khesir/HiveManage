import z from 'zod';

export const PersonalInformation = z.object({
  employee_id: z.number().min(1),
  birthday: z.string().min(1),
  gender: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
  address_line: z.string().min(1),
  postal_code: z.string().min(1),
  emergency_contact_name: z.string().min(1).optional(),
  emergency_contact_phone: z.string().min(1).optional(),
  emergency_contact_relationship: z.string().min(1).optional(),
});

export type PersonalInformation = z.infer<typeof PersonalInformation>;
