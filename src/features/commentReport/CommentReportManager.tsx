import ErrorFetching from '@/components/ErrorFetching'
import { useCommentReportFilters, useCommentReports } from '@/hooks/useCommentReports'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter'
import {
  CommentReportDataSource,
  CommentReportStatus,
  CommentReport as CommentReportType
} from '@/types/commentReport.type.ts'
import { CheckCircleOutlined, CloseSquareOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Divider, Flex, Form, Input, TableProps, Tabs, TabsProps, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import CommentReportTable from './CommentReportTable'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import useBoundStore from '@/store.ts'
import { useNavigate } from 'react-router-dom'

const { Search } = Input

type OnChange = NonNullable<TableProps<CommentReportDataSource>['onChange']>
type Filters = Parameters<OnChange>[1]
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function CommentReportManager() {
  const currentUser = useBoundStore((state) => state.user)
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const { t } = useTranslation(['common', 'commentReport'])

  const { search, status, category, sortBy, pageNumber, pageSize, setFilters } = useCommentReportFilters()
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})
  const [form] = Form.useForm()

  const { data, isLoading, isError } = useCommentReports(search, category, status, pageNumber, pageSize, sortBy)
  const formatDate = useCustomDateFormatter()

  const tabsItem: TabsProps['items'] = useMemo(
    () => [
      {
        key: CommentReportStatus.PENDING,
        label: t('commentReport:status.pending'),
        icon: <InfoCircleOutlined />
      },
      {
        key: CommentReportStatus.APPROVED,
        label: t('commentReport:status.approved'),
        icon: <CheckCircleOutlined />
      },
      {
        key: CommentReportStatus.REJECTED,
        label: t('commentReport:status.rejected'),
        icon: <CloseSquareOutlined />
      }
    ],
    [t]
  )

  const onTabChange = (key: string) => {
    setFilters({ status: key as CommentReportStatus })
    queryClient.invalidateQueries({ queryKey: ['commentReports'] }).then()
  }

  const handleTableChange: TableProps<CommentReportDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      if (`${sorter.field}${order}` !== sortBy) setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }

    if (filters.category) {
      const result = filters.category.join(',')
      if (result !== category) setFilters({ category: result })
    } else {
      setFilters({ category: '' })
      setFilteredInfo({})
    }
  }

  const dataSource: CommentReportDataSource[] = data
    ? data.data.map((commentReport: CommentReportType, idx) => ({
        ...commentReport,
        key: commentReport.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        createdAt: formatDate(commentReport.createdAt)
      }))
    : []

  useEffect(() => {
    if (!hasAuthority(currentUser,'commentReport:read')) {
      navigate(ROUTER_NAMES.DASHBOARD)
    }
  },[currentUser, navigate])

  useEffect(() => {
    if (search) {
      form.setFieldsValue({ search })
    }
  }, [form, search])

  useEffect(() => {
    if (category) {
      setFilteredInfo((prev) => ({
        ...prev,
        category: category.split(',')
      }))
    }
  }, [category])

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
      <Flex align='center' justify='space-between' className='mb-3'>
        <Flex align='center'>
          <Typography.Title level={2} className='m-0'>
            {t('commentReport:title')}
          </Typography.Title>
          <Divider type='vertical' className='mx-4 h-10 bg-gray-600' />
          <Form
            form={form}
            name='searchCityForm'
            initialValues={{
              search: search
            }}
            layout='inline'
          >
            <Form.Item name='search'>
              <Search
                allowClear
                onSearch={(value) => setFilters({ search: value })}
                placeholder={t('commentReport:searchPlaceholder')}
                className='w-64'
              />
            </Form.Item>
          </Form>
        </Flex>
      </Flex>

      <Tabs defaultActiveKey={CommentReportStatus.PENDING} items={tabsItem} onChange={onTabChange} />
      <CommentReportTable
        dataSource={dataSource}
        loading={isLoading}
        status={status}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => (
            <Trans
              ns={'report'}
              i18nKey='pagination.showTotal'
              values={{ total, rangeStart: range[0], rangeEnd: range[1] }}
            />
          ),
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
        handleTableChange={handleTableChange}
        filteredInfo={filteredInfo}
        sortedInfo={sortedInfo}
      />
    </>
  )
}

export default CommentReportManager
