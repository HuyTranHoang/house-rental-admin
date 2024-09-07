import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import TableActions from '@/components/TableActions.tsx'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { useDeleteRoomType } from '@/hooks/useRoomTypes.ts'
import { RoomTypeDataSource } from '@/models/roomType.type.ts'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useNavigate } from 'react-router-dom'

const { confirm } = Modal

interface RoomTypeTableProps {
  dataSource: RoomTypeDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<RoomTypeDataSource>['onChange']
  rowSelection: TableRowSelection<RoomTypeDataSource> | undefined
  sortedInfo: SorterResult<RoomTypeDataSource>
}

function RoomTypeTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  sortedInfo
}: RoomTypeTableProps) {
  const navigate = useNavigate()
  const { deleteRoomTypeMutate } = useDeleteRoomType()

  const showDeleteConfirm = (record: RoomTypeDataSource) => {
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
      title: <ConfirmModalTitle title='Xác nhận xóa loại phòng' />,
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

  const columns: TableProps<RoomTypeDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: 'Tên loại phòng',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo.field === 'name' ? sortedInfo.order : null
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      fixed: 'right',
      width: 300
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <TableActions
          onUpdate={() => navigate(ROUTER_NAMES.getRoomTypeEditPath(record.id))}
          onDelete={() => showDeleteConfirm(record)}
        />
      )
    }
  ]

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowSelection={rowSelection}
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
