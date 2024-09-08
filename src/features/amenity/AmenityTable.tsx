import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import TableActions from '@/components/TableActions.tsx'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { useDeleteAmenity } from '@/hooks/useAmenities.ts'
import { AmenityDataSource } from '@/models/amenity.type.ts'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface AmenityTableProps {
  dataSource: AmenityDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<AmenityDataSource>['onChange']
  rowSelection: TableRowSelection<AmenityDataSource> | undefined
  sortedInfo: SorterResult<AmenityDataSource>
}

function AmenityTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  sortedInfo
}: AmenityTableProps) {
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<AmenityDataSource | null>(null)

  const { deleteAmenityMutate } = useDeleteAmenity()

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Id',
      children: <span>{currentRecord?.id}</span>,
      span: 3
    },
    {
      key: '2',
      label: 'Tên tiện nghi',
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

  const columns: TableProps<AmenityDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: 'Tên tiện nghi',
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
          onUpdate={() => navigate(ROUTER_NAMES.getAmenityEditPath(record.id))}
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
        title={<ConfirmModalTitle title='Xác nhận xóa tiện nghi' />}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          deleteAmenityMutate(currentRecord!.id)
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

export default AmenityTable
