import type { FormProps, SelectProps } from 'antd'
import { Button, Flex, Form, Input, Select, Spin, Typography } from 'antd'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DistrictField, getDistrictById } from '@/api/district.api'

import { useEffect, useState } from 'react'
import { useCreateDistrict, useUpdateDistrict } from '@/hooks/useDistricts.ts'
import { useCity } from '@/hooks/useCities'
import { City } from '@/models/city.type'
import { customFormatDate } from '@/utils/customFormatDate'

function AddUpdateDistrict() {
  const match = useMatch('/district/add')
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới quận huyện' : 'Cập nhật quận huyện'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const cityData = useCity()

  const cityDataSource = cityData
    ? cityData.data?.map((city: City) => ({
        key: city.id,
        cityId: city.id,
        cityName: city.name,
        createdAt: customFormatDate(city.createdAt)
      }))
    : []

  const options: SelectProps['opions'] = [cityDataSource?.map((city: City) => {})]

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

  const { districtData: districtUpdateData, isLoading } = useQuery({
    queryKey: ['district', id],
    queryFn: () => getDistrictById(Number(id)),
    enabled: !isAddMode
  })

  useEffect(() => {
    if (districtUpdateData) {
      form.setFieldValue('id', districtUpdateData.id)
      form.setFieldValue('name', districtUpdateData.name)
      form.setFieldValue('cityId', districtUpdateData.cityId)
      form.setFieldValue('cityName', districtUpdateData.cityName)
    }
  }, [districtUpdateData, form])

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  return (
    <>
      <Flex align='center' justify='space-between'>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button type='primary' onClick={() => navigate('/district')}>
          Quay lại
        </Button>
      </Flex>
      <Form
        form={form}
        name='districtForm'
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 32 }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item<DistrictField> label='Id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item<DistrictField>
          label='Tên quận huyện'
          name='name'
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
          label='Tên thành phố'
          name='cityName'
          rules={[{ required: true, message: 'Vui lòng chọn thành phố!' }]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        ></Form.Item>

        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button
            loading={addDistrictPending || updateDistrictPending}
            type='primary'
            htmlType='submit'
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
