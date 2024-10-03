import ErrorFetching from '@/components/ErrorFetching'
import { useBarChartData } from '@/hooks/useDashboard'
import { LoadingOutlined } from '@ant-design/icons'
import { Card, Tooltip } from 'antd'
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts'

export function DashboardBarChart() {
  const { data, isLoading, isError } = useBarChartData()

  if (isLoading) {
    return <LoadingOutlined/>
  }
  if (isError) {
    return <ErrorFetching />
  }

  return (
    <Card title='Biểu Đồ Giao Dịch' className='mb-6 shadow-md'>
      <BarChart width={500} height={300} data={data?.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='deposit' fill='#8884d8' name='Nạp vào' />
        <Bar dataKey='withdrawal' fill='#82ca9d' name='Mua gói' />
      </BarChart>
    </Card>
  )
}
