import { getRoleById, RoleField } from '@/api/role.api.ts'
import RoleTable from '@/features/role/RoleTable.tsx'
import { useAuthorities } from '@/hooks/useAuthorities.ts'
import { useUpdateRole } from '@/hooks/useRoles.ts'
import useBoundStore from '@/store.ts'
import { Authority } from '@/types/authority.type.ts'
import { Role } from '@/types/role.type.ts'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { blue, red } from '@ant-design/colors'
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
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
import { formatDate } from 'date-fns/format'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface GroupedAuthorities {
  [key: string]: {
    key: string
    privilege: string
    read?: ReactNode
    create?: ReactNode
    delete?: ReactNode
    update?: ReactNode
  }
}

interface AuthoritiesTable {
  key: string
  privilege: string
  read?: ReactNode
  create?: ReactNode
  delete?: ReactNode
  update?: ReactNode
}

interface AuthorityPrivileges {
  [key: string]: {
    [action: string]: boolean
  }
}

function RoleManager() {
  const currentUser = useBoundStore((state) => state.user)

  const [form] = Form.useForm()

  const { authorities } = useAuthorities()

  const [currentRole, setCurrentRole] = useState({} as Role)
  const [, setError] = useState<string>('')
  const { updateRoleMutate, updateRolePending } = useUpdateRole(setError, undefined, undefined, setCurrentRole)
  const { t } = useTranslation(['common', 'role'])
  const { data: roleUpdateData, isLoading: roleUpdateLoading } = useQuery({
    queryKey: ['role', currentRole.id],
    queryFn: () => getRoleById(Number(currentRole.id)),
    enabled: currentRole.id !== undefined
  })

  const translationMap: { [key: string]: string } = {
    user: t('role:table.user'),
    property: t('role:table.property'),
    review: t('role:table.evaluate'),
    city: t('role:table.city'),
    district: t('role:table.district'),
    roomType: t('role:table.roomType'),
    amenity: t('role:table.amenity'),
    role: t('role:table.role'),
    dashboard: t('role:table.dashboard'),
    comment: t('role:table.comment'),
    membership: t('role:table.membership'),
    transaction: t('role:table.transaction'),
    advertisement: t('role:table.advertisement'),
    report: t('role:table.report'),
    commentReport: t('role:table.commentReport')
  }

  const columns: TableProps<AuthoritiesTable>['columns'] = [
    {
      dataIndex: 'privilege',
      key: 'privilege',
      rowScope: 'row'
    },
    {
      title: t('role:table.see'),
      dataIndex: 'read',
      key: 'read'
    },
    {
      title: t('common:common.add'),
      dataIndex: 'create',
      key: 'create'
    },
    {
      title: t('common:common.delete'),
      dataIndex: 'delete',
      key: 'delete'
    },
    {
      title: t('common:common.edit'),
      dataIndex: 'update',
      key: 'update'
    },
    ...(hasAuthority(currentUser, 'role:edit')
      ? [
        {
          title: t('role:table.more'),
          dataIndex: 'other',
          key: 'other',
          render: (_: undefined, rowIndex: GroupedAuthorities[keyof GroupedAuthorities]) => {
            return (
              <Space>
                <Tooltip title={t('role:form.selectAll')}>
                  <PlusSquareOutlined onClick={() => selectAll(rowIndex)} />
                </Tooltip>
                <Tooltip title={t('role:form.unSelectAll')}>
                  <MinusSquareOutlined onClick={() => unselectAll(rowIndex)} style={{ color: red.primary }} />
                </Tooltip>
              </Space>
            )
          }
        }
      ]
      : [])
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
          <Form.Item name={['authorityPrivilegesObject', groupKey, action]} valuePropName='checked' noStyle>
            <Checkbox disabled={!hasAuthority(currentUser, 'role:edit')} />
          </Form.Item>
        )
      }
      return result
    }, {} as GroupedAuthorities)
  }

  const selectAll = (rowIndex: GroupedAuthorities[keyof GroupedAuthorities]) => {
    const originalKey = Object.keys(translationMap).find((key) => translationMap[key] === rowIndex.key) || rowIndex.key
    const values = form.getFieldsValue()
    const authorityPrivilegesObject = values.authorityPrivilegesObject || {}
    const actions = ['read', 'create', 'delete', 'update']

    const newAuthorityPrivilegesObject = {
      ...authorityPrivilegesObject,
      [originalKey]: actions.reduce(
        (acc, action) => {
          acc[action] = true
          return acc
        },
        {} as Record<string, boolean>
      )
    }

    form.setFieldsValue({ authorityPrivilegesObject: newAuthorityPrivilegesObject })
  }

  const unselectAll = (rowIndex: GroupedAuthorities[keyof GroupedAuthorities]) => {
    const originalKey = Object.keys(translationMap).find((key) => translationMap[key] === rowIndex.key) || rowIndex.key
    const values = form.getFieldsValue()
    const authorityPrivilegesObject = values.authorityPrivilegesObject || {}
    const actions = ['read', 'create', 'delete', 'update']

    const newAuthorityPrivilegesObject = {
      ...authorityPrivilegesObject,
      [originalKey]: actions.reduce(
        (acc, action) => {
          acc[action] = false
          return acc
        },
        {} as Record<string, boolean>
      )
    }

    form.setFieldsValue({ authorityPrivilegesObject: newAuthorityPrivilegesObject })
  }

  const onFinish: FormProps<RoleField>['onFinish'] = (values) => {
    // Ensure authorityPrivilegesObject is defined and has the correct structure
    const authorityPrivilegesObject = values.authorityPrivilegesObject || {}

    // Chuyển đổi nested object thành mảng các quyền hạn
    const authorityPrivileges = Object.entries(authorityPrivilegesObject).flatMap(
      ([groupKey, actions]) =>
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

  // Set initial values for form
  useEffect(() => {
    if (roleUpdateData) {
      form.setFieldValue('id', roleUpdateData.id)
      form.setFieldValue('name', roleUpdateData.name)
      form.setFieldValue('description', roleUpdateData.description)

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
      <Flex align='center' justify='space-between' style={{ marginBottom: 12 }}>
        <Flex align='center'>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {t('role:title')}
          </Typography.Title>
        </Flex>
      </Flex>

      <Row gutter={24}>
        <Col span={5}>
          <RoleTable form={form} setCurrentRole={setCurrentRole} currentRole={currentRole} />
        </Col>

        <Col span={12}>
          <Typography.Title level={5}>
            {t('role:list.roleAuthority')} <span style={{ color: blue[5] }}>{currentRole.name}</span>
          </Typography.Title>
          <Form form={form} name='roleForm' onFinish={onFinish} layout='horizontal' autoComplete='off'>
            <Form.Item<RoleField> label='Id' name='id' hidden>
              <Input />
            </Form.Item>

            <Form.Item<RoleField> label={t('role:form.roleName')} name='name' hidden>
              <Input />
            </Form.Item>

            <Form.Item<RoleField> label={t('role:form.description')} name='description' hidden>
              <Input />
            </Form.Item>

            <Form.Item<RoleField>>
              {!currentRole.id && <Typography.Paragraph>{t('role:list.selectRole')}</Typography.Paragraph>}
              {currentRole.id && currentRole.name === 'ROLE_ADMIN' && (
                <Typography.Paragraph>{t('role:list.adminRole')}</Typography.Paragraph>
              )}
              {currentRole.id && currentRole.name !== 'ROLE_ADMIN' && (
                <Table dataSource={dataSource} columns={columns} pagination={false} loading={roleUpdateLoading} />
              )}
            </Form.Item>

            <Form.Item>
              {currentRole.id && currentRole.name !== 'ROLE_ADMIN' && (
                <Button
                  loading={updateRolePending}
                  type='primary'
                  disabled={!hasAuthority(currentUser, 'role:edit')}
                  htmlType='submit'
                >
                  {t('role:list.editAuthority')}
                </Button>
              )}
            </Form.Item>
          </Form>
        </Col>

        <Col span={7}>
          {currentRole.id && (
            <>
              <Typography.Title level={5}>{t('role:list.infoDetail')}</Typography.Title>
              <Typography.Paragraph>
                {currentRole.description
                  ? `${t('role:form.description')} : ${currentRole.description}`
                  : t('role:form.notDescription')}
              </Typography.Paragraph>
              <Typography.Paragraph>
                {currentRole.createdAt
                  ? `${t('common:common.table.createdAt')}: ${formatDate(currentRole.createdAt, 'dd-MM-yyyy hh:mm a')}`
                  : ''}
              </Typography.Paragraph>
            </>
          )}
        </Col>
      </Row>
    </>
  )
}

export default RoleManager
