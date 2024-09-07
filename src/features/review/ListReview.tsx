import React, { useState } from 'react'
import { Review, ReviewDataSource } from '@/models/review.type.ts'
import { useDeleteMultiReview, useReviews } from '@/hooks/useReviews.ts'
import { Button, Divider, Flex, Input, Space, TableProps, Typography } from 'antd'
import ErrorFetching from '@/components/ErrorFetching'
import ReviewTable from './ReviewTable'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { showMultipleDeleteConfirm } from '@/components/ConfirmMultipleDeleteConfig'

const { Search } = Input

function ListReview() {
  const [search, setSearch] = useState('')
  const [rating, setRating] = useState(0)
  const [sortBy, setSortBy] = useState('IdDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useReviews(search, rating, pageNumber, pageSize, sortBy)

  const { deleteReviewsMutate } = useDeleteMultiReview()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các đánh giá', () => {
      deleteReviewsMutate(deleteIdList)
      setDeleteIdList([])
    })
  }

  const handleTableChange: TableProps<ReviewDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setSortBy(`${sorter.field}${order}`)
    }

    if (filters.rating) {
      setRating(filters.rating[0] as number)
    } else {
      setRating(0)
    }
  }

  const dataSource: ReviewDataSource[] = data
    ? data.data.map((review: Review, idx) => ({
        ...review,
        key: review.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        createdAt: customFormatDate(review.createdAt)
      }))
    : []

  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: ReviewDataSource[]) => {
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
            placeholder='Tìm kiếm theo tài khoản, bài đăng'
            style={{ width: 300 }}
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
