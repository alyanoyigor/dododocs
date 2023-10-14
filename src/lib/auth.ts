import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const getKindeUser = () => {
  const { getUser } = getKindeServerSession();
  return getUser();
};
