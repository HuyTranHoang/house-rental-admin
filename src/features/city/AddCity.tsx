import { Button, Flex, Typography, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import type { FormProps } from 'antd'
import { useMutation } from '@tanstack/react-query'
import {toast} from 'sonner'
import { addCity, AddCityField } from '../api/city.api.ts'
import { useSetBreadcrumb } from '../../hooks/useSetBreadcrumb.ts'

const onFinishFailed: FormProps<AddCityField>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

function AddCity() {
  const navigate = useNavigate()
  const {mutate, isError} = useMutation({
    mutationFn: addCity,
    onSuccess: () => {
      toast.success('Thêm thành phố thành công')
      navigate('/city')
    }
  })

  const onFinish: FormProps<AddCityField>['onFinish'] = (values) => {
    mutate(values)
  }

  if (isError) {
    toast.error('Có lỗi xảy ra khi thêm thành phố')
  }

  useSetBreadcrumb([
    { title: <Link to={'/'}>Dashboard</Link> },
    { title: <Link to={'/city'}>Danh sách thành phố</Link> },
    { title: 'Thêm mới thành phố' }
  ])

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>Thêm mới thành phố</Typography.Title>
        <Button type="primary" onClick={() => navigate('/city')}>Quay lại</Button>
      </Flex>
      <Form
        name="cityForm"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 32 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<AddCityField>
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

export default AddCity
