import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import { useDeleteReview } from '@/hooks/useReviews.ts'
import { ReviewDataSource } from '@/models/review.type.ts'
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
      label: 'Người đánh giá',
      children: <span>{currentReview?.userName}</span>,
      span: 3
    },
    {
      key: '3',
      label: 'Nội dung',
      children: <span>{currentReview?.comment}</span>,
      span: 3
    },
    {
      key: '4',
      label: 'Ngày tạo',
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
      title: 'Nguời đánh giá',
      width: 200,
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Bài đăng',
      dataIndex: 'propertyTitle',
      key: 'propertyTitle'
    },
    {
      title: 'Nội dung',
      dataIndex: 'comment',
      key: 'comment',
      width: 400
    },
    {
      title: 'Đánh giá',
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      fixed: 'right',
      width: 150
    },
    {
      title: 'Hành động',
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
            Chi tiết
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
            Xóa
          </Button>
        </div>
      )
    }
  ]

  const detailItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Người đánh giá',
      children: <span>{currentReview?.userName}</span>,
      span: 2
    },
    {
      key: '2',
      label: 'Ngày đánh giá',
      children: <span>{currentReview?.createdAt}</span>,
      span: 1
    },
    {
      key: '3',
      label: 'Tên bài đăng',
      children: <span>{currentReview?.propertyTitle}</span>,
      span: 3
    },
    {
      key: '4',
      label: 'Đánh giá',
      children: (
        <span>
          <Rate disabled defaultValue={currentReview?.rating} />
        </span>
      ),
      span: 3
    },
    {
      key: '5',
      label: 'Nội dung',
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
          locale: { items_per_page: '/ trang' },
          showSizeChanger: true,
          ...paginationProps
        }}
        onChange={handleTableChange}
        loading={loading}
        locale={{
          triggerDesc: 'Sắp xếp giảm dần',
          triggerAsc: 'Sắp xếp tăng dần',
          cancelSort: 'Hủy sắp xếp',
          filterConfirm: 'Lọc',
          filterReset: 'Bỏ lọc'
        }}
      />

      <Modal
        title='Chi tiết đánh giá'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        footer={
          <>
            <Button onClick={() => setIsModalOpen(false)}>Đóng</Button>
            <Button
              type='primary'
              danger
              onClick={() => {
                setIsDeleteModalOpen(true)
                setIsModalOpen(false)
              }}
            >
              Xóa
            </Button>
          </>
        }
      >
        <Descriptions bordered items={detailItems} />
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        className='w-96'
        title={<ConfirmModalTitle title='Xác nhận xóa đánh giá' />}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={() => {
          deleteReviewMutate(currentReview!.id)
          setIsDeleteModalOpen(false)
        }}
        okText='Xác nhận'
        okType='danger'
        cancelText='Hủy'
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default ReviewTable
