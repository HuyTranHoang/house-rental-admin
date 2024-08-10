import { useMatch, useNavigate } from 'react-router-dom'
import { Button, Flex, Form, type FormProps, Input, Transfer, TransferProps, Typography } from 'antd'
import { useState } from 'react'
import { useCreateRole } from '../../hooks/useRoles.ts'
import { RoleField } from '../api/role.api.ts'
import { Authority } from '../../models/authority.type.ts'
import { useAuthorities } from '../../hooks/useAuthorities.ts'
import { authorityPrivilegesMap } from './authorityPrivilegesMap.ts'

type RecordType = Authority & {
  key: string;
  chosen: boolean;
}

function AddUpdateRole() {
  const match = useMatch('/role/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới vai trò' : 'Cập nhật vai trò'
  const navigate = useNavigate()

  const [error, setError] = useState<string>('')

  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([])

  const { addRoleMutate, addRolePending } = useCreateRole(setError)
  const { authorities } = useAuthorities()


  const dataSource: RecordType[] = authorities
    ? authorities.map((authority) => ({
      key: authority.privilege,
      chosen: false,
      ...authority
    }))
    : []

  const onFinish: FormProps<RoleField>['onFinish'] = (values) => {
    if (isAddMode) {
      addRoleMutate(values)
    } else {
      // updateCityMutate(values)
    }
  }

  const filterOption = (inputValue: string, option: RecordType) => {
    const lowercasedInput = inputValue.toLowerCase();
    const translatedPrivilege = authorityPrivilegesMap[option.privilege]?.[0].toLowerCase() || '';
    return (
      option.privilege.toLowerCase().indexOf(lowercasedInput) > -1 ||
      translatedPrivilege.indexOf(lowercasedInput) > -1
    );
  };

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys)
  }

  return (
    <>
      {targetKeys}
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button type="primary" onClick={() => navigate('/role')}>Quay lại</Button>
      </Flex>
      <Form
        name="roleForm"
        labelCol={{ span: 5 }}
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
            { required: true, message: 'Vui lòng chọn quyền!' }
          ]}
        >
          <Transfer
            dataSource={dataSource}
            targetKeys={targetKeys}
            showSearch
            filterOption={filterOption}
            onChange={handleChange}
            listStyle={{
              width: 250,
              height: 300,
            }}
            render={(item) => authorityPrivilegesMap[item.privilege]?.[0] || item.privilege}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button loading={addRolePending} type="primary" htmlType="submit" style={{ width: 100 }}>
            {isAddMode ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </Form.Item>

      </Form>
    </>
  )
}

export default AddUpdateRole
