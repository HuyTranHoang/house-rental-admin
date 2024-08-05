import { Alert, Button, Empty, Flex, Space, Table, TableProps, Typography } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { deleteCity, getAllCities } from '../api/city.api.ts'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface DataSourceType {
  key: React.Key
  id: number
  name: string
}

function City() {

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cities'],
    queryFn: getAllCities
  })

  const { mutate } = useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      toast.success('Xóa thành phố thành công')
      queryClient.invalidateQueries({queryKey: ['cities']})
    }
  })

  let dataSource: DataSourceType[] = []
  if (data) {
    dataSource = data.map((city) => ({
      key: city.id,
      id: city.id,
      name: city.name
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
      title: 'Hành động',
      key: 'action',
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

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>Danh sách thành phố</Typography.Title>
        <Button type="primary" onClick={() => navigate('/city/add')}>Thêm mới</Button>
      </Flex>
      <Table dataSource={dataSource} columns={columns} loading={isLoading} />
    </>
  )
}

export default City
