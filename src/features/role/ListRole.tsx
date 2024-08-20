import {
  Button,
  DescriptionsProps,
  Flex,
  Form,
  FormInstance,
  type FormProps,
  Input,
  List,
  Modal,
  Space,
  Tooltip,
  Typography
} from 'antd'
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { blue } from '@ant-design/colors'
import { useCreateRole, useDeleteRole, useRolesAll, useUpdateRole } from '@/hooks/useRoles.ts'
import { Role } from '@/models/role.type.ts'
import React, { useEffect, useState } from 'react'
import { getRoleById, RoleField } from '@/api/role.api.ts'
import { useQuery } from '@tanstack/react-query'
import ConfirmModalTitle from '@/components/ConfirmModalTitle.tsx'
import ConfirmModalContent from '@/components/ConfirmModalContent.tsx'
import { customFormatDate } from '@/utils/customFormatDate.ts'

const { confirm } = Modal

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
  const { deleteRoleMutate } = useDeleteRole()

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

  const showDeleteConfirm = (record: Role) => {
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: 'Id',
        children: <span>{record.id}</span>,
        span: 3
      },
      {
        key: '2',
        label: 'Tên vai trò',
        children: <span>{record.name}</span>,
        span: 3
      },
      {
        key: '3',
        label: 'Ngày tạo',
        children: <span>{customFormatDate(record.createdAt)}</span>,
        span: 3
      }
    ]

    confirm({
      icon: null,
      title: <ConfirmModalTitle title="Xác nhận xóa vai trò" />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deleteRoleMutate(record.id)
        setCurrentRole({} as Role)
      }
    })
  }

  useEffect(() => {
    if (roleUpdateData) {
      formAddRole.setFieldsValue(roleUpdateData)
    }
  }, [formAddRole, roleUpdateData])


  return (
    <>
      <Typography.Title level={5}>
        <Space align="center">
          Danh sách vai trò
          <Tooltip title="Thêm mới vai trò">
            <PlusCircleOutlined className="icon-primary" onClick={() => {
              formAddRole.resetFields()
              setError('')
              setIsAddMode(true)
              setIsModalOpen(true)
            }} />
          </Tooltip>
        </Space>
      </Typography.Title>

      <List
        bordered
        size="small"
        loading={isLoading}
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={(item.name !== 'ROLE_ADMIN' && item.name !== 'ROLE_USER') ? [
              <EditOutlined onClick={() => {
                setCurrentRole(item)
                setIsAddMode(false)
                setIsModalOpen(true)
              }} />,
              <DeleteOutlined onClick={() => showDeleteConfirm(item)} className="icon-danger" />
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
                <Button onClick={() => setIsModalOpen(false)} danger>
                  Hủy
                </Button>
                <Button loading={addRolePending || updateRolePending} type="primary" htmlType="submit">
                  {isAddMode ? 'Thêm mới' : 'Cập nhật'}
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
