import AuthTabs from '@/app/shared/components/auth/AuthTabs';
import { Routes } from '@/app/shared/interfaces/routes.interface';

export default function SignIn() {
  return <AuthTabs tab={Routes.SIGN_IN} />;
}
