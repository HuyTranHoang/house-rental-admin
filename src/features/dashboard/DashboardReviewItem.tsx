import ErrorFetching from '@/components/ErrorFetching'
import ROUTER_NAMES from '@/constant/routerNames'
import { usePendingData } from '@/hooks/useDashboard'
import {
  FileDoneOutlined,
  FileTextOutlined,
  FrownOutlined,
  InfoCircleOutlined,
  MessageOutlined
} from '@ant-design/icons'
import { Card, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const iconStyle = (color: string) => ({
  backgroundColor: color,
  color: 'white',
  fontSize: 24,
  padding: 8,
  borderRadius: 20
})

export function DashboardReviewItem() {
  const { data, isLoading, isError } = usePendingData()
  const { t } = useTranslation(['dashboard'])
  const navigate = useNavigate()
  
  const statsData = [
    {
      title: t('posts'),
      value: data?.data.properties || 0,
      color: '#048d7f',
      icon: <FileDoneOutlined style={iconStyle('#048d7f')} />,
      prefix: <FileTextOutlined />,
      path: ROUTER_NAMES.PROPERTY
    },
    {
      title: t('reportPosts'),
      value: data?.data.reports || 0,
      color: '#d1a32e',
      icon: <InfoCircleOutlined style={iconStyle('#d1a32e')} />,
      prefix: <MessageOutlined />,
      path: ROUTER_NAMES.REPORT
    },
    {
      title: t('reportComment'),
      value: data?.data.commentReports || 0,
      color: '#d12e6d',
      icon: <FrownOutlined style={iconStyle('#d12e6d')} />,
      prefix: <MessageOutlined />,
      path: ROUTER_NAMES.COMMENT_REPORT
    }
  ]

  if (isError) {
    return <ErrorFetching />
  }
  return (
    <>
      <Card className='mb-2 h-16 w-full text-base font-bold'>{t('approvalRequest')}</Card>
      {statsData.map((stat, index) => (
        <Row key={index} className='w-100'>
          <Card className='mb-2 ml-0 h-24 w-full shadow-md transition-shadow duration-300 hover:shadow-lg cursor-pointer'
            onClick={() => navigate(stat.path)} loading={isLoading}>
            <div>
              <div className='flex justify-between'>
                <span className='ml-2 text-base'>
                  {stat.icon} {stat.title}
                </span>
                <span className='ml-2 text-2xl' style={{ color: stat.color }}>
                  {stat.prefix} {stat.value}
                </span>
              </div>
            </div>
          </Card>
        </Row>
      ))}
    </>
  )
}
