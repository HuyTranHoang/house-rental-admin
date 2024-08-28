import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useDeleteMultiDistrict, useDistrictFilters, useDistricts } from '@/hooks/useDistricts.ts'
import DistrictTable from './DistrictTable.tsx'
import { District, DistrictDataSource } from '@/models/district.type.ts'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import { showMultipleDeleteConfirm } from '@/components/ConfirmMultipleDeleteConfig.tsx'
import { TableRowSelection } from 'antd/es/table/interface'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const { Search } = Input

type OnChange = NonNullable<TableProps<DistrictDataSource>['onChange']>
type Filters = Parameters<OnChange>[1]

type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListDistrict() {
  const navigate = useNavigate()

  const { search, cityId, sortBy, pageNumber, pageSize, setFilters } = useDistrictFilters()

  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [form] = Form.useForm()

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useDistricts(search, cityId, pageNumber, pageSize, sortBy)
  const { deleteDistrictsMutate } = useDeleteMultiDistrict()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các quận huyện', () => {
      deleteDistrictsMutate(deleteIdList)
      setDeleteIdList([])
    })
  }

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
    }
  }

  const dataSource: DistrictDataSource[] = data
    ? data.data.map((district: District, idx) => ({
        ...district,
        key: district.id,
        index: (pageNumber - 1) * pageSize + idx + 1,
        createdAt: customFormatDate(district.createdAt)
      }))
    : []

  const rowSelection: TableRowSelection<DistrictDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_: React.Key[], selectedRows: DistrictDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
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
            Danh sách quận huyện
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
                placeholder='Tìm kiếm quận huyện'
                className='w-64'
              />
            </Form.Item>
          </Form>
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button shape='round' type='primary' danger onClick={handleDelete}>
              Xóa các mục đã chọn
            </Button>
          )}
          <Button
            icon={<PlusCircleOutlined />}
            shape='round'
            type='primary'
            onClick={() => navigate(ROUTER_NAMES.ADD_DISTRICT)}
          >
            Thêm mới
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
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} quận huyện`,
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
        filteredInfo={filteredInfo}
        sortedInfo={sortedInfo}
      />
    </>
  )
}

export default ListDistrict
