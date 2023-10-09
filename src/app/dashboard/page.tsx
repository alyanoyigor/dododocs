import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

const Dashboard = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  return (
    <div>{user.email}</div>
  )
}

export default Dashboard