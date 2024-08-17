import { useRolesWithoutParams } from '@/hooks/useRoles'
import { useUpdateRoleForUser } from '@/hooks/useUsers'
import { Role, RoleDataSource } from '@/models/role.type'
import { UserDataSource } from '@/models/user.type'
import { CloseCircleOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Modal, Table, TablePaginationConfig, TableProps, Tag, Form, Input, Checkbox, Descriptions, Card, Avatar } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface'
import { useState } from 'react'

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
  const [error, setError] = useState<string>('')

  const { data } = useRolesWithoutParams()
  const { updateRoleForUserMutate } = useUpdateRoleForUser(setError)

  const roleDataSource: RoleDataSource[] = data
    ? data.map((role: Role) => ({
        key: role.id,
        id: role.id,
        name: role.name,
        authorityPrivileges: role.authorityPrivileges
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
      title: 'Bạn có chắc chắn muốn khóa tài khoản này?',
      onOk() {
        console.log('Khóa người dùng', record.id)
        //
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
      key: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      render: (_, record: UserDataSource) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {record.roles.map((role, index) => (
              <Tag key={index} color='blue'>
                {role}
              </Tag>
            ))}
          </div>
          <Button icon={<EditOutlined />} type='default' onClick={() => handleUpdateRoles(record)} />
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record: UserDataSource) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Button
            icon={<EyeOutlined />}
            type='default'
            style={{ borderColor: '#1890ff', color: '#1890ff', marginRight: '1rem' }}
            onClick={() => handleView(record)}
          />
          <Button
            icon={<CloseCircleOutlined />}
            type='default'
            onClick={() => handleBlockUser(record)}
            danger
            disabled={!isNonLocked}
          >
            Khoá
          </Button>
        </div>
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
      <Modal title='Chi tiết tài khoản' open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} style={{width: 800}}>
      {currentUser && (
          <Card
            style={{ width: 450 }}
            cover={
              <Avatar
                size={100}
                //  Cần thêm api hiển thị avatar
                src={currentUser.avatarUrl || `https://robohash.org/{currentUser.username}`}
                style={{ margin: '0 auto', marginBottom: 16 }}
              />
            }
          >
            <Card.Meta
              title={currentUser.username}
              description={
                <>
                  <p>
                    <b>Họ và Tên:</b> {`${currentUser.firstName} ${currentUser.lastName}`}
                  </p>
                  <p><b>Email:</b> {currentUser.email}</p>
                  <p><b>Số điện thoại:</b> {currentUser.phoneNumber}</p>
                  <p><b>Vai trò:</b> {currentUser.roles.map(role => (
                    <Tag key={role} color='blue'>{role}</Tag>
                  ))}</p>
                  <p><b>Quyền hạn:</b> {currentUser.authorities.map(auth => (
                    <Tag key={auth} color='green'>{auth}</Tag>
                  ))}</p>
                  <p><b>Ngày tạo:</b> {currentUser.createdAt}</p>
                </>
              }
            />
          </Card>
        )}
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        title='Cập nhật vai trò'
        open={isUpdateRolesModalOpen}
        onCancel={handleUpdateRolesModalCancel}
        onOk={handleUpdateRolesModalOk}
      >
        {currentUser && (
          <Form
            form={form}
            layout='vertical'
            initialValues={{ username: currentUser.username, roles: currentUser.roles }}
          >
            <Form.Item name='username' label='Tài khoản'>
              <Input disabled />
            </Form.Item>
            <Form.Item
              name='roles'
              label='Vai trò'
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
