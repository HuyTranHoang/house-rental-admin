import ErrorFetching from '@/components/ErrorFetching'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter.ts'
import { useDeleteMultiReview, useReviewFilters, useReviews } from '@/hooks/useReviews.ts'
import { Review, ReviewDataSource } from '@/models/review.type.ts'
import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ReviewTable from './ReviewTable'

const { Search } = Input

type OnChange = NonNullable<TableProps<ReviewDataSource>['onChange']>
type Filters = Parameters<OnChange>[1]
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListReview() {
  const { t } = useTranslation(['common', 'review'])

  const { search, rating, pageNumber, pageSize, sortBy, setFilters } = useReviewFilters()

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const [isOpen, setIsOpen] = useState(false)

  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const { data, isLoading, isError } = useReviews(search, rating, pageNumber, pageSize, sortBy)
  const formatDate = useCustomDateFormatter()

  const { deleteReviewsMutate, deleteReviewsIsPending } = useDeleteMultiReview()

  const handleTableChange: TableProps<ReviewDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      if (`${sorter.field}${order}` !== sortBy) setFilters({ sortBy: `${sorter.field}${order}` })
    }

    if (filters.rating) {
      const ratingFilter = filters.rating[0] as number
      if (ratingFilter !== rating) setFilters({ rating: filters.rating[0] as number })
    } else {
      setFilters({ rating: 0 })
      setFilteredInfo({})
    }
  }

  const dataSource: ReviewDataSource[] = data
    ? data.data.map((review: Review, idx) => ({
        ...review,
        key: review.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        createdAt: formatDate(review.createdAt)
      }))
    : []

  const rowSelection: TableRowSelection<ReviewDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_selectedRowKeys: React.Key[], selectedRows: ReviewDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  useEffect(() => {
    if (rating) {
      setFilteredInfo((prev) => ({
        ...prev,
        rating: [rating]
      }))
    }
  }, [rating])

  useEffect(() => {
    if (sortBy) {
      const match = sortBy.match(/(.*?)(Asc|Desc)$/)
      if (match) {
        const [, field, order] = match
        setSortedInfo({
          field,
          order: order === 'Asc' ? 'ascend' : 'descend'
        })
      }
    }
  }, [sortBy])

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align='center' justify='space-between' style={{ marginBottom: 12 }}>
        <Flex align='center'>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {t('review:title')}
          </Typography.Title>
          <Divider type='vertical' style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form
            name='serachReviewForm'
            initialValues={{
              search: search
            }}
            layout='inline'
          >
            <Form.Item name='search'>
              <Search
                allowClear
                onSearch={(value) => setFilters({ search: value })}
                placeholder={t('review:searchPlaceholder')}
                className='w-64'
              />
            </Form.Item>
          </Form>
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button shape='round' type='primary' danger onClick={() => setIsOpen(true)}>
              {t('common.multipleDelete')}
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
          showTotal: (total, range) => (
            <Trans
              ns={'review'}
              i18nKey='pagination.showTotal'
              values={{ total, rangeStart: range[0], rangeEnd: range[1] }}
            />
          ),
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
        filteredInfo={filteredInfo}
        sortedInfo={sortedInfo}
      />

      <MultipleDeleteConfirmModal
        deleteIdList={deleteIdList}
        isModalOpen={isOpen}
        pending={deleteReviewsIsPending}
        setIsModalOpen={setIsOpen}
        title={t('review:deleteModal.titleMultiple')}
        onOk={() => {
          deleteReviewsMutate(deleteIdList).then(() => {
            deleteIdList.length > 1
              ? toast.success(t('review:notification.deleteSuccess'))
              : toast.success(t('review:notification.deleteSuccessMultiple'))

            setIsOpen(false)
            setDeleteIdList([])
          })
        }}
      />
    </>
  )
}

export default ListReview
