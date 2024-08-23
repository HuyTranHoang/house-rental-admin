import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, type FormProps, Input, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { getRoomTypeById } from '@/api/roomType.api.ts'
import { useCreateRoomType, useUpdateRoomType } from '@/hooks/useRoomTypes.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { RoomTypeForm } from '@/models/roomType.type.ts'

function AddUpdateRoomType() {
  const match = useMatch(ROUTER_NAMES.ADD_ROOM_TYPE)
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới loại phòng' : 'Cập nhật loại phòng'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { addRoomTypeMutate, addRoomTypePening } = useCreateRoomType(setError)
  const { updateRoomTypeMutate, updateRoomTypePending } = useUpdateRoomType(setError)


  const onFinish: FormProps<RoomTypeForm>['onFinish'] = (values) => {
    if (isAddMode) {
      addRoomTypeMutate(values)
    } else {
      updateRoomTypeMutate(values)
    }
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
        <Button icon={<LeftCircleOutlined />} shape="round" type="primary"
                onClick={() => navigate(ROUTER_NAMES.ROOM_TYPE)}>Quay
          lại</Button>
      </Flex>
      <Form
        form={form}
        name="roomTypeForm"
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
        <Form.Item<RoomTypeForm> label="Id" name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<RoomTypeForm>
          label="Tên loại phòng"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên loại phòng!' },
            { min: 3, message: 'Tên loại phòng phải có ít nhất 3 ký tự!' },
            { max: 50, message: 'Tên loại phòng không được quá 50 ký tự!' }
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
