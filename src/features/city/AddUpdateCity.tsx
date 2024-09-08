import { getCityById } from '@/api/city.api.ts'
import { useQuery } from '@tanstack/react-query'
import type { FormProps } from 'antd'
import { Button, Flex, Form, Input, Spin, Typography } from 'antd'
import { useMatch, useNavigate, useParams } from 'react-router-dom'

import ROUTER_NAMES from '@/constant/routerNames.ts'
import { useCreateCity, useUpdateCity } from '@/hooks/useCities.ts'
import { CityForm } from '@/models/city.type.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

function AddUpdateCity() {
  const match = useMatch(ROUTER_NAMES.ADD_CITY)
  const isAddMode = Boolean(match)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { addCityMutate, addCityPending } = useCreateCity(setError)
  const { updateCityMutate, updateCityPending } = useUpdateCity(setError)

  const title = isAddMode ? t('city.form.addForm') : t('city.form.editForm')

  const onFinish: FormProps<CityForm>['onFinish'] = (values) => {
    if (isAddMode) {
      addCityMutate(values)
    } else {
      updateCityMutate(values)
    }
  }

  const { data: cityUpdateData, isLoading } = useQuery({
    queryKey: ['city', id],
    queryFn: () => getCityById(Number(id)),
    enabled: !isAddMode
  })

  useEffect(() => {
    if (cityUpdateData) {
      form.setFieldValue('id', cityUpdateData.id)
      form.setFieldValue('name', cityUpdateData.name)
    }
  }, [cityUpdateData, form])

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  return (
    <>
      <Flex align='center' justify='space-between'>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button icon={<LeftCircleOutlined />} shape='round' type='primary' onClick={() => navigate(ROUTER_NAMES.CITY)}>
          {t('common.back')}
        </Button>
      </Flex>
      <Form
        form={form}
        name='cityForm'
        labelCol={{ span: 5 }}
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
        <Form.Item<CityForm> label='Id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item<CityForm>
          label={t('city.form.name')}
          name='name'
          rules={[
            { required: true, message: 'Vui lòng nhập tên thành phố' },
            { min: 3, message: 'Tên thành phố phải có ít nhất 3 ký tự' },
            { max: 50, message: 'Tên thành phố không được vượt quá 50 ký tự' }
          ]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 5 }}>
          <Button
            onClick={() => {
              form.resetFields()
              setError('')
            }}
            style={{ marginRight: 16 }}
          >
            {t('common.reset')}
          </Button>

          <Button loading={addCityPending || updateCityPending} type='primary' htmlType='submit' style={{ width: 100 }}>
            {isAddMode ? t('common.add') : t('common.update')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddUpdateCity
