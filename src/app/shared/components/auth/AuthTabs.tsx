'use client';

import React, { MouseEvent, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { AuthTabsEnum } from '@/app/shared/interfaces/auth.interface';
import {
  SignInFormValidator,
  SignInFormValidatorType,
  SignUpFormValidator,
  SignUpFormValidatorType,
} from '@/app/shared/validation/auth';
import { signInInputs, signUpInputs } from '@/app/shared/constants/auth';
import { trpc } from '@/app/_trpc/client';

import MaxWidthWrapper from '../MaxWidthWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import AuthForm from './AuthForm';

function useAuthForm<T extends FieldValues>(
  useFormOptions: any,
  submitCallback: (data: T) => void,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<T>(useFormOptions);

  const onSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSubmit((data) => {
      submitCallback(data);
      reset();
    })();
  };

  return {
    register,
    onSubmit,
    errors,
    reset,
  };
}

function AuthTabs({ tab }: { tab: AuthTabsEnum }) {
  const [activeTab, setActiveTab] = useState(tab);
  const router = useRouter();

  const { mutate: signUpRequest } = trpc.signUp.useMutation({
    onSuccess: (token) => {
      console.log('token', token);
      // when mutation success
    },
    onMutate: () => {
      // when mutation starts
    },
    onSettled: () => {
      // when mutation ends
    },
  });

  const { mutate: signInRequest } = trpc.signIn.useMutation();

  const {
    register: signUpRegister,
    onSubmit: onSignUpSubmit,
    errors: signUpErrorsForm,
    reset: resetSignUpForm,
  } = useAuthForm(
    { reValidateMode: 'onSubmit', resolver: zodResolver(SignUpFormValidator) },
    (data: SignUpFormValidatorType) => signUpRequest(data),
  );

  const {
    register: signInRegister,
    onSubmit: onSignInSubmit,
    errors: signInErrors,
    reset: resetSignInForm,
  } = useAuthForm(
    { reValidateMode: 'onSubmit', resolver: zodResolver(SignInFormValidator) },
    (data: SignInFormValidatorType) => signInRequest(data),
  )

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
            errors={signUpErrorsForm}
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