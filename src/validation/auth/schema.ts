import { z } from 'zod';
import { validation } from './validation';

export const SignUpFormValidator = z
  .object({
    name: validation.name,
    email: validation.email,
    password: validation.passwordCreate,
    passwordConfirm: validation.passwordConfirm,
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });
export type SignUpFormValidatorType = z.infer<typeof SignUpFormValidator>;

export const SignInFormValidator = z.object({
  email: validation.email,
  password: validation.passwordPaste,
});
export type SignInFormValidatorType = z.infer<typeof SignInFormValidator>;

export const SignUpFormValidatorBE = z.object({
  name: validation.name,
  email: validation.email,
  password: validation.passwordPaste,
});
export type SignUpFormValidatorBEType = z.infer<typeof SignUpFormValidatorBE>;
