import ErrorFetching from '@/components/ErrorFetching'
import { useDeleteUsers, useUsers } from '@/hooks/useUsers'
import { User, UserDataSource } from '@/models/user.type'
import { CheckCircleOutlined, CloseSquareOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Divider, Flex, Space, TableProps, Tabs, TabsProps, Typography } from 'antd'
import Search from 'antd/es/input/Search'
import React, { useState } from 'react'
import UserTable from './UserTable'
import { customFormatDate } from '@/utils/customFormatDate'
import { showMultipleDeleteConfirm } from '@/components/ConfirmMultipleDeleteConfig'

const tabsItem: TabsProps['items'] = [
  {
    key: 'isNonLocked',
    label: 'Đang hoạt động',
    icon: <CheckCircleOutlined />
  },
  {
    key: 'isLocked',
    label: 'Đã bị khoá',
    icon: <CloseSquareOutlined />
  }
]

function ListUser() {
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [isNonLocked, setIsNonLocked] = useState(true)
  const [roles, setRoles] = useState('')
  const [sortBy, setSortBy] = useState('IdDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const { data, isLoading, isError } = useUsers(search, isNonLocked, roles, pageNumber, pageSize, sortBy)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])
  const { deleteUsersMutate } = useDeleteUsers()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các tài khoản', () => {
      deleteUsersMutate(deleteIdList)
      setDeleteIdList([])
    })
  }

  const onTabChange = (key: string) => {
    setIsNonLocked(key === 'isNonLocked')
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  const handleTableChange: TableProps<UserDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setSortBy(`${sorter.field}${order}`)
    }

    if (filters.roles) {
      setRoles(filters.roles.join(','))
    } else {
      setRoles('')
    }
  }

  const dataSource: UserDataSource[] = data
    ? data.data.map((user: User, idx) => ({
      ...user,
      key: user.id,
      index: (pageNumber - 1) * pageSize + idx + 1,
      createdAt: customFormatDate(user.createdAt)
    }))
    : []

  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: UserDataSource[]) => {
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
            Danh sách tài khoản
          </Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search
            allowClear
            onSearch={(value) => setSearch(value)}
            placeholder="Tìm kiếm theo tên tài khoản"
            style={{ width: 250 }}
          />
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button shape="round" type="primary" danger onClick={handleDelete}>
              Xóa các mục đã chọn
            </Button>
          )}
        </Space>
      </Flex>

      <Tabs defaultActiveKey={'isNonLocked'} items={tabsItem} onChange={onTabChange} />

      <UserTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} tài khoản`,
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

export default ListUser
