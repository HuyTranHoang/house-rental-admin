import { useLineChartData } from '@/hooks/useDashboard'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type DataItem = {
  month: string
  comments: number
  users: number
  properties: number
}

export function DashboardAreaChart() {
  const { data, isLoading, isError } = useLineChartData()
  const { t } = useTranslation(['dashboard'])

  const updatedData = data?.data.map((item: DataItem) => ({
    ...item,
    month: item.month.slice(0, 3)
  }))

  if (isError) {
    return ''
  }

  return (
    <Card title={t('registrationChartTitle')} className='mb-6 shadow-md' loading={isLoading}>
      <ResponsiveContainer width='100%' height={300}>
        <AreaChart
          data={updatedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type='monotone' dataKey='users' stroke='#8884d8' fill='#8884d8' name={t('users')} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
