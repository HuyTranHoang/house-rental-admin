import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useAmenities, useAmenityFilters, useDeleteMultiAmenity } from '@/hooks/useAmenities.ts'
import AmenityTable from './AmenityTable.tsx'
import { Amenity, AmenityDataSource } from '@/models/amenity.type.ts'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import { showMultipleDeleteConfirm } from '@/components/ConfirmMultipleDeleteConfig.tsx'
import { TableRowSelection } from 'antd/es/table/interface'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const { Search } = Input

type OnChange = NonNullable<TableProps<AmenityDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListAmenity() {
  const navigate = useNavigate()

  const { search, sortBy, pageSize, pageNumber, setFilters } = useAmenityFilters()

  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const [form] = Form.useForm()

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useAmenities(search, pageNumber, pageSize, sortBy)
  const { deleteAmenitiesMutate } = useDeleteMultiAmenity()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các tiện nghi', () => {
      deleteAmenitiesMutate(deleteIdList)
      setDeleteIdList([])
    })
  }

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
      <Flex align='center' justify='space-between' style={{ marginBottom: 12 }}>
        <Flex align='center'>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Danh sách tiện nghi
          </Typography.Title>
          <Divider type='vertical' style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
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
                placeholder='Tìm kiếm tiện nghi'
                style={{ width: 250 }}
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
            onClick={() => navigate(ROUTER_NAMES.ADD_AMENITY)}
          >
            Thêm mới
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
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} tiện nghi`,
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
        sortedInfo={sortedInfo}
      />
    </>
  )
}

export default ListAmenity
