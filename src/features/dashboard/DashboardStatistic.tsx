import { useStatisticData } from '@/hooks/useDashboard'
import { formatCurrency } from '@/utils/formatCurrentcy.ts'
import { SwapOutlined } from '@ant-design/icons'
import { Card, Col, Row, Space, Statistic, Tooltip, Typography } from 'antd'
import { DollarSign, FileText, MessageSquare, Users } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function DashboardStatistic() {
  const [tab, setTab] = useState('week')
  const { data, isLoading, isError } = useStatisticData(tab)
  const { t } = useTranslation(['dashboard'])

  const statsData = [
    {
      title: t('newMember'),
      value: data?.data.users || 0,
      color: '#52c41a',
      icon: <Users size={24} />,
      gradient: 'from-green-400 to-green-600'
    },
    {
      title: t('revenue'),
      value: formatCurrency(data?.data.deposits) || 0,
      color: '#f5222d',
      icon: <DollarSign size={24} />,
      gradient: 'from-red-400 to-red-600'
    },
    {
      title: t('newPost'),
      value: data?.data.properties || 0,
      color: '#1890ff',
      icon: <FileText size={24} />,
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      title: t('newComment'),
      value: data?.data.comments || 0,
      color: '#722ed1',
      icon: <MessageSquare size={24} />,
      gradient: 'from-purple-400 to-purple-600'
    }
  ]

  if (isError) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-xl text-red-500'>Error fetching data. Please try again later.</p>
      </div>
    )
  }

  return (
    <>
      <Space className='mb-3 flex items-center'>
        <Typography.Title level={3} className='m-0'>
          {t('dashboardStatistic')}
        </Typography.Title>

        <Tooltip title={t('switchTime')}>
          <SwapOutlined className='text-base text-blue-500' onClick={() => setTab(tab === 'week' ? 'month' : 'week')} />
        </Tooltip>
      </Space>
      <Row gutter={[16, 16]} className='mb-4'>
        {statsData.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card
              className={`h-full bg-gradient-to-br ${stat.gradient} text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              classNames={{ body: 'p-4' }}
            >
              <div className='mb-4 flex items-center justify-between'>
                {stat.icon}
                <div className='flex flex-col items-end'>
                  <h3 className='m-0 p-0 text-lg font-semibold'>{stat.title}</h3>
                  <span className='text-xs text-gray-100'>/{tab === 'week' ? t('week') : t('month')}</span>
                </div>
              </div>
              <Statistic
                value={stat.value}
                valueStyle={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}
                prefix={null}
                suffix={null}
                loading={isLoading}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default DashboardStatistic
