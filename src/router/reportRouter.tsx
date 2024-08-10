import ListReport from '../features/report/ListReport.tsx'
import { RouteObject } from 'react-router-dom'

const reportRouter: RouteObject[] = [
  {
    path: '/report',
    element: <ListReport />
  },
]

export default reportRouter