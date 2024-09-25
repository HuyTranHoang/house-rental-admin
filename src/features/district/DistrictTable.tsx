import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import TableActions from '@/components/TableActions.tsx'
import { useCitiesAll } from '@/hooks/useCities.ts'
import { useDeleteDistrict } from '@/hooks/useDistricts.ts'
import { DistrictDataSource } from '@/models/district.type.ts'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { FilterValue, TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface DistrictTableProps {
  dataSource: DistrictDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<DistrictDataSource>['onChange']
  rowSelection: TableRowSelection<DistrictDataSource> | undefined
  filteredInfo: Record<string, FilterValue | null>
  sortedInfo: SorterResult<DistrictDataSource>
  onEdit: (id: number) => void
}

function DistrictTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  filteredInfo,
  sortedInfo,
  onEdit
}: DistrictTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<DistrictDataSource | null>(null)

  const { cityData, cityIsLoading } = useCitiesAll()
  const { deleteDistrictMutate } = useDeleteDistrict()
  const { t } = useTranslation(['common', 'district'])

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Id',
      children: <span>{currentRecord?.id}</span>,
      span: 3
    },
    {
      key: '2',
      label: t('district:table.name'),
      children: <span>{currentRecord?.name}</span>,
      span: 3
    },
    {
      key: '3',
      label: t('district:form.city'),
      children: <span>{currentRecord?.cityName}</span>,
      span: 3
    },
    {
      key: '4',
      label: t('common.table.createdAt'),
      children: <span>{currentRecord?.createdAt}</span>,
      span: 3
    }
  ]

  const columns: TableProps<DistrictDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: t('district:table.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo.field === 'name' ? sortedInfo.order : null
    },
    {
      title: t('district:form.city'),
      dataIndex: 'cityName',
      key: 'cityName',
      sorter: true,
      sortOrder: sortedInfo.field === 'cityName' ? sortedInfo.order : null,
      filterMultiple: false,
      filters: [...(cityData?.map((city) => ({ text: city.name, value: city.id })) || [])],
      filteredValue: filteredInfo.cityName || null
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
        onChange={handleTableChange}
        loading={loading || cityIsLoading}
        pagination={{
          position: ['bottomCenter'],
          pageSizeOptions: ['5', '10', '20'],
          locale: { items_per_page: `${t('common.pagination.itemsPerPage')}` },
          showSizeChanger: true,
          ...paginationProps
        }}
        locale={{
          triggerDesc: t('common.table.triggerDesc'),
          triggerAsc: t('common.table.triggerAsc'),
          cancelSort: t('common.table.cancelSort'),
          filterReset: t('common.table.filterReset'),
          filterConfirm: t('common.table.filterConfirm')
        }}
      />

      <Modal
        open={isModalOpen}
        className='w-96'
        title={<ConfirmModalTitle title={t('district:deleteModal.title')} />}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          deleteDistrictMutate(currentRecord!.id).then(() => {
            setCurrentRecord(null)
            setIsModalOpen(false)
            toast.success(t('district:notification.deleteSuccess'))
          })
          setIsModalOpen(false)
        }}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default DistrictTable
