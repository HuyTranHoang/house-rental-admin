import ErrorFetching from '@/components/ErrorFetching';
import { useLineChartData } from '@/hooks/useDashboard';
import { Card } from 'antd'
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

export function DashboardAreaChart() {
    const { data, isLoading, isError } = useLineChartData();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <ErrorFetching />
    }
  
  return (
    <Card title='Tài Khoản Đăng Ký Mới' className='mb-6 shadow-md'>
      <AreaChart width={500} height={300} data={data?.data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='months' />
        <YAxis />
        <Tooltip />
        <Area type='monotone' dataKey='users' stroke='#8884d8' fill='#8884d8' name='Tài khoản' />
      </AreaChart>
    </Card>
  )
}
