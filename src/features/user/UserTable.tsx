import BlockUserButton from '@/components/BlockUserButton.tsx'
import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import UserDetailsModal from '@/features/user/UserDetailsModal.tsx'
import UserUpdateRoleModal from '@/features/user/UserUpdateRoleModal.tsx'
import { useRolesAll } from '@/hooks/useRoles'
import { useDeleteUser } from '@/hooks/useUsers'
import { UserDataSource } from '@/models/user.type'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import {
  Button,
  DescriptionsProps,
  Flex,
  Form,
  Modal,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
  Tooltip
} from 'antd'
import { FilterValue, TableRowSelection } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface UserTableProps {
  dataSource: UserDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<UserDataSource>['onChange']
  rowSelection: TableRowSelection<UserDataSource> | undefined
  filteredInfo: Record<string, FilterValue | null>
  sortedInfo: SorterResult<UserDataSource>
}

function UserTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection,
  filteredInfo,
  sortedInfo
}: UserTableProps) {
  const { t } = useTranslation(['common', 'user'])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isUpdateRolesModalOpen, setIsUpdateRolesModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserDataSource | null>(null)
  const [form] = Form.useForm()

  const { data: roleData, isLoading: roleIsLoading } = useRolesAll()

  const { deleteUserMutate, deleteUserIsPending } = useDeleteUser()

  const handleView = (record: UserDataSource) => {
    setCurrentUser(record)
    setIsModalOpen(true)
  }

  const handleUpdateRoles = (record: UserDataSource) => {
    setCurrentUser(record)
    form.setFieldsValue({
      username: record.username,
      roles: record.roles
    })
    setIsUpdateRolesModalOpen(true)
  }

  const items: DescriptionsProps['items'] = [
    {
      key: 'firstName',
      label: t('user:table.firstName'),
      children: <span>{currentUser?.firstName}</span>,
      span: 3
    },
    {
      key: 'lastName',
      label: t('user:table.lastName'),
      children: <span>{currentUser?.lastName}</span>,
      span: 3
    },
    {
      key: 'email',
      label: t('user:table.email'),
      children: <span>{currentUser?.email}</span>,
      span: 3
    }
  ]

  const columns: TableProps<UserDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'id',
      width: 50
    },
    {
      title: t('user:table.username'),
      dataIndex: 'username',
      key: 'username',
      sorter: true,
      sortOrder: sortedInfo.field === 'username' ? sortedInfo.order : null,
      width: 200
    },
    {
      title: t('user:table.email'),
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      sortOrder: sortedInfo.field === 'email' ? sortedInfo.order : null,
      fixed: 'left',
      width: 200
    },
    {
      title: t('user:table.roles'),
      dataIndex: 'roles',
      key: 'roles',
      filterMultiple: false,
      filteredValue: filteredInfo.roles || null,
      filters: [...(roleData?.map((role) => ({ text: role.name, value: role.name })) || [])],
      render: (_, record: UserDataSource) => (
        <Flex justify='space-between' align='center'>
          <Space>
            {record.roles.map((role, index) => (
              <Tag key={index} color='blue'>
                {role}
              </Tag>
            ))}
          </Space>
          <Tooltip title={t('user:table.tooltips.editRole')}>
            <Button
              icon={<EditOutlined />}
              disabled={record.username === 'admin'}
              onClick={() => handleUpdateRoles(record)}
            />
          </Tooltip>
        </Flex>
      )
    },
    {
      title: t('common.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      width: 250
    },
    {
      title: t('common.table.action'),
      key: 'action',
      width: 110,
      render: (_, record: UserDataSource) => (
        <Flex gap={16}>
          <Tooltip title={t('user:table.tooltips.quickView')}>
            <Button
              icon={<EyeOutlined />}
              disabled={record.username === 'admin'}
              className={record.username === 'admin' ? 'disabled' : 'border-blue-500 text-blue-500'}
              onClick={() => handleView(record)}
            />
          </Tooltip>

          <BlockUserButton record={record} />

          <Tooltip title={t('user:table.tooltips.delete')}>
            <Button
              icon={<DeleteOutlined />}
              disabled={record.username === 'admin'}
              onClick={() => {
                setCurrentUser(record)
                setIsDeleteModalOpen(true)
              }}
              danger
            />
          </Tooltip>
        </Flex>
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
        loading={loading || roleIsLoading}
        locale={{
          triggerDesc: t('common.table.triggerDesc'),
          triggerAsc: t('common.table.triggerAsc'),
          cancelSort: t('common.table.cancelSort'),
          filterConfirm: t('common.table.filterConfirm'),
          filterReset: t('common.table.filterReset')
        }}
      />

      {/* Modal xem chi tiết */}
      <UserDetailsModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} currentUser={currentUser} />

      {/* Modal chỉnh sửa */}
      <UserUpdateRoleModal
        isUpdateRolesModalOpen={isUpdateRolesModalOpen}
        setIsUpdateRolesModalOpen={setIsUpdateRolesModalOpen}
        currentUser={currentUser}
      />

      <Modal
        open={isDeleteModalOpen}
        className='w-96'
        title={<ConfirmModalTitle title={t('user:deleteModal.title')} />}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deleteUserIsPending }}
        cancelButtonProps={{ disabled: deleteUserIsPending }}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={() => {
          deleteUserMutate(currentUser!.id).then(() => {
            setCurrentUser(null)
            setIsModalOpen(false)
            toast.success(t('user:notification.deleteSuccess'))
          })
        }}
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default UserTable
