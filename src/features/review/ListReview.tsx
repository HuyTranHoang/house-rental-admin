import { useState } from 'react'
import { Review } from '../../models/review.type'
import { useDeleteMultiReview, useReviews } from '../../hooks/useReviews'
import { Button, Divider, Flex, Input, Space, TableProps, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import ErrorFetching from '../../components/ErrorFetching'
import ReviewTable from './ReviewTable'
import { customFormatDate } from '../../utils/customFormatDate'
import { showMultipleDeleteConfirm } from '../../components/ConfirmMultipleDeleteConfig'

type DataSourceType = Review & {
  key: React.Key
}

const { Search } = Input

function ListReview() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('IdDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useReviews(search, pageNumber, pageSize, sortBy)

  const { deleteReviewsMutate } = useDeleteMultiReview()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các đánh giá', () => {
      deleteReviewsMutate(deleteIdList)
      setDeleteIdList([])
    })
  }

  const handleTableChange: TableProps<DataSourceType>['onChange'] = (_, __, sorter) => {
    if (Array.isArray(sorter)) {
      setSortBy('createdAtDesc')
    } else {
      if (sorter.order) {
        const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
        setSortBy(`${sorter.field}${order}`)
      }
    }
  }

  const dataSource: DataSourceType[] = data
    ? data.data.map((review: Review, index) => ({
        key: review.id,
        id: review.id,
        index: (pageNumber - 1) * pageSize + index + 1,
        userId: review.userId,
        username: review.userName,
        propertyId: review.propertyId,
        title: review.propertyTitle,
        rating: review.rating,
        createdAt: customFormatDate(review.createdAt),
        comment: review.comment
      }))
    : []

  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: DataSourceType[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align='center' justify='space-between' style={{ marginBottom: 12 }}>
        <Flex align='center'>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Danh sách đánh giá
          </Typography.Title>
          <Divider type='vertical' style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search
            allowClear
            onSearch={(value) => setSearch(value)}
            placeholder='Tìm kiếm theo tài khoản'
            style={{ width: 250 }}
          />
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button shape='round' type='primary' danger onClick={handleDelete}>
              Xóa các mục đã chọn
            </Button>
          )}
        </Space>
      </Flex>

      <ReviewTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} tiện nghi`,
          onShowSizeChange: (_, size) => setPageSize(size),
          onChange: (page) => setPageNumber(page)
        }}
        handleTableChange={handleTableChange}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
      />
    </>
  )
}

export default ListReview
