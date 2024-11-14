import AuthTabs from '@/components/AuthTabs';
import { AuthTabsEnum } from '@/types/auth';

export default function SignUp() {
  return <AuthTabs tab={AuthTabsEnum.SIGN_UP} />;
}
