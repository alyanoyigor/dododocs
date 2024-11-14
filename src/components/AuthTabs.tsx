'use client';

import React, { MouseEvent, useState } from 'react';
import { z } from 'zod';
import {
  FieldErrors,
  FieldValues,
  Path,
  useForm,
  UseFormRegister,
  UseFormRegisterReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { AuthTabsEnum } from '@/types/auth';
import { useRouter } from 'next/navigation';

const passwordCreate = z
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
  )
  .regex(
    new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
    'Password should include uppercase character, number and special character',
  );

const validation = {
  name: z.string().min(1, 'This field is required'),
  email: z.string().min(1, 'This field is required').email(),
  passwordCreate: passwordCreate,
  passwordPaste: z.string().min(1, 'This field is required'),
  passwordConfirm: z.string(),
};

const SignUpFormValidator = z
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

type SignUpFormValidatorType = z.infer<typeof SignUpFormValidator>;

const SignInFormValidator = z.object({
  email: validation.email,
  password: validation.passwordPaste,
});
type SignInFormValidatorType = z.infer<typeof SignInFormValidator>;

type InputType<T extends FieldValues> = {
  title: string;
  key: Path<T>;
  type: string;
  autoComplete?: string;
};

const signUpInputs: InputType<SignUpFormValidatorType>[] = [
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

const signInInputs: InputType<SignInFormValidatorType>[] = [
  { title: 'Email', key: 'email', type: 'email' },
  {
    title: 'Password',
    key: 'password',
    type: 'password',
    autoComplete: 'current-password',
  },
];

type CustomInputType<T extends FieldValues> = {
  registerData: UseFormRegisterReturn;
  inputInfo: InputType<T>;
  error?: string;
};

function CustomInput<T extends FieldValues>({
  error,
  registerData,
  inputInfo,
}: CustomInputType<T>) {
  const { title, key, type, autoComplete } = inputInfo;
  const InputElement = type === 'password' ? PasswordInput : Input;

  return (
    <div className="flex flex-col items-start mb-3">
      <Label htmlFor={key} className="mb-1 text-sm">
        {title}
      </Label>
      <div className="relative w-full">
        <InputElement
          {...registerData}
          placeholder={title}
          type={type}
          className={cn(
            'w-[100%] h-9',
            error && 'border-red-500 focus-visible:ring-red-500',
          )}
          id={key}
          autoComplete={autoComplete || 'off'}
        />
      </div>
      {error && (
        <span className="inline-block text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
}

type AuthFormType<T extends FieldValues> = {
  title: string;
  inputs: InputType<T>[];
  errors: FieldErrors;
  register: UseFormRegister<T>;
  onSubmit: (event: MouseEvent<HTMLButtonElement>) => void;
};

function AuthForm<T extends FieldValues>({
  title,
  inputs,
  errors,
  register,
  onSubmit,
}: AuthFormType<T>) {
  return (
    <div className="p-8 bg-white border-gray-200 rounded">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <form>
        {inputs.map((inputInfo: InputType<T>) => (
          <CustomInput
            key={inputInfo.key}
            inputInfo={inputInfo}
            error={errors[inputInfo.key]?.message?.toString()}
            registerData={register(inputInfo.key)}
          />
        ))}

        <Button
          onClick={onSubmit}
          variant="default"
          className="mt-4 w-full h-[40px] max-w-[160px]"
          type="submit"
        >
          {title}
        </Button>
      </form>
    </div>
  );
}

function AuthTabs({ tab }: { tab: AuthTabsEnum }) {
  const [activeTab, setActiveTab] = useState(tab);
  const router = useRouter();

  const {
    register: signUpRegister,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
    reset: resetSignUpForm,
  } = useForm<SignUpFormValidatorType>({
    reValidateMode: 'onSubmit',
    resolver: zodResolver(SignUpFormValidator),
  });

  const {
    register: signInRegister,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
    reset: resetSignInForm,
  } = useForm<SignInFormValidatorType>({
    reValidateMode: 'onSubmit',
    resolver: zodResolver(SignInFormValidator),
  });

  const onSignUpSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSignUpSubmit((data) => {
      console.log('submit', data);
    })();
    resetSignUpForm();
  };
  const onSignInSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSignInSubmit((data) => {
      console.log('submit', data);
    })();
    resetSignInForm();
  };

  const onTabChange = (tab: AuthTabsEnum) => {
    setActiveTab(tab);
    router.replace(tab);

    // clear potential errors and values
    resetSignInForm();
    resetSignUpForm();
  };

  return (
    <MaxWidthWrapper>
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as AuthTabsEnum)}
        defaultValue={AuthTabsEnum.SIGN_IN}
        className="w-ful max-w-[500px] mt-10 mx-auto"
      >
        <TabsList className="w-full">
          <TabsTrigger value={AuthTabsEnum.SIGN_IN} className="w-full">
            Sign in
          </TabsTrigger>
          <TabsTrigger value={AuthTabsEnum.SIGN_UP} className="w-full">
            Sign up
          </TabsTrigger>
        </TabsList>
        <TabsContent value={AuthTabsEnum.SIGN_IN}>
          <AuthForm
            title="Sign In"
            errors={signInErrors}
            register={signInRegister}
            onSubmit={onSignInSubmit}
            inputs={signInInputs}
          />
        </TabsContent>
        <TabsContent value={AuthTabsEnum.SIGN_UP}>
          <AuthForm
            title="Sign Up"
            errors={signUpErrors}
            register={signUpRegister}
            onSubmit={onSignUpSubmit}
            inputs={signUpInputs}
          />
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
}

export default AuthTabs;
