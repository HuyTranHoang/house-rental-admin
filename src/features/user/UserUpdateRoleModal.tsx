import { useRolesAll } from '@/hooks/useRoles.ts'
import { useUpdateRoleForUser } from '@/hooks/useUsers.ts'
import { UserDataSource } from '@/types/user.type.ts'
import { Button, Checkbox, Flex, Form, Modal, Tooltip } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { InfoCircleOutlined } from '@ant-design/icons'

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

  const { data } = useRolesAll()
  const { updateRoleForUserMutate, updateRoleForUserIsPending } = useUpdateRoleForUser()

  const checkBoxOptions = data
    ? data
      .filter((role) => role.name !== 'Super Admin')
      .map((role) => ({
        label: role.name,
        value: role.name,
        description: role.description
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
            <Checkbox.Group className='space-x-4'>
              {checkBoxOptions.map((role, index) => (
                <div key={index}>
                  <Checkbox value={role.value}>
                    {role.label}
                  </Checkbox>
                  <Tooltip title={role.description}>
                    <InfoCircleOutlined className="text-blue-500 cursor-help" />
                  </Tooltip>
                </div>
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