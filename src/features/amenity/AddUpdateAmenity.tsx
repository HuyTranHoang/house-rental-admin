import { useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, FormProps, Input, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { getAmenityById } from '@/api/amenity.api.ts'
import { useCreateAmenity, useUpdateAmenity } from '@/hooks/useAmenities.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import ROUTER_NAMES from '@/constant/routerNames.ts'

import z from 'zod'
import { createSchemaFieldRule } from 'antd-zod'

const AmenityFormValidationSchema = z.object({
  id: z.number().optional(),
  name: z.string({ message: 'Vui lòng nhập tên thành phố' }).min(3, 'Tên thành phố phải có ít nhất 3 ký tự')
})

export type AmenityForm = z.infer<typeof AmenityFormValidationSchema>
const rule = createSchemaFieldRule(AmenityFormValidationSchema)

function AddUpdateAmenity() {
  const match = useMatch(ROUTER_NAMES.ADD_AMENITY)
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới tiện nghi' : 'Cập nhật tiện nghi'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { addAmenityMutate, addAmenityPending } = useCreateAmenity(setError)
  const { updateAmenityMutate, updateAmenityPending } = useUpdateAmenity(setError)


  const onFinish: FormProps<AmenityForm>['onFinish'] = (values) => {
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

  useEffect(() => {
    if (amenityUpdateData) {
      form.setFieldValue('id', amenityUpdateData.id)
      form.setFieldValue('name', amenityUpdateData.name)
    }
  }, [amenityUpdateData, form])

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button icon={<LeftCircleOutlined />} shape="round" type="primary"
                onClick={() => navigate(ROUTER_NAMES.AMENITY)}>Quay
          lại</Button>
      </Flex>
      <Form
        form={form}
        name="amenityForm"
        labelCol={{ span: 5 }}
        style={{
          maxWidth: 600,
          marginTop: 32,
          boxShadow: '0 0 1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f0f0f0',
          padding: '32px 32px 0'
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<AmenityForm> label="Id" name="id" rules={[rule]} hidden
        >
          <Input />
        </Form.Item>

        <Form.Item<AmenityForm>
          label="Tên tiện nghi"
          name="name"
          rules={[rule]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5 }}>
          <Button onClick={() => {
            form.resetFields()
            setError('')
          }} style={{ marginRight: 16 }}>
            Đặt lại
          </Button>

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