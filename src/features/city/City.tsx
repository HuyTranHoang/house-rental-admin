import {
  Alert,
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  FormProps,
  Input,
  PaginationProps, Skeleton,
  Space,
  Table,
  TableProps,
  Typography
} from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { deleteCity, getAllCitiesWithPagination } from '../api/city.api.ts'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { formatDate } from '../../utils/formatDate.ts'

const { Search } = Input

interface DataSourceType {
  key: React.Key
  id: number
  name: string
}

interface FieldType {
  search?: string
}

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

function City() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cities', search, pageNumber, pageSize],
    queryFn: () => getAllCitiesWithPagination(search, pageNumber, pageSize)
  })

  const { mutate } = useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      toast.success('Xóa thành phố thành công')
      queryClient.invalidateQueries({ queryKey: ['cities'] })
    }
  })

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    setSearch(values.search || '')
  }

  const onPageChance: PaginationProps['onChange'] = (page) => {
    setPageNumber(prevState => {
      if (prevState === page) return prevState
      return page
    })
  }

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (_, size) => {
    setPageSize(size)
    setPageNumber(1)
  }


  let dataSource: DataSourceType[] = []
  if (data) {
    dataSource = data.data.map((city) => ({
      key: city.id,
      id: city.id,
      name: city.name,
      createdAt: formatDate(city.createdAt)
    }))
  }

  const columns: TableProps<DataSourceType>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Tên thành phố',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/city/${record.id}/edit`)}>Cập nhật</Button>
          <Button type="primary" onClick={() => mutate(record.id)}>Xóa</Button>
        </Space>
      )
    }
  ]

  if (isError) {
    return <>
      <Alert
        message="Lỗi"
        description="Có lỗi xảy ra trong quá trình lấy dữ liệu. Vui lòng thử lại sau."
        type="error"
        showIcon
        style={{ marginBottom: '3rem' }}
      />

      <Empty />

    </>
  }

  if (isLoading) {
    return <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <Flex>
          <Typography.Title level={2} style={{ marginTop: 0 }}>Danh sách thành phố</Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              name="search"
            >
              <Search placeholder="Tìm kiếm tên thành phố" style={{ width: 250 }} />
            </Form.Item>
          </Form>
        </Flex>
        <Button type="primary" onClick={() => navigate('/city/add')}>Thêm mới</Button>
      </Flex>
      {data && <Table dataSource={dataSource}
                      columns={columns}
                      pagination={{
                        total: data.pageInfo.totalElements,
                        position: ['bottomCenter'],
                        pageSize: pageSize,
                        current: pageNumber,
                        showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} thành phố`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        pageSizeOptions: ['5', '10', '20'],
                        locale: { items_per_page: '/ trang' },
                        onChange: onPageChance
                      }}
      />}
    </>
  )
}

export default City
