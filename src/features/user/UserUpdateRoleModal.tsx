import { useRolesWithoutParams } from '@/hooks/useRoles.ts'
import { useUpdateRoleForUser } from '@/hooks/useUsers.ts'
import { Role, RoleDataSource } from '@/models/role.type.ts'
import { UserDataSource } from '@/models/user.type.ts'
import { Checkbox, Form, Input, Modal } from 'antd'
import { useState } from 'react'

interface UserUpdateRoleModalProps {
  isUpdateRolesModalOpen: boolean
  setIsUpdateRolesModalOpen: (isOpen: boolean) => void
  currentUser: UserDataSource | null
}

function UserUpdateRoleModal({
  isUpdateRolesModalOpen,
  setIsUpdateRolesModalOpen,
  currentUser
}: UserUpdateRoleModalProps) {
  const [form] = Form.useForm()
  const [, setError] = useState<string>('')

  const { data } = useRolesWithoutParams()
  const { updateRoleForUserMutate } = useUpdateRoleForUser(setError)

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

  return (
    <Modal
      title='Cập nhật vai trò'
      open={isUpdateRolesModalOpen}
      onCancel={handleUpdateRolesModalCancel}
      onOk={handleUpdateRolesModalOk}
      okText='Cập nhật'
      cancelText='Hủy'
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
  )
}

export default UserUpdateRoleModal
