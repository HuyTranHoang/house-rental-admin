import { DescriptionsProps, Modal, Table, TablePaginationConfig, TableProps, Tag } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { RoleDataSource } from '../../models/role.type.ts'
import TableActions from '../../components/TableActions.tsx'
import { useNavigate } from 'react-router-dom'
import { CityDataSource } from '../../models/city.type.ts'
import ConfirmModalTitle from '../../components/ConfirmModalTitle.tsx'
import ConfirmModalContent from '../../components/ConfirmModalContent.tsx'
import { authorityPrivilegesMap } from './authorityPrivilegesMap.ts'

const { confirm } = Modal

interface RoleTableProps {
  dataSource: RoleDataSource[];
  loading: boolean;
  paginationProps: false | TablePaginationConfig | undefined;
  handleTableChange: TableProps<RoleDataSource>['onChange'];
  rowSelection: TableRowSelection<RoleDataSource> | undefined
}

function RoleTable({
                     dataSource,
                     loading,
                     paginationProps,
                     handleTableChange,
                     rowSelection
                   }: RoleTableProps) {
  const navigate = useNavigate()

  const showDeleteConfirm = (record: CityDataSource) => {

    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: 'Id',
        children: <span>{record.id}</span>,
        span: 3
      },
      {
        key: '2',
        label: 'Tên vai trò',
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
      title: <ConfirmModalTitle title="Xác nhận xóa vai trò" />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        alert('Chưa có làm =))')
        // deleteCityMutate(record.id)
      }
    })
  }

  const columns: TableProps<RoleDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 50
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Quyền hạn',
      dataIndex: 'authorityPrivileges',
      key: 'authorityPrivileges',
      render: (authorityPrivileges: string[]) => (
        <>
          {authorityPrivileges.map(authorityPrivilege => {
            const [label, color] = authorityPrivilegesMap[authorityPrivilege] || [authorityPrivilege, 'gray']
            return <Tag color={color} key={authorityPrivilege}>{label}</Tag>
          })}
        </>
      )
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
        <TableActions onUpdate={() => navigate(`/role/${record.id}/edit`)}
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

export default RoleTable
