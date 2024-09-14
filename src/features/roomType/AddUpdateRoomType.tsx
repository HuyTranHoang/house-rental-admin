import { getRoomTypeById } from '@/api/roomType.api.ts'
import { useCreateRoomType, useUpdateRoomType } from '@/hooks/useRoomTypes.ts'
import { RoomTypeForm } from '@/models/roomType.type.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Drawer, Form, FormInstance, type FormProps, Input } from 'antd'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AddUpdateRoomTypeProps {
  form: FormInstance
  id: number | null
  formOpen: boolean
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function AddUpdateRoomType({ form, id, formOpen, setFormOpen }: AddUpdateRoomTypeProps) {
  const isAddMode = id === null
  const { t } = useTranslation(['common', 'roomType'])
  const title = isAddMode ? t('roomType:form.addForm') : t('roomType:form.editForm')

  const { addRoomTypeMutate, addRoomTypePening } = useCreateRoomType()
  const { updateRoomTypeMutate, updateRoomTypePending } = useUpdateRoomType()

  const onFinish: FormProps<RoomTypeForm>['onFinish'] = (values) => {
    if (isAddMode) {
      addRoomTypeMutate(values).then(() => {
        toast.success(t('roomType:notification.addSuccess'))
        setFormOpen(false)
        form.resetFields()
      })
    } else {
      updateRoomTypeMutate(values).then(() => {
        toast.success(t('roomType:notification.editSuccess'))
        setFormOpen(false)
        form.resetFields()
      })
    }
  }

  const { data: roomTypeUpdateData, isLoading } = useQuery({
    queryKey: ['roomType', id],
    queryFn: () => getRoomTypeById(Number(id)),
    enabled: !isAddMode
  })

  const onClose = () => {
    setFormOpen(false)
    form.resetFields()
  }

  useEffect(() => {
    if (roomTypeUpdateData) {
      form.setFieldValue('id', roomTypeUpdateData.id)
      form.setFieldValue('name', roomTypeUpdateData.name)
    }
  }, [form, roomTypeUpdateData])

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
