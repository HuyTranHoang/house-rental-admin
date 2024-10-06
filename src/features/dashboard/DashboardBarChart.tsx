import { useBarChartData } from '@/hooks/useDashboard'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type DataItem = {
  month: string
  deposit: number
  withdrawal: number
}

export function DashboardBarChart() {
  const { data, isLoading, isError } = useBarChartData()
  const { t } = useTranslation(['dashboard'])

  const updatedData = data?.data.map((item: DataItem) => ({
    ...item,
    month: item.month.slice(0, 3)
  }))

  const formatYAxis = (tickItem: number): string => {
    if (tickItem >= 1000) {
      return `${tickItem / 1000}k`
    }
    return tickItem.toString()
  }

  if (isError) {
    return ''
  }

  return (
    <Card title={t('tradingChartsTitle')} className='mb-6 shadow-md' loading={isLoading}>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={updatedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis tickFormatter={formatYAxis} />
          <Tooltip />
          <Legend />
          <Bar dataKey='deposit' fill='#8884d8' name={t('deposit')} />
          <Bar dataKey='withdrawal' fill='#82ca9d' name={t('withdrawal')} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
