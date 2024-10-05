import ErrorFetching from '@/components/ErrorFetching'
import { useLineChartData } from '@/hooks/useDashboard'
import { LoadingOutlined } from '@ant-design/icons'
import { Card, Tooltip } from 'antd'
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts'

export function DashboardLineChart() {
  const { data, isLoading, isError } = useLineChartData()

  if (isLoading) {
    return <LoadingOutlined/>
  }
  if (isError) {
    return <ErrorFetching />
  }

  return (
    <Card title='Bài Đăng & Bình Luận' className='mb-6 shadow-md'>
      <LineChart width={500} height={300} data={data?.data} margin={{ top: 5, right: 20, left: -30, bottom: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='months' />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* <Line type='monotone' dataKey='users' stroke='#52c41a' name="Người dùng"/> */}
        <Line type='monotone' dataKey='properties' stroke='#1890ff' name='Bài đăng' />
        <Line type='monotone' dataKey='comments' stroke='#722ed1' name='Bình luận' />
      </LineChart>
    </Card>
  )
}
