import { useCitiesAll } from '@/hooks/useCities.ts'
import { useCreateDistrict, useDistrict, useUpdateDistrict } from '@/hooks/useDistricts.ts'
import { DistrictForm } from '@/models/district.type.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, FormProps, Input, Select, SelectProps, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AddUpdateDistrictProps {
  id: number
  formOpen: boolean
  setFormOpen: (open: boolean) => void
}

function AddUpdateDistrict({ id, formOpen, setFormOpen }: AddUpdateDistrictProps) {
  const isAddMode = id === 0
  const [form] = Form.useForm<DistrictForm>()
  const { t } = useTranslation(['common', 'district'])
  const title = isAddMode ? t('district:form.addForm') : t('district:form.editForm')

  const { cityData, cityIsLoading } = useCitiesAll()

  const [cityError, setCityError] = useState<string>('')

  const { addDistrictMutate, addDistrictPending } = useCreateDistrict()
  const { updateDistrictMutate, updateDistrictPending } = useUpdateDistrict()
  const { districtData, districtIsLoading } = useDistrict(id)

  const cityOptions: SelectProps['options'] = cityData
    ? cityData.map((city) => ({
        label: city.name,
        value: city.id
      }))
    : []

  const onFinish: FormProps<DistrictForm>['onFinish'] = (values) => {
    const mutate = isAddMode ? addDistrictMutate : updateDistrictMutate

    mutate(values).then(() => {
      form.resetFields()
      setFormOpen(false)
      isAddMode
        ? toast.success(t('district:notification.addSuccess'))
        : toast.success(t('district:notification.editSuccess'))
    })
  }
  const onClose = () => setFormOpen(false)

  useEffect(() => {
    if (formOpen && districtData) {
      form.setFieldValue('id', districtData.id)
      form.setFieldValue('name', districtData.name)

      const cityExists = cityData?.some((city) => city.id === districtData.cityId)
      if (cityExists) {
        form.setFieldValue('cityId', districtData.cityId)
      } else {
        form.setFieldValue('cityId', null)
        setCityError(t('district:form.cityNotFound', { cityName: districtData.cityName }))
      }
    } else {
      form.resetFields()
    }
  }, [cityData, districtData, form, formOpen, t])

  return (
    <>
      <Drawer
        title={title}
        size='large'
        onClose={onClose}
        open={formOpen}
        loading={cityIsLoading || districtIsLoading}
        extra={
          <Button icon={<LeftCircleOutlined />} shape='round' onClick={onClose}>
            {t('common.back')}
          </Button>
        }
      >
        <Form form={form} layout='vertical' name='districtForm' onFinish={onFinish} autoComplete='off'>
          <Form.Item<DistrictForm> label='Id' name='id' hidden>
            <Input />
          </Form.Item>

          <Form.Item<DistrictForm>
            label={t('district:form.name')}
            name='name'
            rules={[
              { required: true, message: t('district:form.nameRequired') },
              { min: 3, message: t('district:form.nameMin') },
              { max: 50, message: t('district:form.nameMax') }
            ]}
          >
            <Input placeholder={t('district:form.namePlaceholder')} />
          </Form.Item>

          <Form.Item<DistrictForm>
            label={t('district:form.city')}
            name='cityId'
            rules={[{ required: true, message: t('district:form.cityRequired') }]}
          >
            <Select
              options={cityOptions}
              placeholder={t('district:form.cityPlaceholder')}
              onChange={() => setCityError('')}
            />
          </Form.Item>

          {cityError && (
            <Form.Item>
              <Typography.Text type='danger'>{cityError}</Typography.Text>
            </Form.Item>
          )}

          <Form.Item>
            <Button
              onClick={() => {
                form.resetFields()
                setCityError('')
              }}
              className='mr-4'
            >
              {t('district:form.formReset')}
            </Button>

            <Button loading={addDistrictPending || updateDistrictPending} type='primary' htmlType='submit'>
              {isAddMode ? t('common.add') : t('common.update')}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}

export default AddUpdateDistrict
