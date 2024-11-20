'use client';

import React, { FC, MouseEvent, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import {
  SignInFormValidator,
  SignInFormValidatorType,
  SignUpFormValidator,
  SignUpFormValidatorType,
} from '@/app/shared/validation/auth';
import { signInInputs, signUpInputs } from '@/app/shared/constants/auth';
import { trpc } from '@/app/_trpc/client';
import { navigate, setCookie } from '@/app/shared/actions';

import MaxWidthWrapper from '../MaxWidthWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import AuthForm from './AuthForm';
import { Routes } from '../../interfaces/routes.interface';

function useAuthForm<T extends FieldValues>(
  useFormOptions: any,
  submitCallback: (data: T) => void,
) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<T>(useFormOptions);

  const onSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    handleSubmit((data) => submitCallback(data))();
  };

  return {
    register,
    onSubmit,
    errors,
    reset,
    setError,
  };
}

interface AuthTabsProps {
  tab: Routes.SIGN_IN | Routes.SIGN_UP;
}

const AuthTabs: FC<Readonly<AuthTabsProps>> = ({ tab }) => {
  const [activeTab, setActiveTab] = useState(tab);
  const router = useRouter();

  const { mutate: signUpRequest, isLoading: isSignUpLoading } =
    trpc.signUp.useMutation({
      onSuccess: () => {
        resetSignUpForm();

        // navigate to requested page
        router.back();
        // navigate('/');
      },
      onError: (error) => {
        if (error.message.includes('Unique constraint')) {
          setSignUpError('root', {
            message: 'This email is already in use. Please sign in.',
          });
        }
      },
    });

  const { mutate: signInRequest, isLoading: isSignInLoading } =
    trpc.signIn.useMutation({
      onSuccess: () => {
        resetSignInForm();

        // navigate to requested page
        router.back();
        // navigate('/');
      },
      onError: (error) => {
        if (error.data?.code === 'UNAUTHORIZED') {
          setSignInError('root', {
            message: 'This user does not exist. Please sign up.',
          });
        }
        if (error.message.includes('Incorrect password')) {
          setSignInError('root', {
            message: 'Incorrect password. Please try again.',
          });
        }
      },
    });

  const {
    register: signUpRegister,
    onSubmit: onSignUpSubmit,
    errors: signUpErrorsForm,
    reset: resetSignUpForm,
    setError: setSignUpError,
  } = useAuthForm(
    { reValidateMode: 'onSubmit', resolver: zodResolver(SignUpFormValidator) },
    (data: SignUpFormValidatorType) => signUpRequest(data),
  );

  const {
    register: signInRegister,
    onSubmit: onSignInSubmit,
    errors: signInErrors,
    reset: resetSignInForm,
    setError: setSignInError,
  } = useAuthForm(
    { reValidateMode: 'onSubmit', resolver: zodResolver(SignInFormValidator) },
    (data: SignInFormValidatorType) => signInRequest(data),
  );

  const onTabChange = (tab: Routes.SIGN_IN | Routes.SIGN_UP) => {
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
        onValueChange={(value) =>
          onTabChange(value as Routes.SIGN_IN | Routes.SIGN_UP)
        }
        defaultValue={Routes.SIGN_IN}
        className="w-ful max-w-[500px] mt-10 mx-auto"
      >
        <TabsList className="w-full">
          <TabsTrigger value={Routes.SIGN_IN} className="w-full">
            Sign in
          </TabsTrigger>
          <TabsTrigger value={Routes.SIGN_UP} className="w-full">
            Sign up
          </TabsTrigger>
        </TabsList>
        <TabsContent value={Routes.SIGN_IN}>
          <AuthForm
            title="Sign In"
            errors={signInErrors}
            register={signInRegister}
            onSubmit={onSignInSubmit}
            inputs={signInInputs}
            isLoading={isSignInLoading}
          />
        </TabsContent>
        <TabsContent value={Routes.SIGN_UP}>
          <AuthForm
            title="Sign Up"
            errors={signUpErrorsForm}
            register={signUpRegister}
            onSubmit={onSignUpSubmit}
            inputs={signUpInputs}
            isLoading={isSignUpLoading}
          />
        </TabsContent>
      </Tabs>
    </MaxWidthWrapper>
  );
};

export default AuthTabs;
