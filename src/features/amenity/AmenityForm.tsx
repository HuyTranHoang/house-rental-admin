import { useAmenity, useCreateAmenity, useUpdateAmenity } from '@/hooks/useAmenities.ts'
import { AmenityFormType } from '@/types/amenity.type.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, FormProps, Input } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AddUpdateAmenityProps {
  id: number
  formOpen: boolean
  setFormOpen: (open: boolean) => void
}

function AmenityForm({ id, formOpen, setFormOpen }: AddUpdateAmenityProps) {
  const isAddMode = id === 0
  const { t } = useTranslation(['common', 'amenity'])
  const [form] = Form.useForm<AmenityFormType>()

  const { addAmenityMutate, addAmenityPending } = useCreateAmenity()
  const { updateAmenityMutate, updateAmenityPending } = useUpdateAmenity()
  const { amenityData, amenityIsLoading } = useAmenity(id)

  const title = isAddMode ? t('amenity:form.addForm') : t('amenity:form.editForm')

  const onFinish: FormProps<AmenityFormType>['onFinish'] = (values) => {
    const mutate = isAddMode ? addAmenityMutate : updateAmenityMutate

    mutate(values).then(() => {
      setFormOpen(false)
      form.resetFields()
      toast.success(t(`amenity:notification.${isAddMode ? 'add' : 'edit'}Success`))
    })
  }

  const onClose = () => setFormOpen(false)

  useEffect(() => {
    if (formOpen && amenityData) {
      form.setFieldValue('id', amenityData.id)
      form.setFieldValue('name', amenityData.name)
    } else {
      form.resetFields()
    }
  }, [amenityData, form, formOpen])

  return (
    <Drawer
      title={title}
      size='large'
      onClose={onClose}
      open={formOpen}
      loading={amenityIsLoading}
      extra={
        <Button icon={<LeftCircleOutlined />} shape='round' onClick={onClose}>
          {t('common.back')}
        </Button>
      }
    >
      <Form form={form} name='amenityForm' onFinish={onFinish} layout='vertical' autoComplete='off'>
        <Form.Item<AmenityFormType> label='Id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item<AmenityFormType>
          label={t('amenity:form.name')}
          name='name'
          rules={[
            { required: true, message: t('amenity:form.nameRequired') },
            { min: 3, message: t('amenity:form.nameMin') },
            { max: 50, message: t('amenity:form.nameMax') }
          ]}
        >
          <Input placeholder={t('amenity:form.namePlaceholder')} />
        </Form.Item>

        <Form.Item>
          <Button className='mr-4' onClick={() => form.resetFields()}>
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

export default AmenityForm
