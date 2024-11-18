import AuthTabs from '@/app/shared/components/auth/AuthTabs';
import { AuthTabsEnum } from '@/app/shared/interfaces/auth.interface';

export default function SignUp() {
  return <AuthTabs tab={AuthTabsEnum.SIGN_UP} />;
}
