import { Divider, Flex, TableProps, Tabs, TabsProps, Typography } from 'antd'
import Search from 'antd/lib/input/Search'
import { useState } from 'react'
import { Report as ReportType, ReportDataSource, ReportStatus } from '@/models/report.type.ts'
import { CheckCircleOutlined, CloseSquareOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useReports } from '@/hooks/useReports.ts'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import ReportTable from './ReportTable.tsx'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { useQueryClient } from '@tanstack/react-query'

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

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(ReportStatus.PENDING)
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('IdDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const { data, isLoading, isError }
    = useReports(search, category, status, pageNumber, pageSize, sortBy)

  const onTabChange = (key: string) => {
    setStatus(key as ReportStatus)
    queryClient.invalidateQueries({ queryKey: ['reports'] })
  }

  const handleTableChange: TableProps<ReportDataSource>['onChange'] = (_, filters, sorter) => {
    if (Array.isArray(sorter)) {
      setSortBy('createdAtDesc')
    } else {
      if (sorter.order) {
        const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
        setSortBy(`${sorter.field}${order}`)
      }
    }

    if (filters.category) {
      const result = filters.category.join(',');
      setCategory(result)
    } else {
      setCategory('')
    }
  }

  const dataSource: ReportDataSource[] = data
    ? data.data.map((report: ReportType, idx) => ({
      key: report.id,
      id: report.id,
      index: (pageNumber - 1) * pageSize + idx + 1,
      userId: report.userId,
      username: report.username,
      propertyId: report.propertyId,
      title: report.title,
      reason: report.reason,
      category: report.category,
      status: report.status,
      createdAt: customFormatDate(report.createdAt)
    }))
    : []

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>Danh sách báo cáo</Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search allowClear onSearch={(value) => setSearch(value)} placeholder="Tìm kiếm theo tên tài khoản"
                  style={{ width: 250 }} />
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
          onShowSizeChange: (_, size) => setPageSize(size),
          onChange: (page) => setPageNumber(page)
        }}
        handleTableChange={handleTableChange}
      />
    </>
  )
}

export default ListReport
