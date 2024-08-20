import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { Button, Divider, Flex, Input, Space, TableProps, Typography } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useDeleteRoomTypes, useRoomTypes } from '@/hooks/useRoomTypes.ts'
import RoomTypeTable from './RoomTypeTable.tsx'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import { showMultipleDeleteConfirm } from '@/components/ConfirmMultipleDeleteConfig.tsx'
import { RoomTypeDataSource } from '@/models/roomType.type.ts'
import { TableRowSelection } from 'antd/es/table/interface'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const { Search } = Input

function ListRoomType() {

  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('IdDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useRoomTypes(search, pageNumber, pageSize, sortBy)
  const { deleteRoomTypesMutate } = useDeleteRoomTypes()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các loại phòng', () => {
      deleteRoomTypesMutate(deleteIdList)
      setDeleteIdList([])
    })
  }

  const handleTableChange: TableProps<RoomTypeDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setSortBy(`${sorter.field}${order}`)
    }
  }


  const dataSource: RoomTypeDataSource[] = data
    ? data.data.map((roomType, idx) => ({
      key: roomType.id,
      index: (pageNumber - 1) * pageSize + idx + 1,
      id: roomType.id,
      name: roomType.name,
      createdAt: customFormatDate(roomType.createdAt)
    }))
    : []

  const rowSelection: TableRowSelection<RoomTypeDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_selectedRowKeys: React.Key[], selectedRows: RoomTypeDataSource[]) => {
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
          <Typography.Title level={2} style={{ margin: 0 }}>Danh sách loại phòng</Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search allowClear onSearch={(value) => setSearch(value)} placeholder="Tìm kiếm tên loại phòng"
                  style={{ width: 250 }} />
        </Flex>

        <Space>
          {deleteIdList.length > 0 &&
            <Button shape="round" type="primary" danger onClick={handleDelete}>
              Xóa các mục đã chọn
            </Button>
          }
          <Button icon={<PlusCircleOutlined />} shape="round" type="primary"
                  onClick={() => navigate(ROUTER_NAMES.ADD_ROOM_TYPE)}>
            Thêm mới
          </Button>
        </Space>
      </Flex>

      <RoomTypeTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} loại phòng`,
          onShowSizeChange: (_, size) => setPageSize(size),
          onChange: (page) => setPageNumber(page)
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
      />
    </>
  )
}

export default ListRoomType
