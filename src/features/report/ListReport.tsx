import { Divider, Flex, Form, Input, TableProps, Tabs, TabsProps, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Report as ReportType, ReportDataSource, ReportStatus } from '@/models/report.type.ts'
import { CheckCircleOutlined, CloseSquareOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useReportFilters, useReports } from '@/hooks/useReports.ts'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import ReportTable from './ReportTable.tsx'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { useQueryClient } from '@tanstack/react-query'

const { Search } = Input

type OnChange = NonNullable<TableProps<ReportDataSource>['onChange']>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const tabsItem: TabsProps['items'] = [
  {
    key: ReportStatus.PENDING,
    label: 'Chờ xử lý',
    icon: <InfoCircleOutlined />
  },
  {
    key: ReportStatus.APPROVED,
    label: 'Đã duyệt',
    icon: <CheckCircleOutlined />
  },
  {
    key: ReportStatus.REJECTED,
    label: 'Đã từ chối',
    icon: <CloseSquareOutlined />
  }
]

function ListReport() {

  const queryClient = useQueryClient()

  const { search, status, category, sortBy, pageNumber, pageSize, setFilters } = useReportFilters()

  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [form] = Form.useForm()

  const { data, isLoading, isError }
    = useReports(search, category, status, pageNumber, pageSize, sortBy)

  const onTabChange = (key: string) => {
    setFilters({ status: key as ReportStatus })
    queryClient.invalidateQueries({ queryKey: ['reports'] }).then()
  }

  const handleTableChange: TableProps<ReportDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }

    if (filters.category) {
      const result = filters.category.join(',')
      setFilters({ category: result })
    }
  }

  const dataSource: ReportDataSource[] = data
    ? data.data.map((report: ReportType, idx) => ({
      ...report,
      key: report.id,
      index: (pageNumber - 1) * pageSize + idx + 1,
      createdAt: customFormatDate(report.createdAt)
    }))
    : []

  useEffect(() => {
    if (search) {
      form.setFieldsValue({ search })
    }
  }, [form, search])

  useEffect(() => {
    if (category) {
      setFilteredInfo(prev => ({
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
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>Danh sách báo cáo</Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form form={form} name="searchReportForm" layout="inline">
            <Form.Item name="search">
              <Search
                allowClear
                onSearch={(value) => setFilters({ search: value })}
                placeholder="Tìm kiếm theo tên tài khoản"
                style={{ width: 250 }}
              />
            </Form.Item>
          </Form>
        </Flex>
      </Flex>


      <Tabs defaultActiveKey={ReportStatus.PENDING} items={tabsItem} onChange={onTabChange} />
      <ReportTable
        dataSource={dataSource}
        loading={isLoading}
        status={status}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} thành phố`,
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

export default ListReport
