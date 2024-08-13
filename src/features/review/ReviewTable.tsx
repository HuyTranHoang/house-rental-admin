import { Button, DescriptionsProps, Modal, Rate, Table, TablePaginationConfig, TableProps } from 'antd'
import { ReviewDataSource } from '@/models/review.type.ts'
import { TableRowSelection } from 'antd/es/table/interface'
import { useState } from 'react'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import ConfirmModalContent from '@/components/ConfirmModalContent'
import { useDeleteReview } from '@/hooks/useReviews.ts'

const { confirm } = Modal

interface ReviewTableProps {
  dataSource: ReviewDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<ReviewDataSource>['onChange']
  rowSelection: TableRowSelection<ReviewDataSource> | undefined
}

function ReviewTable({ dataSource, loading, paginationProps, handleTableChange, rowSelection }: ReviewTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState<ReviewDataSource | null>(null)

  const handleView = (record: ReviewDataSource) => {
    setCurrentReview(record)
    setIsModalOpen(true)
  }

  const { deleteReviewMutate } = useDeleteReview()

  const showDeleteConfirm = (record: ReviewDataSource) => {

    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: 'Id',
        children: <span>{record.id}</span>,
        span: 3
      },
      {
        key: '2',
        label: 'Người đánh giá',
        children: <span>{record.userName}</span>,
        span: 3
      },
      {
        key: '3',
        label: 'Nội dung',
        children: <span>{record.comment}</span>,
        span: 3
      },
      {
        key: '4',
        label: 'Ngày tạo',
        children: <span>{record.createdAt}</span>,
        span: 3
      }
    ]

    confirm({
      icon: null,
      title: <ConfirmModalTitle title="Xác nhận xóa đánh giá" />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deleteReviewMutate(record.id)
      }
    })
  }


  const columns: TableProps<ReviewDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: 'Tài khoản',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: 'Nội dung',
      dataIndex: 'comment',
      key: 'comment'
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      render: (rating: number) => <Rate disabled defaultValue={rating} />
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record: ReviewDataSource) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',  }}>
          <Button icon={<EyeOutlined/>}
                    type='default' style={{ borderColor: '#1890ff', color: '#1890ff', marginRight: "1rem" }}
                    onClick={() => handleView(record)}
          />
          <Button icon={<DeleteOutlined />} type='default' onClick={() => showDeleteConfirm(record)} danger>
            Xóa
          </Button>
        </div>
      )
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
          cancelSort: 'Hủy sắp xếp'
        }}
      />

      <Modal title='Chi tiết đánh giá' open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} >
        {currentReview && (
          <div>
            <p>
              <strong>Tài khoản:</strong> {currentReview.userName}
            </p>
            <p>
              <strong>Ngày đăng:</strong> {currentReview.createdAt}
            </p>
            <p>
              <strong>Bài đăng:</strong> {currentReview.propertyTitle}
            </p>
            <p>
              <strong>Đánh giá:</strong> <Rate disabled value={currentReview.rating} />
            </p>
            <p>
              <strong>Nội dung:</strong> {currentReview.comment}
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}

export default ReviewTable
