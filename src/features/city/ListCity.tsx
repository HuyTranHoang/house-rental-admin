import { Button, Divider, Flex, Input, Space, TableProps, Typography } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { customFormatDate } from '../../utils/customFormatDate.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useCities, useDeleteMultiCity } from '../../hooks/useCities.ts'
import CityTable from './CityTable.tsx'
import { City } from '../../models/city.type.ts'
import ErrorFetching from '../../components/ErrorFetching.tsx'
import { showMultipleDeleteConfirm } from '../../components/ConfirmMultipleDeleteConfig.tsx'

const { Search } = Input

type DataSourceType = City & {
  key: React.Key
}

function ListCity() {

  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('IdDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useCities(search, pageNumber, pageSize, sortBy)
  const { deleteCitiesMutate } = useDeleteMultiCity()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các thành phố', () => {
      deleteCitiesMutate(deleteIdList);
      setDeleteIdList([]);
    });
  };

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
      createdAt: customFormatDate(city.createdAt)
    }))
    : []

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataSourceType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>Danh sách thành phố</Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search allowClear onSearch={(value) => setSearch(value)} placeholder="Tìm kiếm tên thành phố"
                  style={{ width: 250 }} />
        </Flex>

        <Space>
          {deleteIdList.length > 0 &&
            <Button shape="round" type="primary" danger onClick={handleDelete}>Xóa các mục đã chọn</Button>}
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

export default ListCity
