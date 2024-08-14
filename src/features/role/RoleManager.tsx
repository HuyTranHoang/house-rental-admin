import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  type FormProps,
  Input,
  Row,
  Space,
  Table,
  TableProps,
  Tooltip,
  Typography
} from 'antd'
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { blue, red } from '@ant-design/colors'
import { ReactNode, useEffect, useState } from 'react'
import { Role } from '@/models/role.type.ts'
import { useAuthorities } from '@/hooks/useAuthorities.ts'
import { Authority } from '@/models/authority.type.ts'
import { getRoleById, RoleField } from '@/api/role.api.ts'
import { useQuery } from '@tanstack/react-query'
import ListRole from '@/features/role/ListRole.tsx'
import { useUpdateRole } from '@/hooks/useRoles.ts'


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

interface AuthorityPrivileges {
  [key: string]: {
    [action: string]: boolean;
  };
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


function RoleManager() {

  const [form] = Form.useForm()


  const { authorities } = useAuthorities()

  const [currentRole, setCurrentRole] = useState({} as Role)
  const [, setError] = useState<string>('')
  const { updateRoleMutate, updateRolePending } =
    useUpdateRole(setError, undefined, undefined, setCurrentRole)

  const { data: roleUpdateData, isLoading: roleUpdateLoading } = useQuery({
    queryKey: ['role', currentRole.id],
    queryFn: () => getRoleById(Number(currentRole.id)),
    enabled: currentRole.id !== undefined
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
      render: (_, rowIndex: GroupedAuthorities[keyof GroupedAuthorities]) => {
        return (
          <Space>
            <Tooltip title="Chọn tất cả">
              <PlusSquareOutlined onClick={() => selectAll(rowIndex)} />
            </Tooltip>
            <Tooltip title="Bỏ chọn tất cả">
              <MinusSquareOutlined onClick={() => unselectAll(rowIndex)} style={{ color: red.primary }} />
            </Tooltip>
          </Space>
        )
      }
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

  const selectAll = (rowIndex: GroupedAuthorities[keyof GroupedAuthorities]) => {
    const originalKey = Object.keys(translationMap).find(key => translationMap[key] === rowIndex.key) || rowIndex.key
    const values = form.getFieldsValue()
    const authorityPrivilegesObject = values.authorityPrivilegesObject || {}
    const actions = ['read', 'create', 'delete', 'update']

    const newAuthorityPrivilegesObject = {
      ...authorityPrivilegesObject,
      [originalKey]: actions.reduce((acc, action) => {
        acc[action] = true
        return acc
      }, {} as Record<string, boolean>)
    }

    form.setFieldsValue({ authorityPrivilegesObject: newAuthorityPrivilegesObject })
  }

  const unselectAll = (rowIndex: GroupedAuthorities[keyof GroupedAuthorities]) => {
    const originalKey = Object.keys(translationMap).find(key => translationMap[key] === rowIndex.key) || rowIndex.key
    const values = form.getFieldsValue()
    const authorityPrivilegesObject = values.authorityPrivilegesObject || {}
    const actions = ['read', 'create', 'delete', 'update']

    const newAuthorityPrivilegesObject = {
      ...authorityPrivilegesObject,
      [originalKey]: actions.reduce((acc, action) => {
        acc[action] = false
        return acc
      }, {} as Record<string, boolean>)
    }

    form.setFieldsValue({ authorityPrivilegesObject: newAuthorityPrivilegesObject })
  }


  const onFinish: FormProps<RoleField>['onFinish'] = (values) => {
    // Ensure authorityPrivilegesObject is defined and has the correct structure
    const authorityPrivilegesObject = values.authorityPrivilegesObject || {}

    // Chuyển đổi nested object thành mảng các quyền hạn
    const authorityPrivileges = Object.entries(authorityPrivilegesObject).flatMap(([groupKey, actions]) =>
      Object.entries(actions as unknown as { [key: string]: boolean })
        .filter(([, isChecked]) => isChecked) // Chỉ giữ những action được chọn (checked)
        .map(([action]) => `${groupKey}:${action}`) // Kết hợp groupKey và action thành "groupKey:action"
    )

    // Gán giá trị authorityPrivileges vào values để gửi đi
    const finalValues = {
      ...values,
      authorityPrivileges
    }

    updateRoleMutate(finalValues)
  }

  const groupedPrivileges = groupBy(authorities)
  const dataSource = Object.values(groupedPrivileges)

  useEffect(() => {
    if (roleUpdateData) {
      form.setFieldValue('id', roleUpdateData.id)
      form.setFieldValue('name', roleUpdateData.name)

      const existingPrivileges = roleUpdateData.authorityPrivileges.reduce((result, currentValue) => {
        const [groupKey, action] = currentValue.split(':')
        if (!result[groupKey]) {
          result[groupKey] = {}
        }
        result[groupKey][action] = true
        return result
      }, {} as AuthorityPrivileges)

      form.setFieldsValue({ authorityPrivilegesObject: existingPrivileges })
    }
  }, [form, roleUpdateData])

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>Quản lý vai trò</Typography.Title>
        </Flex>
      </Flex>

      <Row gutter={24}>
        <Col span={4}>
          <ListRole form={form} setCurrentRole={setCurrentRole} currentRole={currentRole} />
        </Col>

        <Col span={12}>
          <Typography.Title level={5}>
            Quyền hạn vai trò <span style={{ color: blue[5] }}>{currentRole.name}</span>
          </Typography.Title>
          <Form
            form={form}
            name="roleForm"
            onFinish={onFinish}
            layout="horizontal"
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
              hidden
            >
              <Input />
            </Form.Item>

            <Form.Item<RoleField>>
              {
                !currentRole.id &&
                <Typography.Paragraph>Chọn một vai trò để xem quyền hạn</Typography.Paragraph>
              }
              {
                currentRole.id && currentRole.name === 'ROLE_ADMIN' &&
                <Typography.Paragraph>Vai trò admin có tất cả quyền hạn và không thể thay đổi</Typography.Paragraph>
              }
              {
                currentRole.id && currentRole.name !== 'ROLE_ADMIN' &&
                <Table dataSource={dataSource} columns={columns} pagination={false} loading={roleUpdateLoading} />
              }
            </Form.Item>

            <Form.Item>
              {
                currentRole.id && currentRole.name !== 'ROLE_ADMIN' &&
                <Button loading={updateRolePending} type="primary" htmlType="submit">
                  Cập nhật quyền hạn cho vai trò
                </Button>
              }
            </Form.Item>
          </Form>
        </Col>

        <Col span={8}>
          <Typography.Title level={5}>Thông tin chi tiết</Typography.Title>
          <Typography.Paragraph>
            {currentRole.id ? `Id: ${currentRole.id}` : 'Chọn một vai trò để xem thông tin chi tiết'}
          </Typography.Paragraph>
          <Typography.Paragraph>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </Typography.Paragraph>
        </Col>
      </Row>

    </>
  )
}

export default RoleManager
