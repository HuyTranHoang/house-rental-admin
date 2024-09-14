import { useRolesWithoutParams } from '@/hooks/useRoles.ts'
import { useUpdateRoleForUser } from '@/hooks/useUsers.ts'
import { UserDataSource } from '@/models/user.type.ts'
import { Button, Checkbox, Flex, Form, Modal } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface UserUpdateRoleModalProps {
  isUpdateRolesModalOpen: boolean
  setIsUpdateRolesModalOpen: (isOpen: boolean) => void
  currentUser: UserDataSource | null
}

interface UserUpdateRoleFormValues {
  id: number
  roles: string[]
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

  const checkBoxOptions = data
    ? data.map((role) => ({
        label: role.name,
        value: role.name
      }))
    : []

  const handleUpdateRoles = (values: UserUpdateRoleFormValues) => {
    updateRoleForUserMutate(values).then(() => {
      toast.success('Cập nhật vai trò thành công!')
      setIsUpdateRolesModalOpen(false)
    })
  }

  const handleUpdateRolesModalCancel = () => {
    setIsUpdateRolesModalOpen(false)
  }

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({ roles: currentUser.roles })
    }
  }, [currentUser, form])

  return (
    <Modal
      title={t('user:updateRoleModal.title') + ` '${currentUser?.username}'`}
      open={isUpdateRolesModalOpen}
      onCancel={handleUpdateRolesModalCancel}
      footer={null}
    >
      {currentUser && (
        <Form
          form={form}
          onFinish={handleUpdateRoles}
          layout='vertical'
          initialValues={{ id: currentUser.id, roles: currentUser.roles }}
        >
          <Form.Item name='id' label='id' hidden>
            <input />
          </Form.Item>
          <Form.Item
            name='roles'
            label={t('user:updateRoleModal.form.roles')}
            rules={[{ required: true, message: t('user:updateRoleModal.form.roleRequired') }]}
          >
            <Checkbox.Group>
              {checkBoxOptions.map((role, index) => (
                <Checkbox key={index} value={role.value} className='my-1'>
                  {role.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Flex gap={8} justify='end'>
            <Button type='primary' htmlType='submit' loading={updateRoleForUserIsPending}>
              {t('common.ok')}
            </Button>

            <Button onClick={handleUpdateRolesModalCancel}>{t('common.cancel')}</Button>
          </Flex>
        </Form>
      )}
    </Modal>
  )
}

export default UserUpdateRoleModal
