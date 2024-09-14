import ErrorFetching from '@/components/ErrorFetching.tsx'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import AddUpdateAmenity from '@/features/amenity/AddUpdateAmenity.tsx'
import { useAmenities, useAmenityFilters, useDeleteMultiAmenity } from '@/hooks/useAmenities.ts'
import { Amenity, AmenityDataSource } from '@/models/amenity.type.ts'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AmenityTable from './AmenityTable.tsx'

const { Search } = Input

type OnChange = NonNullable<TableProps<AmenityDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListAmenity() {
  const [editId, setEditId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form] = Form.useForm()

  const { search, sortBy, pageSize, pageNumber, setFilters } = useAmenityFilters()

  const [isOpen, setIsOpen] = useState(false)
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useAmenities(search, pageNumber, pageSize, sortBy)
  const { deleteAmenitiesMutate, deleteAmenitiesIsPending } = useDeleteMultiAmenity()
  const { t } = useTranslation(['common', 'amenity'])

  const handleTableChange: TableProps<AmenityDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }
  }

  const dataSource: AmenityDataSource[] = data
    ? data.data.map((amenity: Amenity, idx) => ({
        key: amenity.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        id: amenity.id,
        name: amenity.name,
        createdAt: customFormatDate(amenity.createdAt)
      }))
    : []

  const rowSelection: TableRowSelection<AmenityDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_selectedRowKeys: React.Key[], selectedRows: AmenityDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  const handleNewAmenity = () => {
    form.resetFields()
    setEditId(null)
    setFormOpen(true)
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
            {t('amenity:title')}
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
                placeholder={t('amenity:searchPlaceholder')}
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
          <Button icon={<PlusCircleOutlined />} shape='round' type='primary' onClick={handleNewAmenity}>
            {t('amenity:button.add')}
          </Button>
        </Space>
      </Flex>

      <AmenityTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => (
            <Trans
              ns={'amenity'}
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
        setEditId={setEditId}
        setFormOpen={setFormOpen}
      />

      <AddUpdateAmenity form={form} id={editId} formOpen={formOpen} setFormOpen={setFormOpen} />

      <MultipleDeleteConfirmModal
        deleteIdList={deleteIdList}
        isModalOpen={isOpen}
        pending={deleteAmenitiesIsPending}
        setIsModalOpen={setIsOpen}
        title={t('amenity:deleteModal.titleMultiple')}
        onOk={() => {
          deleteAmenitiesMutate(deleteIdList).then(() => {
            deleteIdList.length > 1
              ? toast.success(t('amenity:notification.deleteSuccess_other'))
              : toast.success(t('amenity:notification.deleteSuccess'))

            setDeleteIdList([])
            setIsOpen(false)
          })
        }}
      />
    </>
  )
}

export default ListAmenity
