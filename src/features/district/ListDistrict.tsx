import ErrorFetching from '@/components/ErrorFetching.tsx'
import MultipleDeleteConfirmModal from '@/components/MultipleDeleteConfirmModal.tsx'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter.ts'
import { useDeleteMultiDistrict, useDistrictFilters, useDistricts } from '@/hooks/useDistricts.ts'
import { District, DistrictDataSource } from '@/models/district.type.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AddUpdateDistrict from './AddUpdateDistrict.tsx'
import DistrictTable from './DistrictTable.tsx'

const { Search } = Input

type OnChange = NonNullable<TableProps<DistrictDataSource>['onChange']>
type Filters = Parameters<OnChange>[1]
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListDistrict() {
  const [editId, setEditId] = useState(0)
  const [formOpen, setFormOpen] = useState(false)

  const { search, cityId, sortBy, pageNumber, pageSize, setFilters } = useDistrictFilters()

  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation(['common', 'district'])

  const { data, isLoading, isError } = useDistricts(search, cityId, pageNumber, pageSize, sortBy)
  const formatDate = useCustomDateFormatter()
  const { deleteDistrictsMutate, deleteDistrictsPending } = useDeleteMultiDistrict()

  const handleTableChange: TableProps<DistrictDataSource>['onChange'] = (_, filters, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }

    if (filters.cityName) {
      const cityId = filters.cityName[0]
      setFilters({ cityId: cityId as number })
    } else {
      setFilters({ cityId: 0 })
      setFilteredInfo({})
    }
  }

  const dataSource: DistrictDataSource[] = data
    ? data.data.map((district: District, idx) => ({
        ...district,
        key: district.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        createdAt: formatDate(district.createdAt)
      }))
    : []

  const rowSelection: TableRowSelection<DistrictDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_: React.Key[], selectedRows: DistrictDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }
  const handleOpenForm = (id: number) => {
    setEditId(id)
    setFormOpen(true)
  }

  useEffect(() => {
    if (cityId) {
      setFilteredInfo((prev) => ({
        ...prev,
        cityName: [cityId]
      }))
    }
  }, [cityId])

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
            {t('district:title')}
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
                placeholder={t('district:searchPlaceholder')}
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
          <Button icon={<PlusCircleOutlined />} shape='round' type='primary' onClick={() => handleOpenForm(0)}>
            {t('district:button.add')}
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
          showTotal: (total, range) => (
            <Trans
              ns={'district'}
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
        onEdit={(id) => handleOpenForm(id)}
      />

      <MultipleDeleteConfirmModal
        deleteIdList={deleteIdList}
        isModalOpen={isOpen}
        pending={deleteDistrictsPending}
        setIsModalOpen={setIsOpen}
        title={t('district:deleteModal.titleMultiple')}
        onOk={() => {
          deleteDistrictsMutate(deleteIdList).then(() => {
            toast.success(t('district:notification.deleteSuccessMultiple'))
            setIsOpen(false)
            setDeleteIdList([])
          })
        }}
      />

      <AddUpdateDistrict id={editId} formOpen={formOpen} setFormOpen={setFormOpen}></AddUpdateDistrict>
    </>
  )
}

export default ListDistrict
