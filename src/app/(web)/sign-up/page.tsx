import AuthTabs from '@/app/shared/components/auth/AuthTabs';
import { Routes } from '@/app/shared/interfaces/routes.interface';

export default function SignUp() {
  return <AuthTabs tab={Routes.SIGN_UP} />;
}
