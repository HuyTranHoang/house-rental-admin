import { Button, Divider, Flex, Input, Space, TableProps, Typography } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useDeleteMultiDistrict, useDistricts } from '@/hooks/useDistricts.ts'
import DistrictTable from './DistrictTable.tsx'
import { District, DistrictDataSource } from '@/models/district.type.ts'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import { showMultipleDeleteConfirm } from '@/components/ConfirmMultipleDeleteConfig.tsx'
import { TableRowSelection } from 'antd/es/table/interface'

const { Search } = Input

function ListDistrict() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [cityId, setCityId] = useState(0)
  const [sortBy, setSortBy] = useState('IdDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useDistricts(search, cityId, pageNumber, pageSize, sortBy)
  const { deleteDistrictsMutate } = useDeleteMultiDistrict()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các quận huyện', () => {
      deleteDistrictsMutate(deleteIdList)
      setDeleteIdList([])
    })
  }

  const handleTableChange: TableProps<DistrictDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setSortBy(`${sorter.field}${order}`)
    }

    if (filters.cityName) {
      setCityId(Number(filters.cityName[0]))
    } else {
      setCityId(0)
    }
  }

  const dataSource: DistrictDataSource[] = data
    ? data.data.map((district: District, idx) => ({
      key: district.id,
      id: district.id,
      index: (pageNumber - 1) * pageSize + idx + 1,
      name: district.name,
      cityId: district.cityId,
      cityName: district.cityName,
      createdAt: customFormatDate(district.createdAt)
    }))
    : []

  const rowSelection: TableRowSelection<DistrictDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_: React.Key[], selectedRows: DistrictDataSource[]) => {
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
          <Typography.Title level={2} style={{ margin: 0 }}>
            Danh sách quận huyện
          </Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search
            allowClear
            onSearch={(value) => setSearch(value)}
            placeholder="Tìm kiếm tên quận huyện"
            style={{ width: 250 }}
          />
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button shape="round" type="primary" danger onClick={handleDelete}>
              Xóa các mục đã chọn
            </Button>
          )}
          <Button icon={<PlusCircleOutlined />} shape="round" type="primary" onClick={() => navigate('/district/add')}>
            Thêm mới
          </Button>
        </Space>
      </Flex>

      <DistrictTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} quận huyện`,
          onShowSizeChange: (_, size) => setPageSize(size),
          onChange: (page) => setPageNumber(page)
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
      />
    </>
  )
}

export default ListDistrict
