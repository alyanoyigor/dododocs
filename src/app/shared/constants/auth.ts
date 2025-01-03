import { AuthInputData } from "@/app/shared/interfaces/auth.interface";
import { SignInFormValidatorType, SignUpFormValidatorType } from "@/app/shared/validation/auth";

export const signUpInputs: AuthInputData<SignUpFormValidatorType>[] = [
  { title: 'Name', key: 'name', type: 'text' },
  { title: 'Email', key: 'email', type: 'email' },
  {
    title: 'Password',
    key: 'password',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    title: 'Confirm Password',
    key: 'passwordConfirm',
    type: 'password',
    autoComplete: 'new-password',
  },
];

export const signInInputs: AuthInputData<SignInFormValidatorType>[] = [
  { title: 'Email', key: 'email', type: 'email' },
  {
    title: 'Password',
    key: 'password',
    type: 'password',
    autoComplete: 'current-password',
  },
];
