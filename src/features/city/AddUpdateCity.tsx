import type { FormProps } from 'antd'
import { Button, Flex, Form, Input, Spin, Typography } from 'antd'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CityField, getCityById } from '../api/city.api.ts'

import { useState } from 'react'
import { useCreateCity, useUpdateCity } from '../../hooks/useCities.ts'


function AddUpdateCity() {
  const match = useMatch('/city/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới thành phố' : 'Cập nhật thành phố'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { addCityMutate, addCityPending } = useCreateCity(setError)
  const { updateCityMutate, updateCityPending } = useUpdateCity(setError)

  const onFinish: FormProps<CityField>['onFinish'] = (values) => {
    if (isAddMode) {
      addCityMutate(values)
    } else {
      updateCityMutate(values)
    }
  }

  const onFinishFailed: FormProps<CityField>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const { data: cityUpdateData, isLoading } = useQuery({
    queryKey: ['city', id],
    queryFn: () => getCityById(Number(id)),
    enabled: !isAddMode
  })

  if (cityUpdateData) {
    form.setFieldValue('id', cityUpdateData.id)
    form.setFieldValue('name', cityUpdateData.name)
  }

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button type="primary" onClick={() => navigate('/city')}>Quay lại</Button>
      </Flex>
      <Form
        form={form}
        name="cityForm"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 32 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<CityField>
          label="Id"
          name="id"
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item<CityField>
          label="Tên thành phố"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên thành phố!' },
            { min: 3, message: 'Tên thành phố phải có ít nhất 3 ký tự!' }
          ]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button loading={addCityPending || updateCityPending} type="primary" htmlType="submit" style={{ width: 100 }}>
            {isAddMode ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddUpdateCity
