import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import TableActions from '@/components/TableActions.tsx'
import { useDeleteRole } from '@/hooks/useRoles.ts'
import { CityDataSource } from '@/models/city.type.ts'
import { RoleDataSource } from '@/models/role.type.ts'
import { DescriptionsProps, Modal, Space, Table, TablePaginationConfig, TableProps, Tag } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { useNavigate } from 'react-router-dom'
import { authorityPrivilegesFilterMap, authorityPrivilegesMap } from './authorityPrivilegesMap.ts'
import { useTranslation } from 'react-i18next'

const { confirm } = Modal

interface RoleTableProps {
  dataSource: RoleDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<RoleDataSource>['onChange']
  rowSelection: TableRowSelection<RoleDataSource> | undefined
}

function RoleTable({ dataSource, loading, paginationProps, handleTableChange, rowSelection }: RoleTableProps) {
  const navigate = useNavigate()
  const { t } = useTranslation(['common', 'role'])

  const { deleteRoleMutate } = useDeleteRole()

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
        label: t('role:form.roleName'),
        children: <span>{record.name}</span>,
        span: 3
      },
      {
        key: '3',
        label: t('common:common.table.createdAt'),
        children: <span>{record.createdAt}</span>,
        span: 3
      }
    ]

    confirm({
      icon: null,
      title: <ConfirmModalTitle title={t('role:deleteModal.title')} />,
      content: <ConfirmModalContent items={items} />,
      okText: t('common.ok'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      maskClosable: true,
      onOk() {
        deleteRoleMutate(record.id)
      }
    })
  }

  const columns: TableProps<RoleDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: t('role:form.roleName'),
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: t('role:form.authority'),
      dataIndex: 'authorityPrivileges',
      key: 'authorityPrivileges',
      filterSearch: true,
      filterMode: 'tree',
      filters: authorityPrivilegesFilterMap,
      onFilter: (value, record) => record.authorityPrivileges.includes(value as string),
      render: (authorityPrivileges: string[]) => (
        <Space size='small' wrap>
          {authorityPrivileges.map((authorityPrivilege) => {
            const [label, color] = authorityPrivilegesMap[authorityPrivilege] || [authorityPrivilege, 'gray']
            return (
              <Tag color={color} key={authorityPrivilege}>
                {label}
              </Tag>
            )
          })}
        </Space>
      )
    },
    {
      title: t('common:common.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
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
          disabled={record.name === 'ROLE_ADMIN'}
          onUpdate={() => navigate(`/role/${record.id}/edit`)}
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
        locale: { items_per_page: t('common.pagination.itemsPerPage') },
        showSizeChanger: true,
        ...paginationProps
      }}
      onChange={handleTableChange}
      loading={loading}
      locale={{
        triggerDesc: t('common.table.triggerDesc'),
        triggerAsc: t('common.table.triggerAsc'),
        cancelSort: t('common.table.cancelSort'),
        filterReset: t('role:page.filter'),
        filterConfirm: t('role:page.unFilter'),
        filterSearchPlaceholder: t('role:page.search'),
        filterCheckall: t('role:form.selectAll')
      }}
    />
  )
}

export default RoleTable
