import { Button, Flex, Form, FormProps, Input, Select, SelectProps, Spin, Typography } from 'antd'
import { useMatch, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getDistrictById } from '@/api/district.api'

import { useEffect, useState } from 'react'
import { useCreateDistrict, useUpdateDistrict } from '@/hooks/useDistricts.ts'
import { useCitiesAll } from '@/hooks/useCities.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { DistrictForm } from '@/models/district.type.ts'

function AddUpdateDistrict() {
  const match = useMatch(ROUTER_NAMES.ADD_DISTRICT)
  const isAddMode = Boolean(match)
  const title = isAddMode ? 'Thêm mới quận huyện' : 'Cập nhật quận huyện'
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const { cityData, cityIsLoading } = useCitiesAll()

  const [error, setError] = useState<string>('')
  const [cityError, setCityError] = useState<string>('')

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

      const cityExists = cityData?.some((city) => city.id === districtUpdateData.cityId)
      if (cityExists) {
        form.setFieldValue('cityId', districtUpdateData.cityId)
      } else {
        form.setFieldValue('cityId', null)
        setCityError(
          `Thành phố '${districtUpdateData.cityName}' không còn tồn tại, vui lòng chọn thành phố khác nếu bạn muốn cập nhật!`
        )
      }
    }
  }, [cityData, districtUpdateData, form])

  if (cityIsLoading || districtIsLoading) {
    return <Spin spinning={true} fullscreen />
  }

  return (
    <>
      <Flex align='center' justify='space-between'>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button
          icon={<LeftCircleOutlined />}
          shape='round'
          type='primary'
          onClick={() => navigate(ROUTER_NAMES.DISTRICT)}
        >
          Quay lại
        </Button>
      </Flex>
      <Form
        form={form}
        name='districtForm'
        labelCol={{ span: 6 }}
        style={{
          maxWidth: 600,
          marginTop: 32,
          boxShadow: '0 0 1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f0f0f0',
          padding: '32px 32px 0'
        }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item<DistrictForm> label='Id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item<DistrictForm>
          label='Tên quận huyện'
          name='name'
          rules={[
            { required: true, message: 'Vui lòng nhập tên quận huyện' },
            { min: 3, message: 'Tên quận huyện phải có ít nhất 3 ký tự' },
            { max: 50, message: 'Tên quận huyện không được vượt quá 50 ký tự' }
          ]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item<DistrictForm>
          label='Thành phố'
          name='cityId'
          rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
        >
          <Select options={cityOptions} placeholder='Chọn thành phố' onChange={() => setCityError('')} />
        </Form.Item>

        {cityError && (
          <Form.Item wrapperCol={{ offset: 6 }}>
            <Typography.Text type='danger'>{cityError}</Typography.Text>
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ offset: 6 }} style={{ marginTop: 48 }}>
          <Button
            onClick={() => {
              form.resetFields()
              setError('')
              setCityError('')
            }}
            style={{ marginRight: 16 }}
          >
            Đặt lại
          </Button>

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
