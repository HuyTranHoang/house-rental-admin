import { City } from '../../models/city.ts'
import React from 'react'
import { Button, Space, Table, TablePaginationConfig, TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'
import { TableRowSelection } from 'antd/es/table/interface'
import { useDeleteCity } from './useCities.ts'

type DataSourceType = City & {
  key: React.Key;
}

interface CityTableProps {
  dataSource: DataSourceType[];
  loading: boolean;
  paginationProps: false | TablePaginationConfig | undefined;
  handleTableChange: TableProps<DataSourceType>['onChange'];
  rowSelection: TableRowSelection<DataSourceType> | undefined
}

function CityTable({
                     dataSource,
                     loading,
                     paginationProps,
                     handleTableChange,
                     rowSelection
                   }: CityTableProps) {
  const navigate = useNavigate()
  const { deleteCityMutate } = useDeleteCity()


  const columns: TableProps<DataSourceType>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Tên thành phố',
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
          <Button icon={<FormOutlined />} onClick={() => navigate(`/city/${record.id}/edit`)}>Cập nhật</Button>
          <Button icon={<DeleteOutlined />} type="default" onClick={() => deleteCityMutate(record.id)}
                  danger>Xóa</Button>
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

export default CityTable
