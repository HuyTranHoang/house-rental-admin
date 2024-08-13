import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { Button, Checkbox, Flex, Form, type FormProps, Input, Spin, Table, TableProps, Typography } from 'antd'
import { ReactNode, useEffect, useState } from 'react'
import { useCreateRole, useUpdateRole } from '@/hooks/useRoles.ts'
import { getRoleById, RoleField } from '@/api/role.api.ts'
import { useAuthorities } from '@/hooks/useAuthorities.ts'
import { useQuery } from '@tanstack/react-query'
import { Authority } from '@/models/authority.type.ts'

interface GroupedAuthorities {
  [key: string]: {
    key: string;
    privilege: string;
    read?: ReactNode;
    create?: ReactNode;
    delete?: ReactNode;
    update?: ReactNode;
  };
}

interface AuthoritiesTable {
  key: string;
  privilege: string;
  read?: ReactNode;
  create?: ReactNode;
  delete?: ReactNode;
  update?: ReactNode;
}

const translationMap: { [key: string]: string } = {
  'user': 'Người dùng',
  'property': 'Bất động sản',
  'review': 'Đánh giá',
  'city': 'Thành phố',
  'district': 'Quận huyện',
  'room_type': 'Loại phòng',
  'amenity': 'Tiện nghi',
  'role': 'Vai trò'
}

function AddUpdateRole() {
  const match = useMatch('/role/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới vai trò' : 'Cập nhật vai trò'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { addRoleMutate, addRolePending } = useCreateRole(setError)
  const { updateRoleMutate, updateRolePending } = useUpdateRole(setError)

  const { authorities } = useAuthorities()

  const onFinish: FormProps<RoleField>['onFinish'] = (values) => {
    // Chuyển đổi nested object thành mảng các quyền hạn
    const authorityPrivileges = Object.entries(values.authorityPrivilegesObject).flatMap(([groupKey, actions]) =>
      Object.entries(actions)
        .filter(([, isChecked]) => isChecked) // Chỉ giữ những action được chọn (checked)
        .map(([action]) => `${groupKey}:${action}`) // Kết hợp groupKey và action thành "groupKey:action"
    )

    // Gán giá trị authorityPrivileges vào values để gửi đi
    const finalValues = {
      ...values,
      authorityPrivileges
    }

    if (isAddMode) {
      addRoleMutate(finalValues)
    } else {
      updateRoleMutate(finalValues)
    }
  }


  const { data: roleUpdateData, isLoading } = useQuery({
    queryKey: ['role', id],
    queryFn: () => getRoleById(Number(id)),
    enabled: !isAddMode
  })

  const columns: TableProps<AuthoritiesTable>['columns'] = [
    {
      dataIndex: 'privilege',
      key: 'privilege',
      rowScope: 'row'
    },
    {
      title: 'Xem',
      dataIndex: 'read',
      key: 'read'
    },
    {
      title: 'Thêm',
      dataIndex: 'create',
      key: 'create'
    },
    {
      title: 'Xóa',
      dataIndex: 'delete',
      key: 'delete'
    },
    {
      title: 'Sửa',
      dataIndex: 'update',
      key: 'update'
    },
    {
      title: 'Khác',
      dataIndex: 'other',
      key: 'other',
      render: (_: undefined, rowIndex: GroupedAuthorities[keyof GroupedAuthorities]) => (
        <Button onClick={() => handleSelectAll(rowIndex)}>Chọn tất cả</Button>
      )
    }
  ]

  const groupBy = (array: Authority[] | undefined): GroupedAuthorities => {
    if (!array) return {}

    return array.reduce((result: GroupedAuthorities, currentValue: Authority) => {
      const [groupKey, action] = currentValue.privilege.split(':')
      if (groupKey === 'admin') return result // Skip 'admin'

      const translatedGroupKey = translationMap[groupKey] || groupKey
      if (!result[translatedGroupKey]) {
        result[translatedGroupKey] = {
          key: translatedGroupKey,
          privilege: translatedGroupKey.charAt(0).toUpperCase() + translatedGroupKey.slice(1)
        }
      }
      result[translatedGroupKey] = {
        ...result[translatedGroupKey],
        [action]: (
          <Form.Item
            name={['authorityPrivilegesObject', groupKey, action]}
            valuePropName="checked"
            noStyle
          >
            <Checkbox />
          </Form.Item>
        )
      }
      return result
    }, {} as GroupedAuthorities)
  }

  const handleSelectAll = (rowIndex: GroupedAuthorities[keyof GroupedAuthorities]) => {
    const originalKey = Object.keys(translationMap)
      .find(key => translationMap[key] === rowIndex.key) || rowIndex.key

    const values = form.getFieldsValue()
    const authorityPrivilegesObject = values.authorityPrivilegesObject || {}
    const actions = ['read', 'create', 'delete', 'update']

    const newAuthorityPrivilegesObject = { ...authorityPrivilegesObject, [originalKey]: {} }

    actions.forEach(action => {
      newAuthorityPrivilegesObject[originalKey][action] = true
    })

    form.setFieldsValue({ authorityPrivilegesObject: newAuthorityPrivilegesObject })
  }


  const groupedPrivileges = groupBy(authorities)
  const dataSource = Object.values(groupedPrivileges)

  useEffect(() => {
    if (roleUpdateData) {
      form.setFieldValue('id', roleUpdateData.id)
      form.setFieldValue('name', roleUpdateData.name)

      const existingPrivileges = roleUpdateData.authorityPrivileges.reduce((result, currentValue) => {
        const [groupKey, action] = currentValue.split(':')
        if (!result.authorityPrivilegesObject) {
          result.authorityPrivilegesObject = {}
        }
        if (!result.authorityPrivilegesObject[groupKey]) {
          result.authorityPrivilegesObject[groupKey] = {}
        }
        result.authorityPrivilegesObject[groupKey][action] = true
        return result
      }, {} as { [key: string]: any })

      form.setFieldsValue(existingPrivileges)
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
        layout="horizontal"
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
        >
          <Table dataSource={dataSource} columns={columns} pagination={false} />
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
