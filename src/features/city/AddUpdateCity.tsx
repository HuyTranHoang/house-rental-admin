import { Button, Flex, Typography, Form, Input, Spin } from 'antd'
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom'
import type { FormProps } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { addCity, CityField, getCityById, updateCity } from '../api/city.api.ts'
import { useSetBreadcrumb } from '../../hooks/useSetBreadcrumb.ts'
import axios from 'axios'
import { useState } from 'react'


function AddUpdateCity() {
  const match = useMatch('/city/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới thành phố' : 'Cập nhật thành phố'
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { mutate: addCityMutate } = useMutation({
    mutationFn: addCity,
    onSuccess: () => {
      toast.success('Thêm thành phố thành công')
      queryClient.invalidateQueries({ queryKey: ['cities'] })

      navigate('/city')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  const { mutate: updateCityMutate } = useMutation({
    mutationFn: updateCity,
    onSuccess: () => {
      toast.success('Cập nhật thành phố thành công')
      queryClient.invalidateQueries({ queryKey: ['cities'] })
      navigate('/city')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

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

  useSetBreadcrumb([
    { title: <Link to={'/'}>Dashboard</Link> },
    { title: <Link to={'/city'}>Danh sách thành phố</Link> },
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
          <Button type="primary" htmlType="submit" style={{ width: 100 }}>
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddUpdateCity