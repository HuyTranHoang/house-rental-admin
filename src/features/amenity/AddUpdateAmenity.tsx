import { getAmenityById } from '@/api/amenity.api.ts'
import { useCreateAmenity, useUpdateAmenity } from '@/hooks/useAmenities.ts'
import { AmenityForm } from '@/models/amenity.type.ts'
import { useQuery } from '@tanstack/react-query'
import { Button, Drawer, Form, FormInstance, FormProps, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AddUpdateAmenityProps {
  form: FormInstance
  id: number | null
  formOpen: boolean
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function AddUpdateAmenity({ form, id, formOpen, setFormOpen }: AddUpdateAmenityProps) {
  const isAddMode = id === null
  const { t } = useTranslation(['common', 'amenity'])

  const [error, setError] = useState<string>('')

  const { addAmenityMutate, addAmenityPending } = useCreateAmenity(setError)
  const { updateAmenityMutate, updateAmenityPending } = useUpdateAmenity(setError)

  const title = isAddMode ? t('amenity:form.addForm') : t('amenity:form.editForm')

  const onFinish: FormProps<AmenityForm>['onFinish'] = (values) => {
    if (isAddMode) {
      addAmenityMutate(values).then(() => {
        toast.success(t('amenity:notification.addSuccess'))
        setFormOpen(false)
        form.resetFields()
      })
    } else {
      updateAmenityMutate(values).then(() => {
        toast.success(t('amenity:notification.editSuccess'))
        setFormOpen(false)
        form.resetFields()
      })
    }
  }

  const { data: amenityUpdateData, isLoading } = useQuery({
    queryKey: ['amenity', id],
    queryFn: () => getAmenityById(Number(id)),
    enabled: !isAddMode
  })

  const onClose = () => {
    setFormOpen(false)
    form.resetFields()
    setError('')
  }

  useEffect(() => {
    if (amenityUpdateData) {
      form.setFieldValue('id', amenityUpdateData.id)
      form.setFieldValue('name', amenityUpdateData.name)
    }
  }, [amenityUpdateData, form])

  return (
    <Drawer
      title={title}
      size='large'
      onClose={onClose}
      open={formOpen}
      loading={isLoading}
      extra={<Button onClick={onClose}>{t('common.back')}</Button>}
    >
      <Form form={form} name='amenityForm' onFinish={onFinish} layout='vertical' autoComplete='off'>
        <Form.Item<AmenityForm> label='Id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item<AmenityForm>
          label={t('amenity:form.name')}
          name='name'
          rules={[
            { required: true, message: t('amenity:form.nameRequired') },
            { min: 3, message: t('amenity:form.nameMin') },
            { max: 50, message: t('amenity:form.nameMax') }
          ]}
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} placeholder={t('amenity:form.namePlaceholder')} />
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

          <Button loading={addAmenityPending || updateAmenityPending} type='primary' htmlType='submit'>
            {isAddMode ? t('common.add') : t('common.update')}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default AddUpdateAmenity
