import { getRoleById, RoleField } from '@/api/role.api.ts'
import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter.ts'
import { useCreateRole, useDeleteRole, useRolesAll, useUpdateRole } from '@/hooks/useRoles.ts'
import useBoundStore from '@/store.ts'
import { Role } from '@/types/role.type.ts'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, FormInstance, type FormProps, Input, List, Modal, Space, Tooltip, Typography } from 'antd'
import { clsx } from 'clsx'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ListRoleProps {
  form: FormInstance
  setCurrentRole: React.Dispatch<React.SetStateAction<Role>>
  currentRole: Role
}

function RoleTable({ form, setCurrentRole, currentRole }: ListRoleProps) {
  const currentUser = useBoundStore((state) => state.user)

  const [isAddMode, setIsAddMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const [error, setError] = useState<string>('')
  const [formAddRole] = Form.useForm()
  const { t } = useTranslation(['common', 'role'])

  const isDarkMode = useBoundStore((state) => state.isDarkMode)
  const formatDate = useCustomDateFormatter()

  const { addRoleMutate, addRolePending } = useCreateRole(setError, setIsModalOpen, formAddRole)
  const { updateRoleMutate, updateRolePending } = useUpdateRole(setError, setIsModalOpen, formAddRole, setCurrentRole)
  const { deleteRoleMutate } = useDeleteRole()

  const { data, isLoading } = useRolesAll()

  const { data: roleUpdateData } = useQuery({
    queryKey: ['role', currentRole.id],
    queryFn: () => getRoleById(Number(currentRole.id)),
    enabled: currentRole.id !== undefined
  })

  const onFinishAddRole: FormProps<RoleField>['onFinish'] = (values) => {
    if (isAddMode) {
      values.authorityPrivileges = ['user:read', 'user:update']
      addRoleMutate(values)
    } else {
      updateRoleMutate({ ...values, id: currentRole.id })
    }
  }

  const showAddModal = () => {
    formAddRole.resetFields()
    setError('')
    setIsAddMode(true)
    setIsModalOpen(true)
  }

  const showEditModal = (record: Role) => {
    setCurrentRole(record)
    setIsAddMode(false)
    setIsModalOpen(true)
  }

  const showDeleteModal = (record: Role) => {
    setSelectedRole(record)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = () => {
    if (selectedRole) {
      deleteRoleMutate(selectedRole.id)
      setCurrentRole({} as Role)
      setIsDeleteModalOpen(false)
    }
  }

  useEffect(() => {
    if (roleUpdateData) {
      formAddRole.setFieldsValue(roleUpdateData)
    }
  }, [formAddRole, roleUpdateData])

  return (
    <>
      <Typography.Title level={5}>
        <Space align='center'>
          {t('role:list.roleList')}
          <Tooltip title={t('role:list.addNewRole')}>
            <Button
              type='link'
              icon={<PlusCircleOutlined className='icon-primary' />}
              className={clsx(!hasAuthority(currentUser, 'role:create') && 'hidden')}
              onClick={showAddModal}
            />
          </Tooltip>
        </Space>
      </Typography.Title>

      <List
        bordered
        size='small'
        className='rounded-none'
        loading={isLoading}
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={
              item.name !== 'Super Admin' && item.name !== 'User'
                ? [
                    hasAuthority(currentUser, 'role:update') && (
                      <Button type='link' icon={<EditOutlined />} onClick={() => showEditModal(item)} />
                    ),
                    hasAuthority(currentUser, 'role:delete') && (
                      <Button type='link' danger icon={<DeleteOutlined />} onClick={() => showDeleteModal(item)} />
                    )
                  ]
                : [
                    <Tooltip title={t('role:list.defaultRole')}>
                      <Button type='text' icon={<InfoCircleOutlined />} />
                    </Tooltip>
                  ]
            }
            onClick={() => {
              if (currentRole.id === item.id) return

              form.resetFields()
              setCurrentRole(item)
            }}
            className={clsx('relative cursor-pointer p-1', {
              'bg-gradient-to-l from-blue-50 to-blue-200': !isDarkMode && item.id === currentRole.id,
              'bg-gradient-to-l from-blue-950 to-blue-700': isDarkMode && item.id === currentRole.id,
              'bg-gray-100 hover:bg-gray-200': !isDarkMode && item.id !== currentRole.id,
              'bg-gray-900 hover:bg-gray-700': isDarkMode && item.id !== currentRole.id
            })}
          >
            <span className={clsx('transition duration-300',item.id === currentRole.id && 'translate-x-4')}>{item.name}</span>
          </List.Item>
        )}
      />

      <Modal
        title={isAddMode ? t('role:list.addNewRole') : t('role:list.editRole')}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        <Form
          form={formAddRole}
          name='roleFormAddUpdate'
          onFinish={onFinishAddRole}
          layout='vertical'
          autoComplete='off'
        >
          <Form.Item<RoleField>
            label={t('role:form.roleName')}
            name='name'
            rules={[
              { required: true, message: t('role:form.nameRequired') },
              { min: 3, message: t('role:form.nameMin') }
            ]}
            validateStatus={error ? 'error' : undefined}
            extra={<span style={{ color: 'red' }}>{error}</span>}
          >
            <Input />
          </Form.Item>
          <Form.Item<RoleField> label={t('role:form.description')} name='description'>
            <Input.TextArea />
          </Form.Item>
          <Form.Item<RoleField> label={t('role:form.authority')} name='authorityPrivileges' hidden>
            <Input />
          </Form.Item>
          <Form.Item>
            <Flex justify='end'>
              <Space>
                <Button onClick={() => setIsModalOpen(false)} danger>
                  {t('common.cancel')}
                </Button>
                <Button loading={addRolePending || updateRolePending} type='primary' htmlType='submit'>
                  {isAddMode ? t('common.add') : t('common.edit')}
                </Button>
              </Space>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={<ConfirmModalTitle title={t('role:deleteModal.title')} />}
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDelete}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
      >
        {selectedRole && (
          <ConfirmModalContent
            items={[
              {
                key: '1',
                label: 'Id',
                children: <span>{selectedRole.id}</span>,
                span: 3
              },
              {
                key: '2',
                label: t('role:form.roleName'),
                children: <span>{selectedRole.name}</span>,
                span: 3
              },
              {
                key: '3',
                label: t('common:common.table.createdAt'),
                children: <span>{formatDate(selectedRole.createdAt)}</span>,
                span: 3
              }
            ]}
          />
        )}
      </Modal>
    </>
  )
}

export default RoleTable
