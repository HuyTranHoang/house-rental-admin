import { getCityById } from '@/api/city.api.ts'
import { useQuery } from '@tanstack/react-query'
import { Button, Drawer, Form, FormInstance, FormProps, Input } from 'antd'

import { useCreateCity, useUpdateCity } from '@/hooks/useCities.ts'
import { CityForm } from '@/models/city.type.ts'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AddUpdateCityProps {
  form: FormInstance
  id: number | null
  formOpen: boolean
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function AddUpdateCity({ form, id, formOpen, setFormOpen }: AddUpdateCityProps) {
  const isAddMode = id === null
  const { t } = useTranslation(['common', 'city'])

  const { addCityMutate, addCityPending } = useCreateCity()
  const { updateCityMutate, updateCityPending } = useUpdateCity()

  const title = isAddMode ? t('city:form.addForm') : t('city:form.editForm')

  const onFinish: FormProps<CityForm>['onFinish'] = (values) => {
    if (isAddMode) {
      addCityMutate(values).then(() => {
        form.resetFields()
        setFormOpen(false)
        toast.success(t('city:notification.addSuccess'))
      })
    } else {
      updateCityMutate(values).then(() => {
        form.resetFields()
        setFormOpen(false)
        toast.success(t('city:notification.editSuccess'))
      })
    }
  }

  const { data: cityUpdateData, isLoading } = useQuery({
    queryKey: ['city', id],
    queryFn: () => getCityById(Number(id)),
    enabled: !isAddMode
  })

  const onClose = () => {
    setFormOpen(false)
    form.resetFields()
  }

  useEffect(() => {
    if (cityUpdateData) {
      form.setFieldValue('id', cityUpdateData.id)
      form.setFieldValue('name', cityUpdateData.name)
    }
  }, [cityUpdateData, form])

  return (
    <Drawer
      title={title}
      size='large'
      onClose={onClose}
      open={formOpen}
      loading={isLoading}
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
        >
          <Input placeholder={t('city:form.namePlaceholder')} />
        </Form.Item>

        <Form.Item>
          <Button className='mr-4' onClick={() => form.resetFields()}>
            {t('common.reset')}
          </Button>

          <Button loading={addCityPending || updateCityPending} type='primary' htmlType='submit'>
            {isAddMode ? t('common.add') : t('common.update')}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default AddUpdateCity
