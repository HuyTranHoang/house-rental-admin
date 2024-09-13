import { getRoomTypeById } from '@/api/roomType.api.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { useCreateRoomType, useUpdateRoomType } from '@/hooks/useRoomTypes.ts'
import { RoomTypeForm } from '@/models/roomType.type.ts'
import { LeftCircleOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Button, Flex, Form, type FormProps, Input, Spin, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMatch, useNavigate, useParams } from 'react-router-dom'

function AddUpdateRoomType() {
  const match = useMatch(ROUTER_NAMES.ADD_ROOM_TYPE)
  const isAddMode = Boolean(match)
  const { t } = useTranslation(['common', 'roomType'])
  const title = isAddMode ? t('roomType:form.addForm') : t('roomType:form.editForm')
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const [error, setError] = useState<string>('')

  const { addRoomTypeMutate, addRoomTypePening } = useCreateRoomType(setError)
  const { updateRoomTypeMutate, updateRoomTypePending } = useUpdateRoomType(setError)

  const onFinish: FormProps<RoomTypeForm>['onFinish'] = (values) => {
    if (isAddMode) {
      addRoomTypeMutate(values)
    } else {
      updateRoomTypeMutate(values)
    }
  }

  const { data: roomTypeUpdateData, isLoading } = useQuery({
    queryKey: ['roomType', id],
    queryFn: () => getRoomTypeById(Number(id)),
    enabled: !isAddMode
  })

  useEffect(() => {
    if (roomTypeUpdateData) {
      form.setFieldValue('id', roomTypeUpdateData.id)
      form.setFieldValue('name', roomTypeUpdateData.name)
    }
  }, [form, roomTypeUpdateData])

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  return (
    <>
      <Flex align='center' justify='space-between'>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Button
          icon={<LeftCircleOutlined />}
          shape='round'
          type='primary'
          onClick={() => navigate(ROUTER_NAMES.ROOM_TYPE)}
        >
          {t('common.back')}
        </Button>
      </Flex>
      <Form
        form={form}
        name='roomTypeForm'
        labelCol={{ span: 5 }}
        style={{
          maxWidth: 600,
          marginTop: 32,
          boxShadow: 'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
          border: '1px solid #f0f0f0',
          padding: '32px 32px 0'
        }}
        onFinish={onFinish}
        autoComplete='off'
      >
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
          validateStatus={error ? 'error' : undefined}
          extra={<span style={{ color: 'red' }}>{error}</span>}
        >
          <Input onChange={() => setError('')} placeholder={t('roomType:form.namePlaceholder')}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8 }}>
          <Button
            onClick={() => {
              form.resetFields()
              setError('')
            }}
            style={{ marginRight: 16 }}
          >
            {t('common.reset')}
          </Button>

          <Button
            loading={addRoomTypePening || updateRoomTypePending}
            type='primary'
            htmlType='submit'
            style={{ width: 100 }}
          >
            {isAddMode ? t('common.add') : t('common.update')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddUpdateRoomType
