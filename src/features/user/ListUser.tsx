import ErrorFetching from '@/components/ErrorFetching'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import { useDeleteUsers, useUserFilters, useUsers } from '@/hooks/useUsers'
import { User, UserDataSource } from '@/models/user.type'
import { customFormatDate } from '@/utils/customFormatDate'
import { CheckCircleOutlined, CloseSquareOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Divider, Flex, Space, TableProps, Tabs, TabsProps, Typography } from 'antd'
import Search from 'antd/es/input/Search'
import React, { useEffect, useState } from 'react'
import UserTable from './UserTable'
import { TableRowSelection } from 'antd/es/table/interface'

type OnChange = NonNullable<TableProps<UserDataSource>['onChange']>
type Filters = Parameters<OnChange>[1]
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

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

  const { search, isNonLocked, roles, pageNumber, pageSize, sortBy, setFilters } = useUserFilters()

  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, isError } = useUsers(search, isNonLocked, roles, pageNumber, pageSize, sortBy)
  const { deleteUsersMutate } = useDeleteUsers()

  const onTabChange = (key: string) => {
    if (key === 'isNonLocked') {
      setFilters({ isNonLocked: true })
    } else {
      setFilters({ isNonLocked: false })
    }
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  const handleTableChange: TableProps<UserDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }

    if (filters.roles) {
      setFilters({ roles: filters.roles.join(',') })
    } else {
      setFilters({ roles: '' })
      setFilteredInfo({})
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

  const rowSelection: TableRowSelection<UserDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_selectedRowKeys: React.Key[], selectedRows: UserDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  useEffect(() => {
    if (roles) {
      setFilteredInfo((prev) => ({
        ...prev,
        roles: roles.split(',')
      }))
    }
  }, [roles])

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
            Danh sách tài khoản
          </Typography.Title>
          <Divider type='vertical' className='mx-4 h-10 bg-gray-600' />
          <Search
            allowClear
            onSearch={(value) => setFilters({ search: value })}
            placeholder='Tìm kiếm theo tên tài khoản'
            className='w-64'
          />
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button shape='round' type='primary' danger onClick={() => setIsOpen(true)}>
              Xóa các mục đã chọn
            </Button>
          )}
        </Space>
      </Flex>

      <Tabs defaultActiveKey={isNonLocked ? 'isNonLocked' : 'isLocked'} items={tabsItem} onChange={onTabChange} />

      <UserTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} tài khoản`,
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
        filteredInfo={filteredInfo}
        sortedInfo={sortedInfo}
      />

      <MultipleDeleteConfirmModal
        deleteIdList={deleteIdList}
        isModalOpen={isOpen}
        setIsModalOpen={setIsOpen}
        title={'Xác nhận xóa các mục đã chọn'}
        onOk={() => {
          deleteUsersMutate(deleteIdList)
          setDeleteIdList([])
        }}
      />
    </>
  )
}

export default ListUser
