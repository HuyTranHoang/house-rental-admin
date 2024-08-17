import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import { useDeleteUser, useLockUser } from '@/hooks/useUsers'
import { UserDataSource } from '@/models/user.type'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  WarningOutlined
} from '@ant-design/icons'
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
import LockButton from '@/components/LockButton.tsx'
import UserDetailsModal from '@/features/user/UserDetailsModal.tsx'
import UserUpdateRoleModal from '@/features/user/UserUpdateRoleModal.tsx'
import { gray, green, red, volcano } from '@ant-design/colors'

const { confirm } = Modal

interface UserTableProps {
  dataSource: UserDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<UserDataSource>['onChange']
  rowSelection: TableRowSelection<UserDataSource> | undefined
  isNonLocked: boolean
}

function UserTable({
                     dataSource,
                     loading,
                     paginationProps,
                     handleTableChange,
                     rowSelection,
                     isNonLocked
                   }: UserTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateRolesModalOpen, setIsUpdateRolesModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserDataSource | null>(null)
  const [form] = Form.useForm()

  const { lockUserMutate } = useLockUser()
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

  const handleBlockUser = (record: UserDataSource) => {
    confirm({
      icon: null,
      title:
        <Flex vertical align="center">
          <Flex justify="center" align="center"
                style={{
                  backgroundColor: isNonLocked ? volcano[0] : green[0],
                  width: 44,
                  height: 44,
                  borderRadius: '100%'
                }}>
            {isNonLocked
              ? <LockOutlined style={{ color: volcano.primary, fontSize: 24 }} />
              : <UnlockOutlined style={{ color: green.primary, fontSize: 24 }} />
            }
          </Flex>
          <span style={{ margin: '6px 0' }}>
          {isNonLocked ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
        </span>
        </Flex>,
      content: (
        <Flex vertical gap={8} style={{marginBottom: 16}}>
          <span>
            {isNonLocked
              ? `Bạn có chắc chắn muốn khóa tài khoản `
              : `Bạn có chắc chắn muốn mở khóa tài khoản `
            }
            <b style={{color: gray.primary}}>{record.username}</b> không?
          </span>
          <span style={{ color: red.primary }}>
            <WarningOutlined style={{ color: red.primary }} />{' '}
            {isNonLocked
              ? 'Khóa tài khoản sẽ không cho phép người dùng đăng nhập vào hệ thống.'
              : 'Mở khóa tài khoản sẽ cho phép người dùng đăng nhập vào hệ thống.'
            }
          </span>
        </Flex>
      ),
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        lockUserMutate(record.id)
      },
      okButtonProps: {
        style: {
          backgroundColor: isNonLocked ? volcano.primary : green.primary,
          borderColor: isNonLocked ? volcano[0] : green[0]
        }
      }
    })
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

          <LockButton isNonLocked={isNonLocked} record={record} handleBlockUser={handleBlockUser} />

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
        loading={loading}
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
