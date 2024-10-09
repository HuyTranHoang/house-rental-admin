import { getCommentById } from '@/api/comment.api'
import { useUpdateCommentReportStatus } from '@/hooks/useCommentReports'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter'
import {
  CommentReport,
  CommentReportCategory,
  CommentReportDataSource,
  CommentReportStatus
} from '@/types/commentReport.type.ts'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  ConfigProvider,
  Descriptions,
  DescriptionsProps,
  Modal,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
  Typography
} from 'antd'
import { FilterValue } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useBoundStore from '@/store.ts'
import { hasAuthority } from '@/utils/filterMenuItem.ts'

interface CommentReportTableProps {
  dataSource: CommentReportDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<CommentReportDataSource>['onChange']
  status: CommentReportStatus
  filteredInfo: Record<string, FilterValue | null>
  sortedInfo: SorterResult<CommentReportDataSource>
}

function CommentReportTable({
  dataSource,
  loading,
  status,
  paginationProps,
  handleTableChange,
  filteredInfo,
  sortedInfo
}: CommentReportTableProps) {
  const currentUser = useBoundStore((state) => state.user)

  const [commentId, setCommentId] = useState<number>(0)
  const [commentReport, setCommentReport] = useState<CommentReport>({} as CommentReport)

  const [open, setOpen] = useState(false)

  const { updateCommentReportStatusMutate, updateCommentReportStatusPending } = useUpdateCommentReportStatus()
  const formatDate = useCustomDateFormatter()
  const { t } = useTranslation(['common', 'commentReport', 'comment'])

  const categoryMap = useMemo(
    () => ({
      [CommentReportCategory.SCAM]: [t('commentReport:category.scam'), 'magenta'],
      [CommentReportCategory.INAPPROPRIATE_CONTENT]: [t('commentReport:category.inappropriateContent'), 'red'],
      [CommentReportCategory.DUPLICATE]: [t('commentReport:category.duplicate'), 'volcano'],
      [CommentReportCategory.MISINFORMATION]: [t('commentReport:category.misinformation'), 'orange'],
      [CommentReportCategory.OTHER]: [t('commentReport:category.other'), 'gold']
    }),
    [t]
  )

  const {
    data: commentData,
    isLoading: commentIsLoading,
    isError: commentIsError
  } = useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => getCommentById(commentId),
    enabled: !!commentId
  })

  const ModalFooter = (
    <Space>
      {status === CommentReportStatus.PENDING && (
        <>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00b96b'
              }
            }}
          >
            <Button
              loading={updateCommentReportStatusPending}
              onClick={() => {
                updateCommentReportStatusMutate({ id: commentReport.id, status: CommentReportStatus.APPROVED })
                setOpen(false)
              }}
              disabled={!hasAuthority(currentUser,'commentReport:update')}
              icon={<CheckOutlined />}
              type='primary'
            >
              {t('commentReport:button.approve')}
            </Button>
          </ConfigProvider>
          <Button
            loading={updateCommentReportStatusPending}
            onClick={() => {
              updateCommentReportStatusMutate({ id: commentReport.id, status: CommentReportStatus.REJECTED })
              setOpen(false)
            }}
            disabled={!hasAuthority(currentUser,'commentReport:update')}
            icon={<CloseOutlined />}
            danger
          >
            {t('commentReport:button.reject')}
          </Button>
        </>
      )}
      <Button onClick={() => setOpen(false)}>{t('common.back')}</Button>
    </Space>
  )

  const modalItems: DescriptionsProps['items'] = [
    {
      key: 'userName',
      label: t('commentReport:table.username'),
      children: <span>{commentData?.userName}</span>,
      span: 3
    },
    {
      key: 'category',
      label: t('commentReport:table.comment'),
      children: <span>{commentData?.comment}</span>,
      span: 3
    },
    {
      key: 'comment',
      label: t('common.table.createdAt'),
      children: <span>{formatDate(commentData?.createdAt)}</span>,
      span: 3
    }
  ]

  const modalReportItems: DescriptionsProps['items'] = [
    {
      key: 'usernameReport',
      label: t('commentReport:detailModal.username'),
      children: commentReport?.username,
      span: 2
    },
    {
      key: 'category',
      label: t('commentReport:table.category'),
      children: commentReport.category && categoryMap[commentReport.category] ? (
        <Tag color={categoryMap[commentReport.category][1]}>
          {categoryMap[commentReport.category][0]}
        </Tag>
      ) : null,
      span: 1
    },
    {
      key: 'reason',
      label: t('commentReport:table.reason'),
      children: commentReport?.reason,
      span: 3
    },
    {
      key: 'createdAt',
      label: t('commentReport:detailModal.createdAt'),
      children: commentReport?.createdAt,
      span: 3
    }
  ]

  const columns: TableProps<CommentReportDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50
    },
    {
      title: t('commentReport:table.username'),
      dataIndex: 'username',
      key: 'username',
      width: 200,
      sorter: true,
      sortOrder: sortedInfo.field === 'username' ? sortedInfo.order : null
    },
    {
      title: t('commentReport:table.comment'),
      dataIndex: 'comment',
      key: 'comment',
      render: (text: string, record) => (
        <Button
          onClick={() => {
            setOpen(!open)
            setCommentId(record.commentId)
            setCommentReport(record)
          }}
          type='link'
        >
          {text}
        </Button>
      )
    },
    {
      title: t('commentReport:table.category'),
      dataIndex: 'category',
      key: 'category',
      sorter: true,
      width: 150,
      sortOrder: sortedInfo.field === 'category' ? sortedInfo.order : null,
      filters: [
        { text: t('commentReport:category.scam'), value: CommentReportCategory.SCAM },
        { text: t('commentReport:category.inappropriateContent'), value: CommentReportCategory.INAPPROPRIATE_CONTENT },
        { text: t('commentReport:category.duplicate'), value: CommentReportCategory.DUPLICATE },
        { text: t('commentReport:category.misinformation'), value: CommentReportCategory.MISINFORMATION },
        { text: t('commentReport:category.other'), value: CommentReportCategory.OTHER }
      ],
      filteredValue: filteredInfo.category || null,
      render: (category: CommentReportCategory) => {
        const [text, color] = categoryMap[category]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: t('commentReport:table.status'),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: CommentReportStatus) => {
        const statusMap = {
          [CommentReportStatus.PENDING]: [t('commentReport:status.pending'), 'blue'],
          [CommentReportStatus.APPROVED]: [t('commentReport:status.approved'), 'green'],
          [CommentReportStatus.REJECTED]: [t('commentReport:status.rejected'), 'red']
        }
        const [text, color] = statusMap[status]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: t('commentReport:table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      width: 200
    }
  ]

  if (status === CommentReportStatus.PENDING) {
    columns.push({
      title: t('commentReport:table.action'),
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setOpen(!open)
              setCommentId(record.commentId)
              setCommentReport(record)
            }}
          >
            {t('commentReport:button.review')}
          </Button>
        </Space>
      )
    })
  }

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          pageSizeOptions: ['5', '10', '20'],
          locale: { items_per_page: `/ ${t('common:common.pagination.itemsPerPage')}` },
          showSizeChanger: true,
          ...paginationProps
        }}
        onChange={handleTableChange}
        loading={loading || updateCommentReportStatusPending}
        locale={{
          triggerDesc: t('common.table.triggerDesc'),
          triggerAsc: t('common.table.triggerAsc'),
          cancelSort: t('common.table.cancelSort'),
          filterReset: t('common.table.filterReset'),
          filterConfirm: t('common.table.filterConfirm')
        }}
      />

      {commentIsError && (
        <Modal title='Error' open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)} width={1000}>
          <p>Something went wrong</p>
        </Modal>
      )}

      {commentData && (
        <Modal open={open} footer={ModalFooter} onCancel={() => setOpen(false)} loading={commentIsLoading} width={1000}>
          <Typography.Title level={4}>{t('commentReport:detailModal.title')}</Typography.Title>

          <Descriptions bordered items={modalItems} />

          <Typography.Title level={4}>{t('commentReport:detailModal.content')}</Typography.Title>

          {commentReport && <Descriptions bordered items={modalReportItems} />}
        </Modal>
      )}
    </>
  )
}

export default CommentReportTable
