import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import { useDeleteUser } from '@/hooks/useUsers'
import { UserDataSource } from '@/models/user.type'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import {
  Button,
  DescriptionsProps,
  Flex,
  Form,
  Modal,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
  Tooltip
} from 'antd'
import { useState } from 'react'
import { TableRowSelection } from 'antd/es/table/interface'
import UserDetailsModal from '@/features/user/UserDetailsModal.tsx'
import UserUpdateRoleModal from '@/features/user/UserUpdateRoleModal.tsx'
import BlockUserButton from '@/components/BlockUserButton.tsx'
import { useRolesAll } from '@/hooks/useRoles'

const { confirm } = Modal

interface UserTableProps {
  dataSource: UserDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<UserDataSource>['onChange']
  rowSelection: TableRowSelection<UserDataSource> | undefined
}

function UserTable({
                     dataSource,
                     loading,
                     paginationProps,
                     handleTableChange,
                     rowSelection,
                   }: UserTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateRolesModalOpen, setIsUpdateRolesModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserDataSource | null>(null)
  const [form] = Form.useForm()

  const { data: roleData, isLoading: roleIsLoading } = useRolesAll()

  const { deleteUserMutate } = useDeleteUser()


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

  const showDeleteConfirm = (record: UserDataSource) => {

    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: 'Id',
        children: <span>{record.id}</span>,
        span: 3
      },
      {
        key: '2',
        label: 'Họ',
        children: <span>{record.firstName}</span>,
        span: 3
      },
      {
        key: '3',
        label: 'Tên',
        children: <span>{record.lastName}</span>,
        span: 3
      },
      {
        key: '4',
        label: 'Email',
        children: <span>{record.email}</span>,
        span: 3
      }
    ]

    confirm({
      icon: null,
      title: <ConfirmModalTitle title="Xác nhận xóa tài khoản" />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deleteUserMutate(record.id)
      }
    })
  }

  const columns: TableProps<UserDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'id',
      fixed: 'left',
      width: 50
    },
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
      fixed: 'left',
      width: 150
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
      fixed: 'left',
      width: 200
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      filterMultiple: false,
      filters: [
        ...roleData?.map((role) => ({ text: role.name, value: role.name })) || []
      ],
      render: (_, record: UserDataSource) => (
        <Flex justify="space-between" align="center">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {record.roles.map((role, index) => (
              <Tag key={index} color="blue">
                {role}
              </Tag>
            ))}
          </div>
          <Tooltip title="Cập nhật vai trò">
            <Button icon={<EditOutlined />}
                    disabled={record.username === 'admin'}
                    onClick={() => handleUpdateRoles(record)} />
          </Tooltip>
        </Flex>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      fixed: 'right',
      width: 150
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record: UserDataSource) => (
        <Flex gap={16}>
          <Tooltip title="Xem nhanh">
            <Button
              icon={<EyeOutlined />}
              disabled={record.username === 'admin'}
              style={
                record.username === 'admin'
                  ? {}
                  : { borderColor: '#1890ff', color: '#1890ff' }
              }
              onClick={() => handleView(record)}
            />
          </Tooltip>

          <BlockUserButton record={record} />

          <Tooltip title="Xóa tài khoản">
            <Button icon={<DeleteOutlined />}
                    disabled={record.username === 'admin'}
                    onClick={() => showDeleteConfirm(record)} danger />
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
          locale: { items_per_page: '/ trang' },
          showSizeChanger: true,
          ...paginationProps
        }}
        onChange={handleTableChange}
        loading={loading || roleIsLoading}
        locale={{
          triggerDesc: 'Sắp xếp giảm dần',
          triggerAsc: 'Sắp xếp tăng dần',
          cancelSort: 'Hủy sắp xếp'
        }}
      />

      {/* Modal xem chi tiết */}
      <UserDetailsModal isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        currentUser={currentUser} />

      {/* Modal chỉnh sửa */}
      <UserUpdateRoleModal isUpdateRolesModalOpen={isUpdateRolesModalOpen}
                           setIsUpdateRolesModalOpen={setIsUpdateRolesModalOpen}
                           currentUser={currentUser} />

    </>
  )
}

export default UserTable
