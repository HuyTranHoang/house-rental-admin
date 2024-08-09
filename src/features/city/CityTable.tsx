import { City } from '../../models/city.type.ts'
import React from 'react'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { TableRowSelection } from 'antd/es/table/interface'
import { useDeleteCity } from './useCities.ts'
import ConfirmModalTitle from '../../components/ConfirmModalTitle.tsx'
import ConfirmModalContent from '../../components/ConfirmModalContent.tsx'
import TableActions from '../../components/TableActions.tsx'

const { confirm } = Modal

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

  const showDeleteConfirm = (record: DataSourceType) => {

    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: 'Id',
        children: <span>{record.id}</span>,
        span: 3
      },
      {
        key: '2',
        label: 'Tên thành phố',
        children: <span>{record.name}</span>,
        span: 3
      },
      {
        key: '3',
        label: 'Ngày tạo',
        children: <span>{record.createdAt}</span>,
        span: 3
      }
    ]

    confirm({
      icon: null,
      title: <ConfirmModalTitle title="Xác nhận xóa thành phố" />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deleteCityMutate(record.id)
      }
    })
  }

  const columns: TableProps<DataSourceType>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 50
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
        <TableActions onUpdate={() => navigate(`/city/${record.id}/edit`)}
                      onDelete={() => showDeleteConfirm(record)} />
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
