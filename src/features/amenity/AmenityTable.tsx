import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { useNavigate } from 'react-router-dom'
import { useDeleteAmenity } from '@/hooks/useAmenities.ts'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import TableActions from '@/components/TableActions.tsx'
import { AmenityDataSource } from '@/models/amenity.type.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { SorterResult } from 'antd/lib/table/interface'

const { confirm } = Modal

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
  const { deleteAmenityMutate } = useDeleteAmenity()

  const showDeleteConfirm = (record: AmenityDataSource) => {

    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: 'Id',
        children: <span>{record.id}</span>,
        span: 3
      },
      {
        key: '2',
        label: 'Tên tiện nghi',
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
      title: <ConfirmModalTitle title="Xác nhận xóa tiện nghi" />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deleteAmenityMutate(record.id)
      }
    })
  }

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
        <TableActions onUpdate={() => navigate(ROUTER_NAMES.getAmenityEditPath(record.id))}
                      onDelete={() => showDeleteConfirm(record)} />
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

export default AmenityTable
