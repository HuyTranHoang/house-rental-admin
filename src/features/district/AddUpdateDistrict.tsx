import { FormProps, Select, SelectProps } from 'antd'
import { Button, Flex, Form, Input, Spin, Typography } from 'antd'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDistrictById } from '@/api/district.api'

import { useEffect, useState } from 'react'
import { useCreateDistrict, useUpdateDistrict } from '@/hooks/useDistricts.ts'
import { useCitiesAll } from '@/hooks/useCities.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import ROUTER_NAMES from '@/constant/routerNames.ts'

import z from 'zod'
import { createSchemaFieldRule } from 'antd-zod'

const DistrictFormValidationScheme = z.object({
  id: z.number().optional(),
  name: z.string({ message: 'Tên quận huyện không được để trống' })
    .min(3, 'Tên quận huyện phải có ít nhất 3 ký tự'),
  cityId: z.number({ message: 'Vui lòng chọn thành phố' })
})

export type DistrictForm = z.infer<typeof DistrictFormValidationScheme>
const rule = createSchemaFieldRule(DistrictFormValidationScheme)

function AddUpdateDistrict() {
  const match = useMatch(ROUTER_NAMES.ADD_DISTRICT)
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới quận huyện' : 'Cập nhật quận huyện'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const { data: cityData, isLoading: cityLoading } = useCitiesAll()

  const [error, setError] = useState<string>('')

  const { addDistrictMutate, addDistrictPending } = useCreateDistrict(setError)
  const { updateDistrictMutate, updateDistrictPending } = useUpdateDistrict(setError)

  const onFinish: FormProps<DistrictForm>['onFinish'] = (values) => {
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
        <Button icon={<LeftCircleOutlined />} shape="round" type="primary"
                onClick={() => navigate(ROUTER_NAMES.DISTRICT)}>
          Quay lại
        </Button>
      </Flex>
      <Form
        form={form}
        name="districtForm"
        labelCol={{ span: 6 }}
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
        <Form.Item<DistrictForm> label="Id" name="id" rules={[rule]} hidden>
          <Input />
        </Form.Item>

        <Form.Item<DistrictForm>
          label="Tên quận huyện"
          name="name"
          rules={[rule]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item<DistrictForm>
          label="Thành phố"
          name="cityId"
          rules={[rule]}
        >
          <Select options={cityOptions} placeholder="Chọn thành phố" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button onClick={() => {
            form.resetFields()
            setError('')
          }} style={{ marginRight: 16 }}>
            Đặt lại
          </Button>

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
