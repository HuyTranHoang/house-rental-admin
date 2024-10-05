import ErrorFetching from '@/components/ErrorFetching'
import { useBarChartData } from '@/hooks/useDashboard'
import { Card, Tooltip } from 'antd'
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts'

type DataItem = {
  month: string
  deposit: number
  withdrawal: number
}

export function DashboardBarChart() {
  const { data, isLoading, isError } = useBarChartData()

  const updatedData = data?.data.map((item: DataItem) => ({
    ...item,
    month: item.month.slice(0, 3)
  }))

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <Card title='Biểu Đồ Giao Dịch' className='mb-6 shadow-md' loading={isLoading}>
      <BarChart width={500} height={300} data={updatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
