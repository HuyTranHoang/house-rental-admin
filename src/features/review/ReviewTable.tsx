import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import { useDeleteReview } from '@/hooks/useReviews.ts'
import { ReviewDataSource } from '@/types/review.type.ts'
import { blue } from '@ant-design/colors'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Modal,
  Rate,
  Space,
  Table,
  TablePaginationConfig,
  TableProps
} from 'antd'
import { FilterValue, TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ReviewTableProps {
  dataSource: ReviewDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<ReviewDataSource>['onChange']
  rowSelection: TableRowSelection<ReviewDataSource> | undefined
  filteredInfo: Record<string, FilterValue | null>
  sortedInfo: SorterResult<ReviewDataSource>
}

function ReviewTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  filteredInfo,
  sortedInfo
}: ReviewTableProps) {
  const { t } = useTranslation(['common', 'review'])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState<ReviewDataSource | null>(null)

  const handleView = (record: ReviewDataSource) => {
    setCurrentReview(record)
    setIsModalOpen(true)
  }

  const { deleteReviewMutate } = useDeleteReview()

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Id',
      children: <span>{currentReview?.id}</span>,
      span: 3
    },
    {
      key: '2',
      label: t('review:table.userName'),
      children: <span>{currentReview?.userName}</span>,
      span: 3
    },
    {
      key: '3',
      label: t('review:table.comment'),
      children: <span>{currentReview?.comment}</span>,
      span: 3
    },
    {
      key: '4',
      label: t('common.table.createdAt'),
      children: <span>{currentReview?.createdAt}</span>,
      span: 3
    }
  ]

  const columns: TableProps<ReviewDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: t('review:table.userName'),
      width: 200,
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: t('review:table.propertyTitle'),
      dataIndex: 'propertyTitle',
      key: 'propertyTitle'
    },
    {
      title: t('review:table.comment'),
      dataIndex: 'comment',
      key: 'comment',
      width: 400
    },
    {
      title: t('review:table.rating'),
      dataIndex: 'rating',
      width: 200,
      key: 'rating',
      sorter: true,
      sortOrder: sortedInfo.field === 'rating' ? sortedInfo.order : null,
      filterMultiple: false,
      filteredValue: filteredInfo.rating || null,
      filters: [
        {
          text: (
            <Space>
              1 <Rate disabled defaultValue={1} />
            </Space>
          ),
          value: 1
        },
        {
          text: (
            <Space>
              2 <Rate disabled defaultValue={2} />
            </Space>
          ),
          value: 2
        },
        {
          text: (
            <Space>
              3 <Rate disabled defaultValue={3} />
            </Space>
          ),
          value: 3
        },
        {
          text: (
            <Space>
              4 <Rate disabled defaultValue={4} />
            </Space>
          ),
          value: 4
        },
        {
          text: (
            <Space>
              5 <Rate disabled defaultValue={5} />
            </Space>
          ),
          value: 5
        }
      ],
      render: (rating: number) => <Rate disabled defaultValue={rating} />
    },
    {
      title: t('common.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      fixed: 'right',
      width: 150
    },
    {
      title: t('common.table.action'),
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record: ReviewDataSource) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Button
            icon={<EyeOutlined />}
            type='default'
            style={{ borderColor: blue.primary, color: blue.primary, marginRight: '1rem' }}
            onClick={() => handleView(record)}
          >
            {t('common.detail')}
          </Button>
          <Button
            icon={<DeleteOutlined />}
            type='default'
            onClick={() => {
              setCurrentReview(record)
              setIsDeleteModalOpen(true)
            }}
            danger
          >
            {t('common.delete')}
          </Button>
        </div>
      )
    }
  ]

  const detailItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: t('review:table.userName'),
      children: <span>{currentReview?.userName}</span>,
      span: 2
    },
    {
      key: '2',
      label: t('common.table.createdAt'),
      children: <span>{currentReview?.createdAt}</span>,
      span: 1
    },
    {
      key: '3',
      label: t('review:table.propertyTitle'),
      children: <span>{currentReview?.propertyTitle}</span>,
      span: 3
    },
    {
      key: '4',
      label: t('review:table.rating'),
      children: (
        <span>
          <Rate disabled defaultValue={currentReview?.rating} />
        </span>
      ),
      span: 3
    },
    {
      key: '5',
      label: t('review:table.comment'),
      children: <span>{currentReview?.comment}</span>
    }
  ]

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowSelection={{ ...rowSelection }}
        pagination={{
          position: ['bottomCenter'],
          pageSizeOptions: ['5', '10', '20'],
          locale: { items_per_page: `/ ${t('common.pagination.itemsPerPage')}` },
          showSizeChanger: true,
          ...paginationProps
        }}
        onChange={handleTableChange}
        loading={loading}
        locale={{
          triggerDesc: t('common.table.triggerDesc'),
          triggerAsc: t('common.table.triggerAsc'),
          cancelSort: t('common.table.cancelSort'),
          filterConfirm: t('common.table.filterConfirm'),
          filterReset: t('common.table.filterReset'),
        }}
      />

      <Modal
        title={t('review:detailModal.title')}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        footer={
          <>
            <Button onClick={() => setIsModalOpen(false)}>{t('common.back')}</Button>
            <Button
              type='primary'
              danger
              onClick={() => {
                setIsDeleteModalOpen(true)
                setIsModalOpen(false)
              }}
            >
              {t('common.delete')}
            </Button>
          </>
        }
      >
        <Descriptions bordered items={detailItems} />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        className='w-96'
        title={<ConfirmModalTitle title={t('review:deleteModal.title')} />}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={() => {
          deleteReviewMutate(currentReview!.id)
          setIsDeleteModalOpen(false)
        }}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default ReviewTable
