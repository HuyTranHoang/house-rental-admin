import { Button, Drawer, Form, FormInstance, FormProps, Input, Select, SelectProps, Spin, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getDistrictById } from '@/api/district.api'

import { useEffect, useState } from 'react'
import { useCreateDistrict, useUpdateDistrict } from '@/hooks/useDistricts.ts'
import { useCitiesAll } from '@/hooks/useCities.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import { DistrictForm } from '@/models/district.type.ts'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AddUpdateDistrictProps {
  form: FormInstance
  id: number | null
  formOpen: boolean
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function AddUpdateDistrict({ form, id, formOpen, setFormOpen }: AddUpdateDistrictProps) {
  
  const isAddMode = id === null
  const { t } = useTranslation(['common', 'district'])
  const title = isAddMode ? t('district:form.addForm') : t('district:form.editForm')


  const { cityData, cityIsLoading } = useCitiesAll()

  const [error, setError] = useState<string>('')
  const [cityError, setCityError] = useState<string>('')

  const { addDistrictMutate, addDistrictPending } = useCreateDistrict()
  const { updateDistrictMutate, updateDistrictPending } = useUpdateDistrict()


  const onFinish: FormProps<DistrictForm>['onFinish'] = (values) => {
    if (isAddMode) {
      addDistrictMutate(values).then(() => {
        form.resetFields()
        setFormOpen(false)
        toast.success(t('district:notification.addSuccess'))
      })
    } else {
      updateDistrictMutate(values).then(() => {
        form.resetFields()
        setFormOpen(false)
        toast.success(t('district:notification.editSuccess'))
      })
    }
  }
  const onClose = () => {
    setFormOpen(false)
    form.resetFields()
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
          `${t('district:form.city')} '${districtUpdateData.cityName}' ${t('district:form.cityRequired')}!`
        )
      }
    }
  }, [cityData, districtUpdateData, form])

  if (cityIsLoading || districtIsLoading) {
    return <Spin spinning={true} fullscreen />
  }

  return (
    <>
     <Drawer
      title={title}
      size='large'
      onClose={onClose}
      open={formOpen}
      loading={districtIsLoading}
      extra={
        <Button icon={<LeftCircleOutlined />} shape='round' onClick={onClose}>
          {t('common.back')}
        </Button>
      }
    >
      <Form
        form={form} layout='vertical' name='districtForm' onFinish={onFinish} autoComplete='off'>
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
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} />
        </Form.Item>

        <Form.Item<DistrictForm>  
          label= {t('district:form.city')}
          name='cityId'
          rules={[{ required: true, message: t('district:form.selectCity') }]}
        >
          <Select options={cityOptions} placeholder={t('district:form.cityPick')} onChange={() => setCityError('')} />
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
            {t('district:form.formReset')}
          </Button>

          <Button
            loading={addDistrictPending || updateDistrictPending}
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

export default AddUpdateDistrict
