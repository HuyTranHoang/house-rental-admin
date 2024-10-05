import ErrorFetching from '@/components/ErrorFetching'
import { useStatisticData } from '@/hooks/useDashboard'
import { DollarOutlined, FileTextOutlined, LoadingOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'

const iconStyle = (color: string) => ({
  backgroundColor: color,
  color: 'white',
  fontSize: 24,
  padding: 8,
  borderRadius: 20
})

function DashboardStatistic() {
  const { data, isLoading: isLoading, isError } = useStatisticData('week')
  const statsData = [
    {
      title: 'Thành viên mới',
      value: data?.data.users || 0,
      color: '#52c41a',
      icon: <UserOutlined style={iconStyle('#52c41a')} />,
      prefix: <UserOutlined />
    },
    {
      title: 'Doanh thu',
      value: data?.data.deposits || 0,
      color: '#f5222d',
      icon: <DollarOutlined style={iconStyle('#f5222d')} />,
      prefix: <DollarOutlined />
    },
    {
      title: 'Số bài đăng mới',
      value: data?.data.properties || 0,
      color: '#1890ff',
      icon: <FileTextOutlined style={iconStyle('#1890ff')} />,
      prefix: <FileTextOutlined />
    },
    {
      title: 'Nhận xét mới',
      value: data?.data.comments || 0,
      color: '#722ed1',
      icon: <MessageOutlined style={iconStyle('#722ed1')} />,
      prefix: <MessageOutlined />
    }
  ]

  if (isLoading) {
    return <LoadingOutlined/>
  }
  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Card className='font-bold text-base h-16 w-100'>Thống Kê Tuần</Card>
      <Row gutter={16}>
        {statsData.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
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
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default DashboardStatistic
