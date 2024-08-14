import {
  Button,
  Flex,
  Form,
  FormInstance,
  type FormProps,
  Input,
  List,
  Modal,
  Space,
  Spin,
  Tooltip,
  Typography
} from 'antd'
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { blue } from '@ant-design/colors'
import { useCreateRole, useRolesAll, useUpdateRole } from '@/hooks/useRoles.ts'
import { Role } from '@/models/role.type.ts'
import React, { useEffect, useState } from 'react'
import { getRoleById, RoleField } from '@/api/role.api.ts'
import { useQuery } from '@tanstack/react-query'

interface ListRoleProps {
  form: FormInstance
  setCurrentRole: React.Dispatch<React.SetStateAction<Role>>
  currentRole: Role
}

function ListRole({ form, setCurrentRole, currentRole }: ListRoleProps) {
  const [isAddMode, setIsAddMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string>('')
  const [formAddRole] = Form.useForm()

  const { addRoleMutate, addRolePending }
    = useCreateRole(setError, setIsModalOpen, formAddRole)
  const { updateRoleMutate, updateRolePending }
    = useUpdateRole(setError, setIsModalOpen, formAddRole, setCurrentRole)

  const { data, isLoading } = useRolesAll()

  const { data: roleUpdateData } = useQuery({
    queryKey: ['role', currentRole.id],
    queryFn: () => getRoleById(Number(currentRole.id)),
    enabled: currentRole.id !== undefined
  })

  const onFinishAddRole: FormProps<RoleField>['onFinish'] = (values) => {
    if (isAddMode) {
      values.authorityPrivileges = [
        'user:read',
        'user:update'
      ]
      addRoleMutate(values)
    } else {
      updateRoleMutate({ ...values, id: currentRole.id })
    }
  }

  useEffect(() => {
    if (roleUpdateData) {
      formAddRole.setFieldsValue(roleUpdateData)
    }
  }, [formAddRole, roleUpdateData])

  if (isLoading) {
    return <Spin fullscreen />
  }

  return (
    <>
      <Typography.Title level={5}>
        <Space align="center">
          Danh sách vai trò
          <Tooltip title="Thêm mới vai trò">
            <PlusCircleOutlined className="icon-primary" onClick={() => {
              formAddRole.resetFields()
              setIsAddMode(true)
              setIsModalOpen(true)
            }} />
          </Tooltip>
        </Space>
      </Typography.Title>
      <List
        bordered
        size="small"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={(item.name !== 'ROLE_ADMIN' && item.name !== 'ROLE_USER') ? [
              <EditOutlined onClick={() => {
                setCurrentRole(item)
                setIsAddMode(false)
                setIsModalOpen(true)
              }} />,
              <DeleteOutlined onClick={() => console.log(item)} className="icon-danger" />
            ] : [
              <Tooltip title="Vai trò mặc định không thể sửa">
                <InfoCircleOutlined />
              </Tooltip>
            ]}
            onClick={() => {
              if (currentRole.id === item.id) return

              form.resetFields()
              setCurrentRole(item)
            }}
            style={{
              backgroundColor: item.id === currentRole.id ? blue[0] : '#fcfcfc',
              cursor: 'pointer'
            }}>
            {item.name}
          </List.Item>
        )}
      />

      <Modal title={isAddMode ? 'Thêm mới vai trò' : 'Cập nhật vai trò'}
             open={isModalOpen}
             onCancel={() => setIsModalOpen(false)}
             footer={false}
      >
        <Form
          form={formAddRole}
          name="roleFormAddUpdate"
          onFinish={onFinishAddRole}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item<RoleField>
            label="Tên vai trò"
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên vai trò' },
              { min: 3, message: 'Tên vai trò phải có ít nhất 3 ký tự!' }
            ]}
            validateStatus={error ? 'error' : undefined}
            extra={<span style={{ color: 'red' }}>{error}</span>}
          >
            <Input />
          </Form.Item>
          <Form.Item<RoleField>
            label="Mô tả"
            name="description"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item<RoleField>
            label="Quyền hạn"
            name="authorityPrivileges"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Flex justify="end">
              <Space>
                <Button loading={addRolePending || updateRolePending} type="primary" htmlType="submit">
                  {isAddMode ? 'Thêm mới' : 'Cập nhật'}
                </Button>
                <Button onClick={() => setIsModalOpen(false)} danger>
                  Hủy
                </Button>
              </Space>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ListRole
