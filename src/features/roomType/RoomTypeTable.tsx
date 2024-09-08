import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import TableActions from '@/components/TableActions.tsx'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { useDeleteRoomType } from '@/hooks/useRoomTypes.ts'
import { RoomTypeDataSource } from '@/models/roomType.type.ts'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<RoomTypeDataSource | null>(null)

  const { deleteRoomTypeMutate } = useDeleteRoomType()

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Id',
      children: <span>{currentRecord?.id}</span>,
      span: 3
    },
    {
      key: '2',
      label: 'Tên loại phòng',
      children: <span>{currentRecord?.name}</span>,
      span: 3
    },
    {
      key: '3',
      label: 'Ngày tạo',
      children: <span>{currentRecord?.createdAt}</span>,
      span: 3
    }
  ]

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
          onDelete={() => {
            setCurrentRecord(record)
            setIsModalOpen(true)
          }}
        />
      )
    }
  ]

  return (
    <>
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

      <Modal
        open={isModalOpen}
        className='w-96'
        title={<ConfirmModalTitle title='Xác nhận xóa loại phòng' />}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          deleteRoomTypeMutate(currentRecord!.id)
          setIsModalOpen(false)
        }}
        okText='Xác nhận'
        okType='danger'
        cancelText='Hủy'
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default RoomTypeTable
