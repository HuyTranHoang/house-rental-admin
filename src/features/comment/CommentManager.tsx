import ErrorFetching from '@/components/ErrorFetching'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import { useComments, useDeleteMultiComment, useReviewFilters } from '@/hooks/useComments.ts'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter.ts'
import useBoundStore from '@/store.ts'
import { Comment, CommentDataSource } from '@/types/comment.type.ts'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import CommentTable from './CommentTable.tsx'

const { Search } = Input

type OnChange = NonNullable<TableProps<CommentDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function CommentManager() {
  const currentUser = useBoundStore((state) => state.user)

  const { t } = useTranslation(['common', 'comment'])

  const { search, pageNumber, pageSize, sortBy, setFilters } = useReviewFilters()

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const [isOpen, setIsOpen] = useState(false)

  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const { data, isLoading, isError } = useComments(search, pageNumber, pageSize, sortBy)
  const formatDate = useCustomDateFormatter()

  const { deleteCommentsMutate, deleteCommentsIsPending } = useDeleteMultiComment()

  const handleTableChange: TableProps<CommentDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      if (`${sorter.field}${order}` !== sortBy) setFilters({ sortBy: `${sorter.field}${order}` })
    }
  }

  const dataSource: CommentDataSource[] = data
    ? data.data.map((review: Comment, idx) => ({
        ...review,
        key: review.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        createdAt: formatDate(review.createdAt)
      }))
    : []

  const rowSelection: TableRowSelection<CommentDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_selectedRowKeys: React.Key[], selectedRows: CommentDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

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
            {t('comment:title')}
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
                placeholder={t('comment:searchPlaceholder')}
                className='w-64'
              />
            </Form.Item>
          </Form>
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button
              shape='round'
              type='primary'
              danger
              disabled={!hasAuthority(currentUser, 'comment:delete')}
              onClick={() => setIsOpen(true)}
            >
              {t('common.multipleDelete')}
            </Button>
          )}
        </Space>
      </Flex>

      <CommentTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => (
            <Trans
              ns={'comment'}
              i18nKey='pagination.showTotal'
              values={{ total, rangeStart: range[0], rangeEnd: range[1] }}
            />
          ),
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
        sortedInfo={sortedInfo}
      />

      <MultipleDeleteConfirmModal
        deleteIdList={deleteIdList}
        isModalOpen={isOpen}
        pending={deleteCommentsIsPending}
        setIsModalOpen={setIsOpen}
        title={t('comment:deleteModal.titleMultiple')}
        onOk={() => {
          deleteCommentsMutate(deleteIdList).then(() => {
            deleteIdList.length > 1
              ? toast.success(t('comment:notification.deleteSuccess'))
              : toast.success(t('comment:notification.deleteSuccessMultiple'))

            setIsOpen(false)
            setDeleteIdList([])
          })
        }}
      />
    </>
  )
}

export default CommentManager
