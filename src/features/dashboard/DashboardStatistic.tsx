import ErrorFetching from '@/components/ErrorFetching'
import { useStatisticData } from '@/hooks/useDashboard'
import { DollarOutlined, FileTextOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic, Tabs } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const iconStyle = (color: string) => ({
  backgroundColor: color,
  color: 'white',
  fontSize: 24,
  padding: 8,
  borderRadius: 20
})

function DashboardStatistic() {
  const [tab, setTab] = useState('week')
  const { data, isLoading: isLoading, isError } = useStatisticData(tab)
  const { t } = useTranslation(['dashboard'])

  const statsData = [
    {
      title: t('newMember'),
      value: data?.data.users || 0,
      color: '#52c41a',
      icon: <UserOutlined style={iconStyle('#52c41a')} />,
      prefix: <UserOutlined />
    },
    {
      title: t('revenue'),
      value: data?.data.deposits || 0,
      color: '#f5222d',
      icon: <DollarOutlined style={iconStyle('#f5222d')} />,
      prefix: <DollarOutlined />
    },
    {
      title: t('newPost'),
      value: data?.data.properties || 0,
      color: '#1890ff',
      icon: <FileTextOutlined style={iconStyle('#1890ff')} />,
      prefix: <FileTextOutlined />
    },
    {
      title: t('newComment'),
      value: data?.data.comments || 0,
      color: '#722ed1',
      icon: <MessageOutlined style={iconStyle('#722ed1')} />,
      prefix: <MessageOutlined />
    }
  ]

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Row gutter={18}>
        <Col xs={24} sm={8} lg={2}>
          <div className='mb-5 mt-5'>
            <Tabs
              defaultActiveKey='week'
              onChange={(key) => {
                setTab(key)
              }}
              tabPosition='left'
              items={[
                { label: t('week'), key: 'week' },
                { label: t('month'), key: 'month' }
              ]}
            />
          </div>
        </Col>

        {statsData.map((stat, index) => (
          <Col key={index} xs={24} sm={16} lg={5}>
            <Card className='mb-4 shadow-md transition-shadow duration-300 hover:shadow-lg'>
              <Statistic
                title={
                  <span>
                    {stat.icon} {stat.title}
                  </span>
                }
                value={stat.value}
                precision={0}
                valueStyle={{ color: stat.color }}
                prefix={stat.prefix}
                suffix=''
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
