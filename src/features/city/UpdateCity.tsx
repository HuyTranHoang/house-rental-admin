import { Button, Flex, Form, type FormProps, Input, Spin, Typography } from 'antd'
import { UpdateCityField, updateCity, getCityById } from '../api/city.api.ts'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSetBreadcrumb } from '../../hooks/useSetBreadcrumb.ts'

const onFinishFailed: FormProps<UpdateCityField>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

function UpdateCity() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const {data, isLoading} = useQuery({
    queryKey: ['city', id],
    queryFn: () => getCityById(Number(id))
  })

  const { mutate, isError } = useMutation({
    mutationFn: updateCity,
    onSuccess: () => {
      toast.success('Cập nhật thành phố thành công')
      navigate('/city')
    }
  })

  const onFinish: FormProps<UpdateCityField>['onFinish'] = (values) => {
    mutate(values)
  }

  useSetBreadcrumb([
    { title: <Link to={'/'}>Dashboard</Link> },
    { title: <Link to={'/city'}>Danh sách thành phố</Link> },
    { title: 'Cập nhật thành phố' }
  ])


  if (isError) {
    toast.error('Có lỗi xảy ra khi thêm thành phố')
  }

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen  />
  }

  if (data) {
    form.setFieldValue('id', data.id)
    form.setFieldValue('name', data.name)
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>Cập nhật thành phố</Typography.Title>
        <Button type="primary" onClick={() => navigate('/city')}>Quay lại</Button>
      </Flex>
      <Form
        form={form}
        name="cityForm"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 32 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<UpdateCityField>
          label="Id"
          name="id"
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item<UpdateCityField>
          label="Tên thành phố"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên thành phố!' },
            { min: 3, message: 'Tên thành phố phải có ít nhất 3 ký tự!' }
          ]}
        >
          <Input />
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

export default UpdateCity
