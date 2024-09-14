import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import TableActions from '@/components/TableActions.tsx'
import { useDeleteCity } from '@/hooks/useCities.ts'
import { CityDataSource } from '@/models/city.type.ts'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface CityTableProps {
  dataSource: CityDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<CityDataSource>['onChange']
  rowSelection: TableRowSelection<CityDataSource> | undefined
  sortedInfo: SorterResult<CityDataSource>
  setEditId: React.Dispatch<React.SetStateAction<number | null>>
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function CityTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  sortedInfo,
  setEditId,
  setFormOpen
}: CityTableProps) {
  const { t } = useTranslation(['common', 'city'])

  const { deleteCityMutate, deleteCityPending } = useDeleteCity()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<CityDataSource | null>(null)

  const items: DescriptionsProps['items'] = [
    {
      key: '2',
      label: t('city:table.name'),
      children: <span>{currentRecord?.name}</span>,
      span: 3
    },
    {
      key: '3',
      label: t('common.table.createdAt'),
      children: <span>{currentRecord?.createdAt}</span>,
      span: 3
    }
  ]

  const columns: TableProps<CityDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: t('city:table.name'),
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
          locale: { items_per_page: `/ ${t('common.pagination.itemsPerPage')}` },
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
        title={<ConfirmModalTitle title={t('city:deleteModal.title')} />}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deleteCityPending }}
        cancelButtonProps={{ disabled: deleteCityPending }}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          deleteCityMutate(currentRecord!.id).then(() => {
            setCurrentRecord(null)
            setIsModalOpen(false)
            toast.success(t('city:notification.deleteSuccess'))
          })
        }}
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default CityTable
