import isAuth from "@/hoc/isAuth";
import DashboardLayout from '@/layouts/DashboardLayout';

function Dashboard() {

  return (
    <DashboardLayout title="Dashboard">
    </DashboardLayout>
  )
}

export default isAuth(Dashboard);