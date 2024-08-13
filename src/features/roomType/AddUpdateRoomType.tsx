import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, type FormProps, Input, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { getRoomTypeById, RoomTypeField } from '@/api/roomType.api.ts'
import { CityField } from '@/api/city.api.ts'
import { useCreateRoomType, useUpdateRoomType } from '@/hooks/useRoomTypes.ts'

function AddUpdateRoomType() {
  const match = useMatch('/roomType/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới loại phòng' : 'Cập nhật loại phòng'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { addRoomTypeMutate, addRoomTypePening } = useCreateRoomType(setError)
  const { updateRoomTypeMutate, updateRoomTypePending } = useUpdateRoomType(setError)


  const onFinish: FormProps<RoomTypeField>['onFinish'] = (values) => {
    if (isAddMode) {
      addRoomTypeMutate(values)
    } else {
      updateRoomTypeMutate(values)
    }
  }

  const onFinishFailed: FormProps<RoomTypeField>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const { data: roomTypeUpdateData, isLoading } = useQuery({
    queryKey: ['roomType', id],
    queryFn: () => getRoomTypeById(Number(id)),
    enabled: !isAddMode
  })

  useEffect(() => {
    if (roomTypeUpdateData) {
      form.setFieldValue('id', roomTypeUpdateData.id)
      form.setFieldValue('name', roomTypeUpdateData.name)
    }
  }, [form, roomTypeUpdateData])

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button type="primary" onClick={() => navigate('/roomType')}>Quay lại</Button>
      </Flex>
      <Form
        form={form}
        name="roomTypeForm"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 32 }}
        initialValues={{ remember: true }}
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
          label="Tên loại phòng"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên loại phòng!' },
            { min: 3, message: 'Tên loại phòng phải có ít nhất 3 ký tự!' }
          ]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button loading={addRoomTypePening || updateRoomTypePending} type="primary" htmlType="submit"
                  style={{ width: 100 }}>
            {isAddMode ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddUpdateRoomType
