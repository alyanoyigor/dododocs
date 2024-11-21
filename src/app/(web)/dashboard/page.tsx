import { redirect } from 'next/navigation';
// import Dashboard from '@/components/Dashboard';
import { db } from '@/core/lib/db';
// import { getKindeUser } from '@/lib/auth';

const DashboardPage = async () => {
  // const user = getKindeUser();
  // const redirectPath = '/auth-callback?origin=dashboard';

  // if (!user || !user.id) {
  //   redirect(redirectPath);
  // }

  // const dbUser = await db.user.findFirst({
  //   where: { id: user.id },
  // });

  // if (!dbUser) {
  //   redirect(redirectPath);
  // }

  // return <Dashboard />;
  return <div>Dashboard</div>
};

export default DashboardPage;
