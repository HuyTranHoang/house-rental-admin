import { getCityById } from '@/api/city.api.ts'
import { useQuery } from '@tanstack/react-query'
import { Button, Drawer, Form, FormProps, Input } from 'antd'

import { useCreateCity, useUpdateCity } from '@/hooks/useCities.ts'
import { CityForm } from '@/models/city.type.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AddUpdateCityProps {
  id: number
  formOpen: boolean
  setFormOpen: (open: boolean) => void
}

function AddUpdateCity({ id, formOpen, setFormOpen }: AddUpdateCityProps) {
  const isAddMode = id === 0
  const [form] = Form.useForm<CityForm>()
  const { t } = useTranslation(['common', 'city'])

  const { addCityMutate, addCityPending } = useCreateCity()
  const { updateCityMutate, updateCityPending } = useUpdateCity()

  const title = isAddMode ? t('city:form.addForm') : t('city:form.editForm')

  const { data: cityUpdateData, isLoading } = useQuery({
    queryKey: ['city', id],
    queryFn: () => getCityById(Number(id)),
    enabled: !isAddMode
  })

  const onFinish: FormProps<CityForm>['onFinish'] = (values) => {
    const mutate = isAddMode ? addCityMutate : updateCityMutate

    mutate(values).then(() => {
      setFormOpen(false)
      form.resetFields()
      toast.success(isAddMode ? t('city:notification.addSuccess') : t('city:notification.editSuccess'))
    })
  }

  const onClose = () => setFormOpen(false)

  useEffect(() => {
    if (formOpen && cityUpdateData) {
      form.setFieldValue('id', cityUpdateData.id)
      form.setFieldValue('name', cityUpdateData.name)
    } else {
      form.resetFields()
    }
  }, [cityUpdateData, form, formOpen])

  return (
    <Drawer
      title={title}
      size='large'
      onClose={onClose}
      open={formOpen}
      loading={isLoading}
      extra={
        <Button icon={<LeftCircleOutlined />} shape='round' onClick={onClose}>
          {t('common.back')}
        </Button>
      }
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
