import AuthTabs from '@/components/auth/AuthTabs';
import { AuthTabsEnum } from '@/types/auth';

export default function SignUp() {
  return <AuthTabs tab={AuthTabsEnum.SIGN_UP} />;
}
