import { Link, useMatch, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Flex, Form, type FormProps, Input, Spin, Typography } from 'antd'
import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { addRoomType, getRoomTypeById, RoomTypeField, updateRoomType } from '../api/roomType.api.ts'
import { useSetBreadcrumb } from '../../hooks/useSetBreadcrumb.ts'
import { CityField } from '../api/city.api.ts'

function AddUpdateRoomType() {
  const match = useMatch('/roomType/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới loại phòng' : 'Cập nhật loại phòng'
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { mutate: addRoomTypeMutate } = useMutation({
    mutationFn: addRoomType,
    onSuccess: () => {
      toast.success('Thêm loại phòng thành công')
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })

      navigate('/roomType')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  const { mutate: updateRoomTypeMutate } = useMutation({
    mutationFn: updateRoomType,
    onSuccess: () => {
      toast.success('Cập nhật loại phòng thành công')
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] })
      navigate('/roomType')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

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

  if (roomTypeUpdateData) {
    form.setFieldValue('id', roomTypeUpdateData.id)
    form.setFieldValue('name', roomTypeUpdateData.name)
  }

  useSetBreadcrumb([
    { title: <Link to={'/'}>Dashboard</Link> },
    { title: <Link to={'/roomType'}>Danh sách loại phòng</Link> },
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
            { min: 3, message: 'Tên thành phố phải có ít nhất 3 ký tự!' },
          ]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ width: 100 }}>
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddUpdateRoomType