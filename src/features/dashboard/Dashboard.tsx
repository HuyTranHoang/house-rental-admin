import { useSetBreadcrumb } from '../../hooks/useSetBreadcrumb.ts'

function Dashboard() {

  useSetBreadcrumb([{ title: 'Dashboard' }])

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard
