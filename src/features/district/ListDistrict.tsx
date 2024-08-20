import { Button, Divider, Flex, Form, Input, Space, TableProps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useDeleteMultiDistrict, useDistricts } from '@/hooks/useDistricts.ts'
import DistrictTable from './DistrictTable.tsx'
import { District, DistrictDataSource } from '@/models/district.type.ts'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import { showMultipleDeleteConfirm } from '@/components/ConfirmMultipleDeleteConfig.tsx'
import { TableRowSelection } from 'antd/es/table/interface'
import ROUTER_NAMES from '@/constant/routerNames.ts'

const { Search } = Input

type OnChange = NonNullable<TableProps<DistrictDataSource>['onChange']>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

function ListDistrict() {
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams({
    search: '',
    cityId: '0',
    sortBy: '',
    pageNumber: '1',
    pageSize: '5'
  })

  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const [form] = Form.useForm()
  const search = searchParams.get('search') || ''
  const cityId = parseInt(searchParams.get('cityId') || '0')
  const sortBy = searchParams.get('sortBy') || ''
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '5')

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
    if (!Array.isArray(sorter)) {
      if (sorter.order) {
        const order = sorter.order === 'ascend' ? 'Asc' : 'Desc';
        setSearchParams(prev => {
          prev.set('sortBy', `${sorter.field}${order}`);
          return prev;
        }, { replace: true });
      } else {
        setSearchParams(prev => {
          prev.set('sortBy', '');
          return prev;
        }, { replace: true });
        setSortedInfo({});
      }
    }

    if (filters.cityName) {
      const cityId = filters.cityName[0];
      setSearchParams(prev => {
        prev.set('cityId', cityId as string);
        return prev;
      }, { replace: true });
    } else {
      setSearchParams(prev => {
        prev.set('cityId', '0');
        return prev;
      }, { replace: true });
    }
  };

  const dataSource: DistrictDataSource[] = data
    ? data.data.map((district: District, idx) => ({
      key: district.id,
      id: district.id,
      index: (pageNumber - 1) * pageSize + idx + 1,
      name: district.name,
      cityId: district.cityId,
      cityName: district.cityName,
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
    if (search) {
      form.setFieldsValue({ search })
    }
  }, [form, search])

  useEffect(() => {
    if (cityId) {
      setFilteredInfo(prev => ({
        ...prev,
        cityName: [cityId]
      }))
    }
  }, [cityId])

  useEffect(() => {
    if (sortBy) {
      const match = sortBy.match(/(.*?)(Asc|Desc)$/);
      if (match) {
        const [, field, order] = match;
        setSortedInfo({
          field,
          order: order === 'Asc' ? 'ascend' : 'descend'
        });
      }
    }
  }, [sortBy]);

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>
            Danh sách quận huyện
          </Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form form={form} name="searchDistrictForm" layout="inline">
            <Form.Item name="search">
              <Search
                allowClear
                onSearch={(value) => setSearchParams(prev => {
                  prev.set('search', value)
                  return prev
                }, { replace: true })}
                placeholder="Tìm kiếm tên quận huyện"
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
                  onClick={() => navigate(ROUTER_NAMES.ADD_DISTRICT)}>
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
          onShowSizeChange: (_, size) => setSearchParams(prev => {
            prev.set('pageSize', size.toString())
            return prev
          }, { replace: true }),
          onChange: (page) => setSearchParams(prev => {
            prev.set('pageNumber', page.toString())
            return prev
          }, { replace: true })
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
