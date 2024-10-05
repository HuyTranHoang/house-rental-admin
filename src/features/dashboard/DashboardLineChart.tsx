import ErrorFetching from '@/components/ErrorFetching'
import { useLineChartData } from '@/hooks/useDashboard'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

type DataItem = {
  months: string
  comments: number
  users: number
  properties: number
}

export function DashboardLineChart() {
  const { data, isLoading, isError } = useLineChartData()
  const { t } = useTranslation(['dashboard'])

  const updatedData = data?.data.map((item: DataItem) => ({
    ...item,
    months: item.months.slice(0, 3)
  }))

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <Card title={t('postCommentChartTitle')} className='mb-6 shadow-md' loading={isLoading}>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={updatedData} margin={{ top: 5, right: 20, left: -30, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='months' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='properties' stroke='#1890ff' name={t('posts')} />
          <Line type='monotone' dataKey='comments' stroke='#722ed1' name={t('comments')} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}