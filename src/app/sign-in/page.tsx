import AuthTabs from '@/components/AuthTabs';
import { AuthTabsEnum } from '@/types/auth';

export default function SignIn() {
  return <AuthTabs tab={AuthTabsEnum.SIGN_IN} />;
}
