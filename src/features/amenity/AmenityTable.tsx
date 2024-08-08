import React from 'react'
import { Button, Space, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { Amenity } from '../../models/amenity.ts'
import { useNavigate } from 'react-router-dom'
import { useDeleteAmenity } from './useAmenities.ts'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'

type DataSourceType = Amenity & {
  key: React.Key;
}

interface AmenityTableProps {
  dataSource: DataSourceType[];
  loading: boolean;
  paginationProps: false | TablePaginationConfig | undefined;
  handleTableChange: TableProps<DataSourceType>['onChange'];
  rowSelection: TableRowSelection<DataSourceType> | undefined
}


function AmenityTable({
                        dataSource,
                        loading,
                        paginationProps,
                        handleTableChange,
                        rowSelection
                      }: AmenityTableProps) {
  const navigate = useNavigate()
  const { deleteAmenityMutate } = useDeleteAmenity()

  const columns: TableProps<DataSourceType>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Tên tiện nghi',
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
          <Button icon={<FormOutlined />} onClick={() => navigate(`/amenity/${record.id}/edit`)}>
            Cập nhật
          </Button>
          <Button icon={<DeleteOutlined />} type="default" danger onClick={() => deleteAmenityMutate(record.id)}>
            Xóa
          </Button>
        </Space>
      )
    }
  ]

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowSelection={{ ...rowSelection }}
      pagination={{
        position: ['bottomCenter'],
        pageSizeOptions: ['5', '10', '20'],
        locale: { items_per_page: '/ trang' },
        showSizeChanger: true,
        ...paginationProps
      }}
      onChange={handleTableChange}
      loading={loading}
      locale={{
        triggerDesc: 'Sắp xếp giảm dần',
        triggerAsc: 'Sắp xếp tăng dần',
        cancelSort: 'Hủy sắp xếp'
      }}
    />
  )
}

export default AmenityTable
