import { getCityById } from '@/api/city.api.ts'
import { useQuery } from '@tanstack/react-query'
import { Button, Drawer, Form, FormProps, Input, Spin } from 'antd'

import { useCreateCity, useUpdateCity } from '@/hooks/useCities.ts'
import { CityForm } from '@/models/city.type.ts'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AddUpdateCityProps {
  id: number | null
  formOpen: boolean
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function AddUpdateCity({ id, formOpen, setFormOpen }: AddUpdateCityProps) {
  const isAddMode = id === null
  const { t } = useTranslation(['common', 'city'])
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { addCityMutate, addCityPending } = useCreateCity(setError)
  const { updateCityMutate, updateCityPending } = useUpdateCity(setError)

  const title = isAddMode ? t('city:form.addForm') : t('city:form.editForm')

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

  const onClose = () => {
    setFormOpen(false)
    form.resetFields()
    setError('')
  }

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  return (
    <>
      <Drawer
        title={title}
        size='large'
        onClose={onClose}
        open={formOpen}
        extra={<Button onClick={onClose}>{t('common.back')}</Button>}
      >
        <Form form={form} layout='vertical' name='cityForm' onFinish={onFinish} autoComplete='off'>
          <Form.Item<CityForm> label='Id' name='id' hidden>
            <Input />
          </Form.Item>

          <Form.Item<CityForm>
            label={t('city:form.name')}
            name='name'
            rules={[
              { required: true, message: t('city:form.nameRequired') },
              { min: 3, message: t('city:form.nameMin') },
              { max: 50, message: t('city:form.nameMax') }
            ]}
            validateStatus={error ? 'error' : undefined}
            extra={<span style={{ color: 'red' }}>{error}</span>}
          >
            <Input onChange={() => setError('')} placeholder={t('city:form.namePlaceholder')} />
          </Form.Item>

          <Form.Item>
            <Button
              className='mr-4'
              onClick={() => {
                form.resetFields()
                setError('')
              }}
            >
              {t('common.reset')}
            </Button>

            <Button
              loading={addCityPending || updateCityPending}
              type='primary'
              htmlType='submit'
              style={{ width: 100 }}
            >
              {isAddMode ? t('common.add') : t('common.update')}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default AddUpdateCity
