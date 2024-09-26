import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import TableActions from '@/components/TableActions.tsx'
import { useDeleteAmenity } from '@/hooks/useAmenities.ts'
import { AmenityDataSource } from '@/types/amenity.type.ts'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AmenityTableProps {
  dataSource: AmenityDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<AmenityDataSource>['onChange']
  rowSelection: TableRowSelection<AmenityDataSource> | undefined
  sortedInfo: SorterResult<AmenityDataSource>
  onEdit: (id: number) => void
}

function AmenityTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  sortedInfo,
  onEdit
}: AmenityTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<AmenityDataSource | null>(null)

  const { deleteAmenityMutate, deleteAmenityPending } = useDeleteAmenity()
  const { t } = useTranslation(['common', 'amenity'])

  const items: DescriptionsProps['items'] = [
    {
      key: 'name',
      label: t('amenity:table.name'),
      children: <span>{currentRecord?.name}</span>,
      span: 3
    },
    {
      key: 'createdAt',
      label: t('common.table.createdAt'),
      children: <span>{currentRecord?.createdAt}</span>,
      span: 3
    }
  ]

  const columns: TableProps<AmenityDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: t('amenity:table.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo.field === 'name' ? sortedInfo.order : null
    },
    {
      title: t('common.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      fixed: 'right',
      width: 300
    },
    {
      title: t('common.table.action'),
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <TableActions
          onUpdate={() => onEdit(record.id)}
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
          locale: { items_per_page: `${t('common.pagination.itemsPerPage')}` },
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
        title={<ConfirmModalTitle title={t('amenity:deleteModal.title')} />}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deleteAmenityPending }}
        cancelButtonProps={{ disabled: deleteAmenityPending }}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          deleteAmenityMutate(currentRecord!.id).then(() => {
            setCurrentRecord(null)
            setIsModalOpen(false)
            toast.success(t('amenity:notification.deleteSuccess'))
          })
        }}
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default AmenityTable
