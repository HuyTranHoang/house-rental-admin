import { useSetBreadcrumb } from '../../hooks/useSetBreadcrumb.ts'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { deleteRoomType, deleteRoomTypes, getAllRoomTypesWithPagination } from '../api/roomType.api.ts'
import { formatDate } from '../../utils/formatDate.ts'
import {
  Alert,
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  FormProps, Input,
  PaginationProps,
  Space,
  Table,
  TableProps,
  Typography
} from 'antd'
import { DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { toast } from 'sonner'
const { Search } = Input


interface DataSourceType {
  key: React.Key
  id: number
  name: string
  createdAt: string
}

interface searchField {
  search?: string
}

function ListRoomType() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAtDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['roomTypes', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllRoomTypesWithPagination(search, pageNumber, pageSize, sortBy)
  })

  const { mutate: deleteRoomTypeMutate } = useMutation({
    mutationFn: deleteRoomType,
    onSuccess: () => {
      toast.success('Xóa loại phòng thành công')
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const { mutate: deleteRoomTypesMutate } = useMutation({
    mutationFn: deleteRoomTypes,
    onSuccess: () => {
      toast.success('Xóa loại phòng thành công')
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleDeleteMultiRoomType = () => {
    deleteRoomTypesMutate(deleteIdList)
    setDeleteIdList([])
  }

  const onFinish: FormProps<searchField>['onFinish'] = (values) => {
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

  const handleTableChange: TableProps<DataSourceType>['onChange'] = (_, __, sorter) => {
    if (Array.isArray(sorter)) {
      // Handle the case where sorter is an array
      setSortBy('createdAtDesc')
    } else {
      if (sorter.order) {
        const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
        setSortBy(`${sorter.field}${order}`)
      } else {
        setSortBy('createdAtDesc')
      }
    }
  }


  let dataSource: DataSourceType[] = []
  if (data) {
    dataSource = data.data.map((roomType) => ({
      key: roomType.id,
      id: roomType.id,
      name: roomType.name,
      createdAt: formatDate(roomType.createdAt)
    }))
  }

  const columns: TableProps<DataSourceType>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Tên loại phòng',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      fixed: 'right',
      width: 300
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<FormOutlined />} onClick={() => navigate(`/roomType/${record.id}/edit`)}>Cập nhật</Button>
          <Button icon={<DeleteOutlined />} type="default" onClick={() => deleteRoomTypeMutate(record.id)}
                  danger>Xóa</Button>
        </Space>
      )
    }
  ]

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataSourceType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  useSetBreadcrumb([
    { title: <Link to={'/'}>Dashboard</Link> },
    { title: 'Danh sách loại phòng' }
  ])

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

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>Danh sách loại phòng</Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form
            name="searchRoomType"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<searchField>
              style={{ margin: 0 }}
              name="search"
            >
              <Search allowClear onSearch={(value) => setSearch(value)} placeholder="Tìm kiếm tên loại phòng"
                      style={{ width: 250 }} />
            </Form.Item>
          </Form>
        </Flex>

        <Space>
          {deleteIdList.length > 0 && <Button shape="round" type="primary" danger onClick={handleDeleteMultiRoomType}>Xóa các mục đã chọn</Button>}
          <Button icon={<PlusCircleOutlined />} shape="round" type="primary" onClick={() => navigate('/roomType/add')}>
            Thêm mới
          </Button>
        </Space>
      </Flex>

      {!data && <Table columns={columns} loading={isLoading} />}

      {data && <Table dataSource={dataSource}
                      columns={columns}
                      rowSelection={{
                        type: 'checkbox',
                        ...rowSelection
                      }}
                      pagination={{
                        total: data.pageInfo.totalElements,
                        position: ['bottomCenter'],
                        pageSize: pageSize,
                        current: pageNumber,
                        showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} loại phòng`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        pageSizeOptions: ['5', '10', '20'],
                        locale: { items_per_page: '/ trang' },
                        onChange: onPageChance
                      }}
                      onChange={handleTableChange}
                      locale={{
                        triggerDesc: 'Sắp xếp giảm dần',
                        triggerAsc: 'Sắp xếp tăng dần',
                        cancelSort: 'Hủy sắp xếp'
                      }}
                      loading={isFetching || isLoading}
      />}
    </>
  )
}

export default ListRoomType
