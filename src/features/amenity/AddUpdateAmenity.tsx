import { useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, FormProps, Input, Spin, Typography } from 'antd'
import { useState } from 'react'
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom'
import { AmenityField, getAmenityById } from '../api/amenity.api.ts'

import { useSetBreadcrumb } from '../../hooks/useSetBreadcrumb'
import { useCreateAmenity, useUpdateAmenity } from './useAmenities.ts'

function AddUpdateAmenity() {
  const match = useMatch('/amenity/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới tiện nghi' : 'Cập nhật tiện nghi'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { addAmenityMutate, addAmenityPending } = useCreateAmenity(setError)
  const { updateAmenityMutate, updateAmenityPending } = useUpdateAmenity(setError)


  const onFinish: FormProps<AmenityField>['onFinish'] = (values) => {
    if (isAddMode) {
      addAmenityMutate(values)
    } else {
      updateAmenityMutate(values)
    }
  }

  const { data: amenityUpdateData, isLoading } = useQuery({
    queryKey: ['amenity', id],
    queryFn: () => getAmenityById(Number(id)),
    enabled: !isAddMode
  })

  if (amenityUpdateData) {
    form.setFieldValue('id', amenityUpdateData.id)
    form.setFieldValue('name', amenityUpdateData.name)
  }

  useSetBreadcrumb([
    { title: <Link to={'/'}>Dashboard</Link> },
    { title: <Link to={'/amenity'}>Danh sách tiện nghi</Link> },
    { title: title }
  ])

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button type="primary" onClick={() => navigate('/amenity')}>Quay lại</Button>
      </Flex>
      <Form
        form={form}
        name="amenityForm"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 32 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<AmenityField>
          label="Id"
          name="id"
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item<AmenityField>
          label="Tên tiện nghi"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên tiện nghi!' },
            { min: 2, message: 'Tên tiện nghi phải có ít nhất 2 ký tự!' }
          ]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button loading={addAmenityPending || updateAmenityPending} type="primary" htmlType="submit"
                  style={{ width: 100 }}>
            {isAddMode ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddUpdateAmenity