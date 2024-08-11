import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { Button, Flex, Form, type FormProps, Input, Spin, Transfer, TransferProps, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useCreateRole, useUpdateRole } from '../../hooks/useRoles.ts'
import { getRoleById, RoleField } from '../api/role.api.ts'
import { useAuthorities } from '../../hooks/useAuthorities.ts'
import { authorityPrivilegesMap } from './authorityPrivilegesMap.ts'
import { useQuery } from '@tanstack/react-query'
import { Authority } from '../../models/authority.type.ts'

function AddUpdateRole() {
  const match = useMatch('/role/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới vai trò' : 'Cập nhật vai trò'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([])

  const { addRoleMutate, addRolePending } = useCreateRole(setError)
  const { updateRoleMutate, updateRolePending } = useUpdateRole(setError)

  const { authorities } = useAuthorities()

  const onFinish: FormProps<RoleField>['onFinish'] = (values) => {
    if (isAddMode) {
      addRoleMutate(values)
    } else {
      updateRoleMutate(values)
    }
  }

  const { data: roleUpdateData, isLoading } = useQuery({
    queryKey: ['role', id],
    queryFn: () => getRoleById(Number(id)),
    enabled: !isAddMode
  })

  const filterOption = (inputValue: string, option: Authority) => {
    const lowercasedInput = inputValue.toLowerCase()
    const translatedPrivilege = authorityPrivilegesMap[option.privilege]?.[0].toLowerCase() || ''
    return (
      option.privilege.toLowerCase().indexOf(lowercasedInput) > -1 ||
      translatedPrivilege.indexOf(lowercasedInput) > -1
    )
  }

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys)
  }

  useEffect(() => {
    if (roleUpdateData) {
      form.setFieldValue('id', roleUpdateData.id)
      form.setFieldValue('name', roleUpdateData.name)
      setTargetKeys(roleUpdateData.authorityPrivileges)
    }
  }, [form, roleUpdateData])

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button type="primary" onClick={() => navigate('/role')}>Quay lại</Button>
      </Flex>
      <Form
        form={form}
        name="roleForm"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800, marginTop: 32 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<RoleField>
          label="Id"
          name="id"
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item<RoleField>
          label="Tên vai trò"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên vai trò!' },
            { min: 3, message: 'Tên vai trò phải có ít nhất 3 ký tự!' }
          ]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item<RoleField>
          label="Quyền hạn"
          name="authorityPrivileges"
          rules={[
            { required: true, message: 'Vui lòng chọn quyền cho vai trò này!' }
          ]}
        >
          <Transfer
            showSearch
            rowKey={(item) => item.privilege}
            dataSource={authorities}
            targetKeys={targetKeys}
            filterOption={filterOption}
            onChange={handleChange}
            render={(item) => authorityPrivilegesMap[item.privilege]?.[0] || item.privilege}
            listStyle={{
              width: 250,
              height: 300
            }}
            locale={{
              searchPlaceholder: 'Tìm kiếm quyền',
              itemUnit: 'quyền',
              itemsUnit: 'quyền',
              notFoundContent: 'Không tìm thấy quyền'
            }}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button loading={addRolePending || updateRolePending} type="primary" htmlType="submit" style={{ width: 100 }}>
            {isAddMode ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </Form.Item>

      </Form>
    </>
  )
}

export default AddUpdateRole
