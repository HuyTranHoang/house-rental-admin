import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import React from 'react'
import { TableRowSelection } from 'antd/es/table/interface'
import { RoomType } from '../../models/roomType.type.ts'
import { useNavigate } from 'react-router-dom'
import { useDeleteRoomType } from './useRoomTypes.ts'
import TableActions from '../../components/TableActions.tsx'
import ConfirmModalTitle from '../../components/ConfirmModalTitle.tsx'
import ConfirmModalContent from '../../components/ConfirmModalContent.tsx'

const { confirm } = Modal

type DataSourceType = RoomType & {
  key: React.Key;
}

interface RoomTypeTableProps {
  dataSource: DataSourceType[];
  loading: boolean;
  paginationProps: false | TablePaginationConfig | undefined;
  handleTableChange: TableProps<DataSourceType>['onChange'];
  rowSelection: TableRowSelection<DataSourceType> | undefined
}

function RoomTypeTable({
                         dataSource,
                         loading,
                         paginationProps,
                         handleTableChange,
                         rowSelection
                       }: RoomTypeTableProps) {
  const navigate = useNavigate()
  const { deleteRoomTypeMutate } = useDeleteRoomType()

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
        label: 'Tên loại phòng',
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
      title: <ConfirmModalTitle title="Xác nhận xóa loại phòng" />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deleteRoomTypeMutate(record.id)
      }
    })
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
        <TableActions onUpdate={() => navigate(`/roomType/${record.id}/edit`)}
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

export default RoomTypeTable
