import { useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, FormProps, Input, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { getAmenityById } from '@/api/amenity.api.ts'
import { useCreateAmenity, useUpdateAmenity } from '@/hooks/useAmenities.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { AmenityForm } from '@/models/amenity.type.ts'

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
          boxShadow: 'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
          border: '1px solid #f0f0f0',
          padding: '32px 32px 0'
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<AmenityForm> label="Id" name="id" hidden
        >
          <Input />
        </Form.Item>

        <Form.Item<AmenityForm>
          label="Tên tiện nghi"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên tiện nghi!' },
            { min: 3, message: 'Tên tiện nghi phải có ít nhất 3 ký tự!' },
            { max: 50, message: 'Tên tiện nghi không được vượt quá 50 ký tự!' }
          ]}
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