import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import TableActions from '@/components/TableActions.tsx'
import { useDeleteMemberShip } from '@/hooks/useMemberships.ts'
import { MemberShipDataSource } from '@/types/membership.type'
import { formatCurrency } from '@/utils/formatCurrentcy.ts'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface MemberShipTableProps {
  dataSource: MemberShipDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<MemberShipDataSource>['onChange']
  rowSelection: TableRowSelection<MemberShipDataSource> | undefined
  sortedInfo: SorterResult<MemberShipDataSource>
  onEdit: (id: number) => void
}

function MemberShipTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  sortedInfo,
  onEdit
}: MemberShipTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<MemberShipDataSource | null>(null)

  const { deleteMemberShipMutant, deleteMemberShipPending } = useDeleteMemberShip()
  const { t } = useTranslation(['common', 'membership'])

  const items: DescriptionsProps['items'] = [
    {
      key: 'name',
      label: t('membership:form.name'),
      children: <span>{currentRecord?.name}</span>,
      span: 3
    },
    {
      key: 'price',
      label: t('membership:form.price'),
      children: <span>{formatCurrency(Number(currentRecord?.price))}</span>,
      span: 3
    },
    {
      key: 'createdAt',
      label: t('common.table.createdAt'),
      children: <span>{currentRecord?.createdAt}</span>,
      span: 3
    }
  ]

  const columns: TableProps<MemberShipDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: t('membership:form.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo.field === 'name' ? sortedInfo.order : null
    },
    {
      title: t('membership:form.price'),
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      render: (price) => formatCurrency(price),
      sortOrder: sortedInfo.field === 'price' ? sortedInfo.order : null
    },
    {
      title: t('membership:form.durationDays'),
      dataIndex: 'durationDays',
      key: 'durationDays',
      sorter: true,
      sortOrder: sortedInfo.field === 'durationDays' ? sortedInfo.order : null
    },
    {
      title: t('membership:form.refresh'),
      dataIndex: 'refresh',
      key: 'refresh',
      sorter: true,
      sortOrder: sortedInfo.field === 'refresh' ? sortedInfo.order : null
    },
    {
      title: t('membership:form.priority'),
      dataIndex: 'priority',
      key: 'priority',
      sorter: true,
      sortOrder: sortedInfo.field === 'priority' ? sortedInfo.order : null
    },
    {
      title: t('membership:form.description'),
      dataIndex: 'description',
      key: 'description'
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
        title={<ConfirmModalTitle title={t('membership:deleteModal.title')} />}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deleteMemberShipPending }}
        cancelButtonProps={{ disabled: deleteMemberShipPending }}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          deleteMemberShipMutant(currentRecord!.id).then(() => {
            setCurrentRecord(null)
            setIsModalOpen(false)
            toast.success(t('membership:notification.deleteSuccess'))
          })
        }}
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default MemberShipTable
