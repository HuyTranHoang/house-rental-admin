import { useCreateMemberShip, useMemberShip, useUpdateMemberShip } from '@/hooks/useMemberships'
import { MemberShipForm } from '@/types/membership.type'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, FormProps, Input, InputNumber } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'  
import { toast } from 'sonner'

interface AddUpdateMemberShipProps {
  id: number
  formOpen: boolean
  setFormOpen: (open: boolean) => void
}

function AddUpdateMemberShip({ id, formOpen, setFormOpen }: AddUpdateMemberShipProps) {
  const isAddMode = id === 0
  const { t } = useTranslation(['common', 'membership'])
  const [form] = Form.useForm<MemberShipForm>()

  const { addMemberShipMutate, addMemberShipPending } = useCreateMemberShip()
  const { updateMemberShipMutate, updateMemberShipPending } = useUpdateMemberShip()
  const { memberShipData, memberShipIsLoading } = useMemberShip(id)

  const title = isAddMode ? t('membership:form.addForm') : t('membership:form.editForm')

  const onFinish: FormProps<MemberShipForm>['onFinish'] = (values) => {
    const mutate = isAddMode ? addMemberShipMutate : updateMemberShipMutate

    mutate(values).then(() => {
      setFormOpen(false)
      form.resetFields()
      toast.success(t(`membership:notification.${isAddMode ? 'add' : 'edit'}Success`))
    })
  }

  const onClose = () => setFormOpen(false)

  useEffect(() => {
    if (formOpen && memberShipData) {
      form.setFieldValue('id', memberShipData.id)
      form.setFieldValue('name', memberShipData.name)
      form.setFieldValue('durationDays', memberShipData.durationDays)
      form.setFieldValue('description', memberShipData.description)
      form.setFieldValue('refresh', memberShipData.refresh)
      form.setFieldValue('priority', memberShipData.priority)
      form.setFieldValue('price', memberShipData.price)
    } else {
      form.resetFields()
    }
  }, [memberShipData, form, formOpen])

  return (
    <Drawer
      title={title}
      size='large'
      onClose={onClose}
      open={formOpen}
      loading={memberShipIsLoading}
      extra={
        <Button icon={<LeftCircleOutlined />} shape='round' onClick={onClose}>
          {t('common.back')}
        </Button>
      }
    >
      <Form form={form} name='memberShipForm' onFinish={onFinish} layout='vertical' autoComplete='off'>
        <Form.Item<MemberShipForm> label='Id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item<MemberShipForm>
          label={t('membership:form.name')}
          name='name'
          rules={[
            { required: true, message: t('membership:form.nameRequired') },
            { min: 3, message: t('membership:form.nameMin') },
            { max: 50, message: t('membership:form.nameMax') }
          ]}
        >
          <Input placeholder={t('membership:form.namePlaceholder')} />
        </Form.Item>

        <Form.Item<MemberShipForm>
          label={t('membership:form.price') + ' (VND)'}
          name='price'
          rules={[
            { required: true, message: t('membership:form.priceRequired') },
            {
              type: 'number',
              min: 0,
              max: 9999999,
              message: t('membership:form.priceInvalid'),
            },
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder={t('membership:form.pricePlaceHolder')} />
        </Form.Item>

        <Form.Item<MemberShipForm>
          label={t('membership:form.durationDays')}
          name='durationDays'
          rules={[
            { required: true, message: t('membership:form.durationDaysRequired') },
            {
              type: 'number',
              min: 0,
              max: 999,
              message: t('membership:form.durationDaysInvalid'),
            },
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder={t('membership:form.durationsDaysPlaceHolder')}
           />
        </Form.Item>

        <Form.Item<MemberShipForm>
          label={t('membership:form.refresh')}
          name='refresh'
          rules={[
            { required: true, message: t('membership:form.refreshRequired') },
            {
              type: 'number',
              min: 0,
              max: 999,
              message: t('membership:form.refreshInvalid'),
            },
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder={t('membership:form.refreshPlaceHolder')} />
        </Form.Item>

        <Form.Item<MemberShipForm>
          label={t('membership:form.priority')}
          name='priority'
          rules={[
            { required: true, message: t('membership:form.priorityRequired') },
            {
              type: 'number',
              min: 0,
              max: 999,
              message: t('membership:form.priorityInvalid'),
            },
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }}
            placeholder={t('membership:form.priorityPlaceHolder')} />
        </Form.Item>

        <Form.Item<MemberShipForm>  
          label={t('membership:form.description')}
          name='description'
          rules={[
            { required: true, message: t('membership:form.descriptionRequired') },
            { min: 10, message: t('membership:form.descriptionDaysMin') },
            { max: 999, message: t('membership:form.descriptionDaysMax') }
          ]}
        >
          <Input placeholder={t('membership:form.descriptionRequired')} />
        </Form.Item>

        <Form.Item>
          <Button className='mr-4' onClick={() => form.resetFields()}>
            {t('common.reset')}
          </Button>

          <Button loading={addMemberShipPending || updateMemberShipPending} type='primary' htmlType='submit'>
            {isAddMode ? t('common.add') : t('common.update')}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default AddUpdateMemberShip
