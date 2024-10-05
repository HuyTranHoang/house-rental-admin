import ErrorFetching from '@/components/ErrorFetching'
import { useLineChartData } from '@/hooks/useDashboard'
import { Card, Tooltip } from 'antd'
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts'

type DataItem = {
  months: string
  comments: number
  users: number
  properties: number
}

export function DashboardLineChart() {
  const { data, isLoading, isError } = useLineChartData()

  const updatedData = data?.data.map((item: DataItem) => ({
    ...item,
    months: item.months.slice(0, 3)
  }))

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <Card title='Bài Đăng & Bình Luận' className='mb-6 shadow-md' loading={isLoading}>
      <div className='chart-container'>

      <LineChart width={500} height={300} data={updatedData} margin={{ top: 5, right: 20, left: -30, bottom: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='months' />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* <Line type='monotone' dataKey='users' stroke='#52c41a' name="Người dùng"/> */}
        <Line type='monotone' dataKey='properties' stroke='#1890ff' name='Bài đăng' />
        <Line type='monotone' dataKey='comments' stroke='#722ed1' name='Bình luận' />
      </LineChart>
      </div>
    </Card>
  )
}
