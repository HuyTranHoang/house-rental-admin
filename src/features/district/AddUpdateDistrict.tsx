import { FormProps, Select, SelectProps } from 'antd'
import { Button, Flex, Form, Input, Spin, Typography } from 'antd'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DistrictField, getDistrictById } from '@/api/district.api'

import { useEffect, useState } from 'react'
import { useCreateDistrict, useUpdateDistrict } from '@/hooks/useDistricts.ts'
import { useCitiesAll } from '@/hooks/useCities.ts'

function AddUpdateDistrict() {
  const match = useMatch('/district/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới quận huyện' : 'Cập nhật quận huyện'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const { data: cityData, isLoading: cityLoading } = useCitiesAll()

  const [error, setError] = useState<string>('')

  const { addDistrictMutate, addDistrictPending } = useCreateDistrict(setError)
  const { updateDistrictMutate, updateDistrictPending } = useUpdateDistrict(setError)

  const onFinish: FormProps<DistrictField>['onFinish'] = (values) => {
    if (isAddMode) {
      addDistrictMutate(values)
    } else {
      updateDistrictMutate(values)
    }
  }

  const { data: districtUpdateData, isLoading: districtIsLoading } = useQuery({
    queryKey: ['district', id],
    queryFn: () => getDistrictById(Number(id)),
    enabled: !isAddMode
  })

  const cityOptions: SelectProps['options'] = []

  if (cityData) {
    cityOptions.push(
      ...cityData.map((city) => ({
        label: city.name,
        value: city.id
      }))
    )
  }

  useEffect(() => {
    if (districtUpdateData) {
      form.setFieldValue('id', districtUpdateData.id)
      form.setFieldValue('name', districtUpdateData.name)
      form.setFieldValue('cityId', districtUpdateData.cityId)
    }
  }, [districtUpdateData, form])

  if (cityLoading || districtIsLoading) {
    return <Spin spinning={true} fullscreen />
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button type="primary" onClick={() => navigate('/district')}>
          Quay lại
        </Button>
      </Flex>
      <Form
        form={form}
        name="districtForm"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 32 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<DistrictField> label="Id" name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<DistrictField>
          label="Tên quận huyện"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên quận huyện`!' },
            { min: 3, message: 'Tên quận huyện phải có ít nhất 3 ký tự!' }
          ]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item<DistrictField>
          label="Thành phố"
          name="cityId"
          rules={[
            { required: true, message: 'Vui lòng chọn thành phố!' }
          ]}
        >
          <Select options={cityOptions} placeholder="Chọn thành phố" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button
            loading={addDistrictPending || updateDistrictPending}
            type="primary"
            htmlType="submit"
            style={{ width: 100 }}
          >
            {isAddMode ? 'Thêm mới' : 'Cập nhật'}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddUpdateDistrict