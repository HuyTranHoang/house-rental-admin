import ErrorFetching from '@/components/ErrorFetching.tsx'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import RoomTypeForm from '@/features/roomType/RoomTypeForm.tsx'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter.ts'
import { useDeleteRoomTypes, useRoomTypeFilters, useRoomTypes } from '@/hooks/useRoomTypes.ts'
import useBoundStore from '@/store.ts'
import { RoomTypeDataSource } from '@/types/roomType.type.ts'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import RoomTypeTable from './RoomTypeTable.tsx'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { useNavigate } from 'react-router-dom'

const { Search } = Input

type OnChange = NonNullable<TableProps<RoomTypeDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function RoomTypeManager() {
  const currentUser = useBoundStore((state) => state.user)
  const navigate = useNavigate()

  const [editId, setEditId] = useState(0)
  const [formOpen, setFormOpen] = useState(false)

  const { t } = useTranslation(['common', 'roomType'])

  const { search, sortBy, pageSize, pageNumber, setFilters } = useRoomTypeFilters()

  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, isError } = useRoomTypes(search, pageNumber, pageSize, sortBy)
  const formatDate = useCustomDateFormatter()
  const { deleteRoomTypesMutate, deleteRoomTypesIsPending } = useDeleteRoomTypes()

  const handleTableChange: TableProps<RoomTypeDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      if (`${sorter.field}${order}` !== sortBy) setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }
  }

  const dataSource: RoomTypeDataSource[] = data
    ? data.data.map((roomType, idx) => ({
        key: roomType.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        id: roomType.id,
        name: roomType.name,
        createdAt: formatDate(roomType.createdAt)
      }))
    : []

  const rowSelection: TableRowSelection<RoomTypeDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_selectedRowKeys: React.Key[], selectedRows: RoomTypeDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  const handleOpenForm = (id: number) => {
    setEditId(id)
    setFormOpen(true)
  }

  useEffect(() => {
    if (!hasAuthority(currentUser,'roomType:read')) {
      navigate(ROUTER_NAMES.DASHBOARD)
    }
  },[currentUser, navigate])

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
            {t('roomType:title')}
          </Typography.Title>
          <Divider type='vertical' className='mx-4 h-10 bg-gray-600' />
          <Form
            name='searchRoomType'
            initialValues={{
              search: search
            }}
            layout='inline'
          >
            <Form.Item name='search'>
              <Search
                allowClear
                onSearch={(value) => setFilters({ search: value })}
                placeholder={t('roomType:searchPlaceholder')}
                className='w-64'
              />
            </Form.Item>
          </Form>
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button
              shape='round'
              type='primary'
              danger
              disabled={!hasAuthority(currentUser, 'roomType:delete')}
              onClick={() => setIsOpen(true)}
            >
              {t('common.multipleDelete')}
            </Button>
          )}
          <Button
            icon={<PlusCircleOutlined />}
            shape='round'
            type='primary'
            disabled={!hasAuthority(currentUser, 'roomType:update')}
            onClick={() => handleOpenForm(0)}
          >
            {t('common.add')}
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
          showTotal: (total, range) => (
            <Trans
              ns={'roomType'}
              i18nKey='pagination.showTotal'
              values={{ total, rangeStart: range[0], rangeEnd: range[1] }}
            />
          ),
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
        sortedInfo={sortedInfo}
        onEdit={(id: number) => handleOpenForm(id)}
      />

      <RoomTypeForm id={editId} formOpen={formOpen} setFormOpen={setFormOpen} />

      <MultipleDeleteConfirmModal
        deleteIdList={deleteIdList}
        isModalOpen={isOpen}
        pending={deleteRoomTypesIsPending}
        setIsModalOpen={setIsOpen}
        title={t('roomType:deleteModal.titleMultiple')}
        onOk={() => {
          deleteRoomTypesMutate(deleteIdList).then(() => {
            deleteIdList.length > 1
              ? toast.success(t('roomType:notification.deleteSuccess'))
              : toast.success(t('roomType:notification.deleteSuccessMultiple'))
            setIsOpen(false)
            setDeleteIdList([])
          })
        }}
      />
    </>
  )
}

export default RoomTypeManager
