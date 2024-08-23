import { Divider, Flex, Input, TableProps, Tabs, TabsProps, Typography } from 'antd'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { Property as PropertyType, PropertyDataSource, PropertyStatus } from '@/models/property.type'
import { useProperty } from '@/hooks/useProperties'
import PropertyTable from './PropertyTable'
import ErrorFetching from '@/components/ErrorFetching'
import { customFormatDate } from '@/utils/customFormatDate'
import { CheckCircleOutlined, CloseSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { Search } = Input

const tabsItem: TabsProps['items'] = [
  { key: PropertyStatus.PENDING, label: 'Chờ xử lý', icon: <ExclamationCircleOutlined /> },
  { key: PropertyStatus.APPROVED, label: 'Đã duyệt', icon: <CheckCircleOutlined /> },
  { key: PropertyStatus.REJECTED, label: 'Đã từ chối', icon: <CloseSquareOutlined /> }
]

function PropertyList() {
  const queryClient = useQueryClient()
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('IdDesc')
  const [status, setStatus] = useState(PropertyStatus.PENDING)

  const { data, isLoading, isError } = useProperty(search, pageNumber, pageSize, sortBy, status)

  const onTabChange = (key: string) => {
    setStatus(key as PropertyType['status'])
    queryClient.invalidateQueries({ queryKey: ['properties'] })
  }

  const handleTableChange: TableProps<PropertyDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setSortBy(`${sorter.field}${order}`)
    }
  }

  const dataSource: PropertyDataSource[] = data
    ? data.data
        .filter((property) => property.status === status)
        .map((property, idx) => ({
          ...property,
          key: property.id,
          index: (pageNumber - 1) * pageSize + idx + 1,
          createdAt: customFormatDate(property.createdAt)
        }))
    : []

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align='center' justify='space-between' style={{ marginBottom: 12 }}>
        <Flex align='center'>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Danh sách bài đăng
          </Typography.Title>
          <Divider type='vertical' style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search
            allowClear
            onSearch={(value) => setSearch(value)}
            placeholder='Tìm kiếm theo tiêu đề'
            style={{ width: 250 }}
          />
        </Flex>
      </Flex>

      <Tabs defaultActiveKey={PropertyStatus.PENDING} items={tabsItem} onChange={onTabChange} />

      <PropertyTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} bất động sản`,
          onShowSizeChange: (_, size) => setPageSize(size),
          onChange: (page) => setPageNumber(page)
        }}
        handleTableChange={handleTableChange}
      />
    </>
  )
}

export default PropertyList
