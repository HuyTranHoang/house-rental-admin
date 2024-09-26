import { useCreateRoomType, useRoomType, useUpdateRoomType } from '@/hooks/useRoomTypes.ts'
import { RoomTypeForm } from '@/types/roomType.type.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, type FormProps, Input } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AddUpdateRoomTypeProps {
  id: number
  formOpen: boolean
  setFormOpen: (open: boolean) => void
}

function AddUpdateRoomType({ id, formOpen, setFormOpen }: AddUpdateRoomTypeProps) {
  const isAddMode = id === 0
  const [form] = Form.useForm<RoomTypeForm>()
  const { t } = useTranslation(['common', 'roomType'])
  const title = isAddMode ? t('roomType:form.addForm') : t('roomType:form.editForm')

  const { addRoomTypeMutate, addRoomTypePening } = useCreateRoomType()
  const { updateRoomTypeMutate, updateRoomTypePending } = useUpdateRoomType()
  const { roomTypeData, roomTypeIsLoading } = useRoomType(id)

  const onFinish: FormProps<RoomTypeForm>['onFinish'] = (values) => {
    const mutate = isAddMode ? addRoomTypeMutate : updateRoomTypeMutate

    mutate(values).then(() => {
      setFormOpen(false)
      form.resetFields()
      toast.success(isAddMode ? t('roomType:notification.addSuccess') : t('roomType:notification.editSuccess'))
    })
  }

  const onClose = () => setFormOpen(false)

  useEffect(() => {
    if (formOpen && roomTypeData) {
      form.setFieldValue('id', roomTypeData.id)
      form.setFieldValue('name', roomTypeData.name)
    } else {
      form.resetFields()
    }
  }, [form, formOpen, roomTypeData])

  return (
    <Drawer
      title={title}
      size='large'
      onClose={onClose}
      open={formOpen}
      loading={roomTypeIsLoading}
      extra={
        <Button icon={<LeftCircleOutlined />} shape='round' onClick={onClose}>
          {t('common.back')}
        </Button>
      }
    >
      <Form form={form} name='roomTypeForm' onFinish={onFinish} layout='vertical' autoComplete='off'>
        <Form.Item<RoomTypeForm> label='Id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item<RoomTypeForm>
          label={t('roomType:form.name')}
          name='name'
          rules={[
            { required: true, message: t('roomType:form.nameRequired') },
            { min: 3, message: t('roomType:form.nameMin') },
            { max: 50, message: t('roomType:form.nameMax') }
          ]}
        >
          <Input placeholder={t('roomType:form.namePlaceholder')} />
        </Form.Item>

        <Form.Item>
          <Button className='mr-4' onClick={() => form.resetFields()}>
            {t('common.reset')}
          </Button>

          <Button loading={addRoomTypePening || updateRoomTypePending} type='primary' htmlType='submit'>
            {isAddMode ? t('common.add') : t('common.update')}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default AddUpdateRoomType
