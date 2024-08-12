import { DistrictDataSource } from '@/models/district.type.ts'
import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { TableRowSelection } from 'antd/es/table/interface'
import { useDeleteDistrict } from '@/hooks/useDistricts.ts'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import TableActions from '@/components/TableActions.tsx'

const { confirm } = Modal

interface DistrictTableProps {
  dataSource: DistrictDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<DistrictDataSource>['onChange']
  rowSelection: TableRowSelection<DistrictDataSource> | undefined
}

function DistrictTable({ dataSource, loading, paginationProps, handleTableChange, rowSelection }: DistrictTableProps) {
  const navigate = useNavigate()
  const { deleteDistrictMutate } = useDeleteDistrict()

  const showDeleteConfirm = (record: DistrictDataSource) => {
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: 'Id',
        children: <span>{record.id}</span>,
        span: 3
      },
      {
        key: '2',
        label: 'Tên quận huyện',
        children: <span>{record.name}</span>,
        span: 3
      },
      {
        key: '3',
        label: 'Tên thành phố',
        children: <span>{record.cityName}</span>,
        span: 3
      },
      {
        key: '4',
        label: 'Ngày tạo',
        children: <span>{record.createdAt}</span>,
        span: 3
      }
    ]

    confirm({
      icon: null,
      title: <ConfirmModalTitle title='Xác nhận xóa quận huyện' />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deleteDistrictMutate(record.id)
      }
    })
  }

  const columns: TableProps<DistrictDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 50
    },
    {
      title: 'Tên thành phố',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Tên quận huyện',
      dataIndex: 'cityName',
      key: 'cityName',
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
        <TableActions
          onUpdate={() => navigate(`/district/${record.id}/edit`)}
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

export default DistrictTable
