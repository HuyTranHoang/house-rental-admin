import ErrorFetching from '@/components/ErrorFetching.tsx'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import AddUpdateCity from '@/features/city/AddUpdateCity.tsx'
import { useCities, useCityFilters, useDeleteMultiCity } from '@/hooks/useCities.ts'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter.ts'
import { City, CityDataSource } from '@/models/city.type.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import CityTable from './CityTable.tsx'

const { Search } = Input

type OnChange = NonNullable<TableProps<CityDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListCity() {
  const [editId, setEditId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form] = Form.useForm()

  const { t } = useTranslation(['common', 'city'])

  const { search, sortBy, pageSize, pageNumber, setFilters } = useCityFilters()

  const [isOpen, setIsOpen] = useState(false)

  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useCities(search, pageNumber, pageSize, sortBy)
  const formatDate = useCustomDateFormatter()

  const { deleteCitiesMutate, deleteCitiesIsPending } = useDeleteMultiCity()

  const handleTableChange: TableProps<CityDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }
  }

  const dataSource: CityDataSource[] = data
    ? data.data.map((city: City, idx) => ({
        ...city,
        key: city.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        createdAt: formatDate(city.createdAt)
      }))
    : []

  const rowSelection: TableRowSelection<CityDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_: React.Key[], selectedRows: CityDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  const handleNewCity = () => {
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
            {t('city:title')}
          </Typography.Title>
          <Divider type='vertical' className='mx-4 h-10 bg-gray-600' />
          <Form
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
                placeholder={t('city:searchPlaceholder')}
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
          <Button icon={<PlusCircleOutlined />} shape='round' type='primary' onClick={handleNewCity}>
            {t('city:button.add')}
          </Button>
        </Space>
      </Flex>

      <CityTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => (
            <Trans
              ns={'city'}
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

      <AddUpdateCity form={form} id={editId} formOpen={formOpen} setFormOpen={setFormOpen} />

      <MultipleDeleteConfirmModal
        deleteIdList={deleteIdList}
        isModalOpen={isOpen}
        setIsModalOpen={setIsOpen}
        pending={deleteCitiesIsPending}
        title={t('city:deleteModal.titleMultiple')}
        onOk={() => {
          deleteCitiesMutate(deleteIdList).then(() => {
            toast.success(t('city:notification.deleteSuccessMultiple'))
            setIsOpen(false)
            setDeleteIdList([])
          })
        }}
      />
    </>
  )
}

export default ListCity
