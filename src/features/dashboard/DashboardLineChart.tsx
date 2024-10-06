import { useLineChartData } from '@/hooks/useDashboard'
import { Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function DashboardLineChart() {
  const { data, isLoading, isError } = useLineChartData()
  const { t } = useTranslation(['dashboard'])


  if (isError) {
    return ''
  }

  return (
    <Card title={t('postCommentChartTitle')} className='mb-6 h-full shadow-md' loading={isLoading}>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data?.data} margin={{ top: 5, right: 20, left: -30, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
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
