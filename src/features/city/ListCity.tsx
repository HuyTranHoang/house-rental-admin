import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useCities, useDeleteMultiCity } from '@/hooks/useCities.ts'
import CityTable from './CityTable.tsx'
import { City, CityDataSource } from '@/models/city.type.ts'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import { showMultipleDeleteConfirm } from '@/components/ConfirmMultipleDeleteConfig.tsx'
import { TableRowSelection } from 'antd/es/table/interface'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const { Search } = Input

function ListCity() {
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams({
    search: '',
    sortBy: '',
    pageNumber: '1',
    pageSize: '5'
  })

  const [form] = Form.useForm()
  const search = searchParams.get('search') || ''
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useCities(search, pageNumber, pageSize, sortBy)
  const { deleteCitiesMutate } = useDeleteMultiCity()

  const handleDelete = () => {
    showMultipleDeleteConfirm(deleteIdList, 'Xác nhận xóa các thành phố', () => {
      deleteCitiesMutate(deleteIdList)
      setDeleteIdList([])
    })
  }

  const handleTableChange: TableProps<CityDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setSearchParams(prev => {
        prev.set('sortBy', `${sorter.field}${order}`)
        prev.set('pageNumber', '1')
        return prev
      })
    }
  }


  const dataSource: CityDataSource[] = data
    ? data.data.map((city: City, idx) => ({
      key: city.id,
      index: (pageNumber - 1) * pageSize + idx + 1,
      id: city.id,
      name: city.name,
      createdAt: customFormatDate(city.createdAt)
    }))
    : []

  const rowSelection: TableRowSelection<CityDataSource> | undefined = {
    type: 'checkbox',
    onChange: (_: React.Key[], selectedRows: CityDataSource[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  useEffect(() => {
    if (search) {
      form.setFieldsValue({ search })
    }
  }, [form, search])

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>
            Danh sách thành phố
          </Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form form={form} name="searchCityForm" layout="inline">
            <Form.Item name="search">
              <Search
                allowClear
                onSearch={(value) => setSearchParams(prev => {
                  prev.set('search', value)
                  prev.set('pageNumber', '1')
                  return prev
                })}
                placeholder="Tìm kiếm tên thành phố"
                style={{ width: 250 }}
              />
            </Form.Item>
          </Form>
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button shape="round" type="primary" danger onClick={handleDelete}>
              Xóa các mục đã chọn
            </Button>
          )}
          <Button icon={<PlusCircleOutlined />} shape="round" type="primary"
                  onClick={() => navigate(ROUTER_NAMES.ADD_CITY)}>
            Thêm mới
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
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} thành phố`,
          onShowSizeChange: (_, size) => setSearchParams(prev => {
            prev.set('pageSize', size.toString())
            prev.set('pageNumber', '1')
            return prev
          }),
          onChange: (page) => setSearchParams(prev => {
            prev.set('pageNumber', page.toString())
            return prev
          })
        }}
        handleTableChange={handleTableChange}
        rowSelection={rowSelection}
      />
    </>
  )
}

export default ListCity
