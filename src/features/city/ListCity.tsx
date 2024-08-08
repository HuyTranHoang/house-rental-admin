import {
  Alert,
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  FormProps,
  Input,
  PaginationProps,
  Space,
  TableProps,
  Typography
} from 'antd'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate.ts'
import { PlusCircleOutlined } from '@ant-design/icons'

import { useSetBreadcrumb } from '../../hooks/useSetBreadcrumb.ts'
import { useCities, useDeleteMultiCity } from './useCities.ts'
import CityTable from './CityTable.tsx'
import { City } from '../../models/city.ts'

const { Search } = Input

type DataSourceType = City & {
  key: React.Key
}

interface searchField {
  search?: string
}

function ListCity() {

  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAtDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useCities(search, pageNumber, pageSize, sortBy)
  const { deleteCitiesMutate } = useDeleteMultiCity()


  const handleDeleteMultiCity = () => {
    deleteCitiesMutate(deleteIdList)
    setDeleteIdList([])
  }

  const onFinish: FormProps<searchField>['onFinish'] = (values) => {
    setSearch(values.search || '')
  }

  const onPageChance: PaginationProps['onChange'] = (page) => {
    setPageNumber(prevState => {
      if (prevState === page) return prevState
      return page
    })
  }

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (_, size) => {
    setPageSize(size)
    setPageNumber(1)
  }

  const handleTableChange: TableProps<DataSourceType>['onChange'] = (_, __, sorter) => {
    if (Array.isArray(sorter)) {
      // Handle the case where sorter is an array
      setSortBy('createdAtDesc')
    } else {
      if (sorter.order) {
        const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
        setSortBy(`${sorter.field}${order}`)
      }
    }
  }

  const dataSource = data
    ? data.data.map((city: City) => ({
      key: city.id,
      id: city.id,
      name: city.name,
      createdAt: formatDate(city.createdAt)
    }))
    : []

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataSourceType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  useSetBreadcrumb([
    { title: <Link to={'/'}>Dashboard</Link> },
    { title: 'Danh sách thành phố' }
  ])

  if (isError) {
    return <>
      <Alert
        message="Lỗi"
        description="Có lỗi xảy ra trong quá trình lấy dữ liệu. Vui lòng thử lại sau."
        type="error"
        showIcon
        style={{ marginBottom: '3rem' }}
      />

      <Empty />

    </>
  }

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>Danh sách thành phố</Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form
            name="searchCity"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<searchField>
              style={{ margin: 0 }}
              name="search"
            >
              <Search allowClear onSearch={(value) => setSearch(value)} placeholder="Tìm kiếm tên thành phố"
                      style={{ width: 250 }} />
            </Form.Item>
          </Form>
        </Flex>

        <Space>
          {deleteIdList.length > 0 &&
            <Button shape="round" type="primary" danger onClick={handleDeleteMultiCity}>Xóa các mục đã chọn</Button>}
          <Button icon={<PlusCircleOutlined />} shape="round" type="primary" onClick={() => navigate('/city/add')}>Thêm
            mới</Button>
        </Space>
      </Flex>

      <CityTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} thành phố`,
          onShowSizeChange: onShowSizeChange,
          onChange: onPageChance
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

export default ListCity
