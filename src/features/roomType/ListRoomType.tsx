import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useDeleteRoomTypes, useRoomTypeFilters, useRoomTypes } from '@/hooks/useRoomTypes.ts'
import RoomTypeTable from './RoomTypeTable.tsx'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import { RoomTypeDataSource } from '@/models/roomType.type.ts'
import { TableRowSelection } from 'antd/es/table/interface'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import { Trans, useTranslation } from 'react-i18next'

const { Search } = Input

type OnChange = NonNullable<TableProps<RoomTypeDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListRoomType() {

  const { t } = useTranslation(['common', 'roomType'])

  const navigate = useNavigate()

  const { search, sortBy, pageSize, pageNumber, setFilters } = useRoomTypeFilters()

  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [form] = Form.useForm()

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, isError } = useRoomTypes(search, pageNumber, pageSize, sortBy)
  const { deleteRoomTypesMutate } = useDeleteRoomTypes()

  const handleTableChange: TableProps<RoomTypeDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setFilters({ sortBy: `${sorter.field}${order}` })
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
            form={form}
            name='searchCityForm'
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
            <Button shape='round' type='primary' danger onClick={() => setIsOpen(true)}>
              {t('common.multipleDelete')}
            </Button>
          )}
          <Button
            icon={<PlusCircleOutlined />}
            shape='round'
            type='primary'
            onClick={() => navigate(ROUTER_NAMES.ADD_ROOM_TYPE)}
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
      />

      <MultipleDeleteConfirmModal
        deleteIdList={deleteIdList}
        isModalOpen={isOpen}
        setIsModalOpen={setIsOpen}
        title={t('roomType:deleteModal.titleMultiple')}
        onOk={() => {
          deleteRoomTypesMutate(deleteIdList)
          setDeleteIdList([])
        }}
      />
    </>
  )
}

export default ListRoomType
