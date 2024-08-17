import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import { useRolesWithoutParams } from '@/hooks/useRoles'
import { useDeleteUser, useLockUser, useUpdateRoleForUser } from '@/hooks/useUsers'
import { Role, RoleDataSource } from '@/models/role.type'
import { UserDataSource } from '@/models/user.type'
import { DeleteOutlined, EditOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Checkbox,
  Col,
  DescriptionsProps,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
  Tooltip
} from 'antd'
import { useState } from 'react'
import { TableRowSelection } from 'antd/es/table/interface'
import { green, volcano } from '@ant-design/colors'
import styled from 'styled-components'

const { confirm } = Modal

interface UserTableProps {
  dataSource: UserDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<UserDataSource>['onChange']
  rowSelection: TableRowSelection<UserDataSource> | undefined
  isNonLocked: boolean
}

interface LockButtonProps {
  isNonLocked: boolean
  record: UserDataSource
  handleBlockUser: (record: UserDataSource) => void
}

const StyledButton = styled(Button)<{ isNonLocked: boolean; isAdmin: boolean }>`
    color: ${({ isNonLocked, isAdmin }) => 
            (isAdmin ? 'inherit' : isNonLocked ? volcano.primary : green.primary)};
    border-color: ${({ isNonLocked, isAdmin }) => 
            (isAdmin ? 'inherit' : isNonLocked ? volcano.primary : green.primary)};
`

const LockButton = ({ isNonLocked, record, handleBlockUser }: LockButtonProps) => (
  <StyledButton
    icon={
      isNonLocked ? (
        <LockOutlined style={{ color: record.username === 'admin' ? 'inherit' : volcano.primary }} />
      ) : (
        <UnlockOutlined style={{ color: record.username === 'admin' ? 'inherit' : green.primary }} />
      )
    }
    disabled={record.username === 'admin'}
    onClick={() => handleBlockUser(record)}
    isNonLocked={isNonLocked}
    isAdmin={record.username === 'admin'}
  />
)

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
  const [, setError] = useState<string>('')

  const { data } = useRolesWithoutParams()
  const { updateRoleForUserMutate } = useUpdateRoleForUser(setError)
  const { lockUserMutate } = useLockUser()
  const { deleteUserMutate } = useDeleteUser()


  const roleDataSource: RoleDataSource[] = data
    ? data.map((role: Role) => ({
      key: role.id,
      id: role.id,
      name: role.name,
      description: role.description,
      authorityPrivileges: role.authorityPrivileges,
      createdAt: role.createdAt
    }))
    : []

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
      title: isNonLocked
        ? 'Bạn có chắc chắn muốn khóa tài khoản này?'
        : 'Bạn có chắc chắn muốn mở khóa tài khoản này?',
      onOk() {
        console.log('Khóa người dùng', record.id)
        lockUserMutate(record.id)
      }
    })
  }

  const handleUpdateRolesModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (currentUser) {
          updateRoleForUserMutate({
            id: currentUser.id,
            roles: values.roles
          })
        }
        setIsUpdateRolesModalOpen(false)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleUpdateRolesModalCancel = () => {
    setIsUpdateRolesModalOpen(false)
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

          <Tooltip title={isNonLocked ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}>
            <LockButton isNonLocked={isNonLocked} record={record} handleBlockUser={handleBlockUser} />
          </Tooltip>

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
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        {currentUser && (
          <div>
            {/* Hàng đầu tiên */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              {/* Cột bên trái */}
              <Col span={8} style={{ textAlign: 'center' }}>
                <Avatar
                  size={100}
                  src={
                    currentUser.avatarUrl ||
                    `https://robohash.org/${currentUser.username}?set=set4`
                  }
                  style={{ marginBottom: '16px' }}
                />
                <p><b>{currentUser.username}</b></p>
              </Col>

              {/* Cột bên phải */}
              <Col span={16}>
                <Row>
                  <p style={{ marginBottom: '3px' }}><b>Họ và
                    Tên:</b> {`${currentUser.firstName} ${currentUser.lastName}`}</p>
                  <p style={{ marginBottom: '3px' }}><b>Email:</b> {currentUser.email}</p>
                  <p style={{ marginBottom: '3px' }}><b>Số điện thoại:</b> {currentUser.phoneNumber}</p>
                  <p style={{ marginBottom: '3px' }}><b>Ngày tạo:</b> {currentUser.createdAt}</p>
                </Row>
              </Col>
            </Row>

            {/* Hàng tiếp theo */}
            <Row>
              <Col span={24}>
                <p>
                  <b>Vai trò:</b>
                  {currentUser.roles.map(role => (
                    <Tag key={role} color="blue" style={{ margin: '4px' }}>
                      {role}
                    </Tag>
                  ))}
                </p>
                <p>
                  <b>Quyền hạn:</b>
                  {currentUser.authorities.map(auth => (
                    <Tag key={auth} color="green" style={{ margin: '4px' }}>
                      {auth}
                    </Tag>
                  ))}
                </p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Cập nhật vai trò"
        open={isUpdateRolesModalOpen}
        onCancel={handleUpdateRolesModalCancel}
        onOk={handleUpdateRolesModalOk}
      >
        {currentUser && (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ username: currentUser.username, roles: currentUser.roles }}
          >
            <Form.Item name="username" label="Tài khoản">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="roles"
              label="Vai trò"
              rules={[{ required: true, message: 'Vui lòng chọn ít nhất một vai trò!' }]}
            >
              <Checkbox.Group>
                {roleDataSource.map((role) => (
                  <Checkbox key={role.id} value={role.name}>
                    {role.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  )
}

export default UserTable
