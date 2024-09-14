import { useRolesWithoutParams } from '@/hooks/useRoles.ts'
import { useUpdateRoleForUser } from '@/hooks/useUsers.ts'
import { Role, RoleDataSource } from '@/models/role.type.ts'
import { UserDataSource } from '@/models/user.type.ts'
import { Checkbox, Form, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

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
  const { t } = useTranslation(['common', 'user'])

  const { data } = useRolesWithoutParams()
  const { updateRoleForUserMutate, updateRoleForUserIsPending } = useUpdateRoleForUser()

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
          }).then(() => {
            toast.success('Cập nhật vai trò thành công!')
            setIsUpdateRolesModalOpen(false)
          })
        }
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
      title={t('user:updateRoleModal.title') + ` '${currentUser?.username}'`}
      open={isUpdateRolesModalOpen}
      onCancel={handleUpdateRolesModalCancel}
      onOk={handleUpdateRolesModalOk}
      okText={t('common.ok')}
      cancelText={t('common.cancel')}
      okButtonProps={{ loading: updateRoleForUserIsPending }}
      cancelButtonProps={{ disabled: updateRoleForUserIsPending }}
    >
      {currentUser && (
        <Form
          form={form}
          layout='vertical'
          initialValues={{ username: currentUser.username, roles: currentUser.roles }}
        >
          <Form.Item
            name='roles'
            label={t('user:updateRoleModal.form.roles')}
            rules={[{ required: true, message: t('user:updateRoleModal.form.roleRequired') }]}
          >
            <Checkbox.Group>
              {roleDataSource.map((role) => (
                <Checkbox key={role.id} value={role.name} className='my-1'>
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
