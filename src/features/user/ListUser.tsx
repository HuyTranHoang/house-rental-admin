import ErrorFetching from '@/components/ErrorFetching'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter.ts'
import { useDeleteUsers, useUserFilters, useUsers } from '@/hooks/useUsers'
import { User, UserDataSource } from '@/types/user.type'
import { CheckCircleOutlined, CloseSquareOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Divider, Flex, Space, TableProps, Tabs, TabsProps, Typography } from 'antd'
import Search from 'antd/es/input/Search'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import UserTable from './UserTable'

type OnChange = NonNullable<TableProps<UserDataSource>['onChange']>
type Filters = Parameters<OnChange>[1]
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListUser() {
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common', 'user'])

  const { search, isNonLocked, roles, pageNumber, pageSize, sortBy, setFilters } = useUserFilters()
  const formatDate = useCustomDateFormatter()

  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, isError } = useUsers(search, isNonLocked, roles, pageNumber, pageSize, sortBy)
  const { deleteUsersMutate, deleteUsersIsPending } = useDeleteUsers()

  const tabsItem: TabsProps['items'] = useMemo(
    () => [
      {
        key: 'isNonLocked',
        label: t('user:status.active'),
        icon: <CheckCircleOutlined />
      },
      {
        key: 'isLocked',
        label: t('user:status.locked'),
        icon: <CloseSquareOutlined />
      }
    ],
    [t]
  )

  const onTabChange = (key: string) => {
    key === 'isNonLocked' ? setFilters({ isNonLocked: true }) : setFilters({ isNonLocked: false })
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  const handleTableChange: TableProps<UserDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      if (`${sorter.field}${order}` !== sortBy) setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }

    if (filters.roles) {
      const filterRoles = filters.roles.join(',')
      if (filterRoles !== roles) setFilters({ roles: filterRoles })
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
        createdAt: formatDate(user.createdAt)
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
            {t('user:title')}
          </Typography.Title>
          <Divider type='vertical' className='mx-4 h-10 bg-gray-600' />
          <Search
            allowClear
            onSearch={(value) => setFilters({ search: value })}
            placeholder={t('user:searchPlaceholder')}
            className='w-64'
          />
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button shape='round' type='primary' danger onClick={() => setIsOpen(true)}>
              {t('common.multipleDelete')}
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
          showTotal: (total, range) => (
            <Trans
              ns='user'
              i18nKey='pagination.showTotal'
              values={{ total, rangeStart: range[0], rangeEnd: range[1] }}
            />
          ),
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
        pending={deleteUsersIsPending}
        setIsModalOpen={setIsOpen}
        title={t('user:deleteModal.titleMultiple')}
        onOk={() => {
          deleteUsersMutate(deleteIdList).then(() => {
            deleteIdList.length > 1
              ? toast.success(t('user:notification.deleteSuccess'))
              : toast.success(t('user:notification.deleteSuccessMultiple'))
            setDeleteIdList([])
            setIsOpen(false)
          })
        }}
      />
    </>
  )
}

export default ListUser
