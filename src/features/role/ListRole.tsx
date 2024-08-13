import { Button, Divider, Flex, Space, TableProps, Typography } from 'antd'
import Search from 'antd/lib/input/Search'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { PlusCircleOutlined } from '@ant-design/icons'
import RoleTable from './RoleTable.tsx'
import { useDeleteMultiRole, useRoles } from '@/hooks/useRoles.ts'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { TableRowSelection } from 'antd/es/table/interface'
import { Role, RoleDataSource } from '@/models/role.type.ts'
import { showMultipleDeleteConfirm } from '@/components/ConfirmMultipleDeleteConfig.tsx'

function ListRole() {

  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [authorities, setAuthorities] = useState<string>('')
  const [sortBy, setSortBy] = useState('IdDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useRoles(search, authorities, pageNumber, pageSize, sortBy)
  const { deleteRolesMutate } = useDeleteMultiRole()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các vai trò', () => {
      deleteRolesMutate(deleteIdList)
      setDeleteIdList([])
    })
  }

  const handleTableChange: TableProps<RoleDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setSortBy(`${sorter.field}${order}`)
    }

    if (filters.authorityPrivileges) {
      setAuthorities(filters.authorityPrivileges.join(','))
    } else {
      setAuthorities('')
    }
  }

  const dataSource: RoleDataSource[] = data
    ? data.data.map((role: Role, idx) => ({
      key: role.id,
      id: role.id,
      index: (pageNumber - 1) * pageSize + idx + 1,
      name: role.name,
      authorityPrivileges: role.authorityPrivileges,
      createdAt: customFormatDate(role.createdAt)
    }))
    : []

  const rowSelection: TableRowSelection<RoleDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_: React.Key[], selectedRows: RoleDataSource[]) => {
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
          <Typography.Title level={2} style={{ margin: 0 }}>Danh sách vai trò</Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search allowClear onSearch={(value) => setSearch(value)} placeholder="Tìm kiếm theo tên vai trò"
                  style={{ width: 250 }} />
        </Flex>

        <Space>
          {deleteIdList.length > 0 &&
            <Button shape="round" type="primary" danger onClick={handleDelete}>Xóa các mục đã chọn</Button>}
          <Button icon={<PlusCircleOutlined />} shape="round" type="primary" onClick={() => navigate('/role/add')}>
            Thêm mới
          </Button>
        </Space>
      </Flex>

      <RoleTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} vai trò`,
          onShowSizeChange: (_, size) => setPageSize(size),
          onChange: (page) => setPageNumber(page)
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
      />
    </>
  )
}

export default ListRole
