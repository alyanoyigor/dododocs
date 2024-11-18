'use client';

import React, { MouseEvent, useState } from 'react';
import {
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { AuthTabsEnum } from '@/types/auth';
import { SignInFormValidator, SignInFormValidatorType, SignUpFormValidator, SignUpFormValidatorType } from '@/validation/auth';
import { signInInputs, signUpInputs } from '@/constants/auth';
import AuthForm from './AuthForm';
import { trpc } from '@/app/_trpc/client';

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


  const { mutate: signInRequest } = trpc.signIn.useMutation();

  const {mutate: signUpRequest} = trpc.signUp.useMutation({
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


  const onSignUpSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSignUpSubmit((data) => {
      signUpRequest(data);
    })();
    resetSignUpForm();
  };
  const onSignInSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSignInSubmit((data) => {
      signInRequest(data);
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
