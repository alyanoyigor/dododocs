import { z } from 'zod';

export const passwordCreate = z
  .string()
  .min(1, 'This field is required')
  .min(8, 'Must be at least 8 characters in length')
  .regex(
    new RegExp('.*[A-Z].*'),
    'Password should include uppercase character, number and special character',
  )
  .regex(
    new RegExp('.*[a-z].*'),
    'Password should include uppercase character, number and special character',
  )
  .regex(
    new RegExp('.*\\d.*'),
    'Password should include uppercase character, number and special character',
  );

export const validation = {
  name: z.string().min(1, 'This field is required'),
  email: z.string().min(1, 'This field is required').email(),
  passwordCreate: passwordCreate,
  passwordPaste: z.string().min(1, 'This field is required'),
  passwordConfirm: z.string(),
};
