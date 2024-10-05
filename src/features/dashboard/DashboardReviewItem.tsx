import ROUTER_NAMES from '@/constant/routerNames.ts'
import { usePendingData } from '@/hooks/useDashboard'
import { List } from 'antd'
import { AlertTriangle, ArrowRight, FileCheck, MessageSquare } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

function DashboardReviewItem() {
  const { data, isLoading, isError } = usePendingData()
  const { t } = useTranslation(['dashboard'])
  const navigate = useNavigate()

  const statsData = [
    {
      title: t('posts'),
      value: data?.data.properties || 0,
      color: '#048d7f',
      icon: <FileCheck size={24} className='ml-2 text-green-500' />,
      path: ROUTER_NAMES.PROPERTY
    },
    {
      title: t('reportPosts'),
      value: data?.data.reports || 0,
      color: '#d1a32e',
      icon: <AlertTriangle size={24} className='ml-2 text-yellow-500' />,
      path: ROUTER_NAMES.REPORT
    },
    {
      title: t('reportComment'),
      value: data?.data.commentReports || 0,
      color: '#d12e6d',
      icon: <MessageSquare size={24} className='ml-2 text-red-500' />,
      path: ROUTER_NAMES.COMMENT_REPORT
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
    <List
      loading={isLoading}
      itemLayout='horizontal'
      dataSource={statsData}
      className='h-full rounded-lg bg-white p-4 shadow-md'
      renderItem={(item) => (
        <List.Item onClick={() => navigate(item.path)} className='group cursor-pointer hover:bg-gray-100'>
          <List.Item.Meta
            avatar={item.icon}
            title={item.title}
            description={
              item.value > 0 ? (
                <Trans ns='dashboard' i18nKey='pendingReview' values={{ value: item.value }} />
              ) : (
                t('noPendingReview')
              )
            }
          />
          <div className='mr-4'>
            <ArrowRight className='transition-transform group-hover:translate-x-1' />
          </div>
        </List.Item>
      )}
    />
  )
}

export default DashboardReviewItem
