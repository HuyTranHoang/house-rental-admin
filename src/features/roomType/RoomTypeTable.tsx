import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import TableActions from '@/components/TableActions.tsx'
import { useDeleteRoomType } from '@/hooks/useRoomTypes.ts'
import { RoomTypeDataSource } from '@/models/roomType.type.ts'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface RoomTypeTableProps {
  dataSource: RoomTypeDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<RoomTypeDataSource>['onChange']
  rowSelection: TableRowSelection<RoomTypeDataSource> | undefined
  sortedInfo: SorterResult<RoomTypeDataSource>
  setEditId: React.Dispatch<React.SetStateAction<number | null>>
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function RoomTypeTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  sortedInfo,
  setEditId,
  setFormOpen
}: RoomTypeTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<RoomTypeDataSource | null>(null)

  const { deleteRoomTypeMutate, deleteRoomTypeIsPending } = useDeleteRoomType()
  const { t } = useTranslation(['common', 'roomType'])

  const items: DescriptionsProps['items'] = [
    {
      key: 'name',
      label: t('roomType:table.name'),
      children: <span>{currentRecord?.name}</span>,
      span: 3
    },
    {
      key: 'createdAt',
      label: t('common:common.table.createdAt'),
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
      title: t('roomType:table.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo.field === 'name' ? sortedInfo.order : null
    },
    {
      title: t('common:common.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      fixed: 'right',
      width: 300
    },
    {
      title: t('common:common.table.action'),
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <TableActions
          onUpdate={() => {
            setEditId(record.id)
            setFormOpen(true)
          }}
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
          locale: { items_per_page: `${t('common:common.pagination.itemsPerPage')}` },
          showSizeChanger: true,
          ...paginationProps
        }}
        onChange={handleTableChange}
        loading={loading}
        locale={{
          triggerDesc: t('common.table.triggerDesc'),
          triggerAsc: t('common.table.triggerAsc'),
          cancelSort: t('common.table.cancelSort')
        }}
      />

      <Modal
        open={isModalOpen}
        className='w-96'
        title={<ConfirmModalTitle title={t('roomType:deleteModal.title')} />}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          deleteRoomTypeMutate(currentRecord!.id).then(() => {
            setCurrentRecord(null)
            setIsModalOpen(false)
            toast.success(t('roomType:notification.deleteSuccess'))
          })
        }}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deleteRoomTypeIsPending }}
        cancelButtonProps={{ disabled: deleteRoomTypeIsPending }}
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default RoomTypeTable
