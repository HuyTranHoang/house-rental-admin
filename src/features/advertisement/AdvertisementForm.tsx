import { useAdvertisement, useCreateAdvertisement, useUpdateAdvertisement } from '@/hooks/useAdvertisement'
import { AdvertisementForm as AdvertisementFormType } from '@/types/advertisement.type'
import { validateFile } from '@/utils/uploadFile'
import { LeftCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Input, Upload, UploadFile } from 'antd'
import { RcFile } from 'antd/es/upload'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AdvertisementFormProps {
  id: number
  open: boolean
  onClose: () => void
}

const AdvertisementForm: React.FC<AdvertisementFormProps> = ({ id, open, onClose }) => {
  const [form] = Form.useForm<AdvertisementFormType>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { t } = useTranslation(['common', 'adv'])

  const isAddMode = id === 0
  const { addAdvMutate, addAdvPending } = useCreateAdvertisement()
  const { updateAdvMutate, updateAdvPending } = useUpdateAdvertisement()
  const { advData, advIsLoading } = useAdvertisement(id)

  useEffect(() => {
    if (open && advData) {
      form.setFieldsValue({
        id: advData.id,
        name: advData.name,
        description: advData.description,
        image: advData.imageUrl
      })
      setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: advData.imageUrl }])
    } else {
      form.resetFields()
      setFileList([])
    }
  }, [advData, form, open])

  const onFinish = (values: AdvertisementFormType) => {
    if (!fileList.length) {
      toast.error(t('adv:form.imageRequired'))
      return
    }

    values.image = fileList[0].originFileObj as RcFile
    const mutate = isAddMode ? addAdvMutate : updateAdvMutate
    mutate(values).then(() => {
      onClose()
      form.resetFields()
      toast.success(isAddMode ? t('adv:toast.success.create') : t('adv:toast.success.update'))
    })
  }

  const beforeUpload = (file: UploadFile): boolean => {
    if (validateFile(file)) {
      setFileList([file])
    }
    return false
  }

  return (
    <Drawer
      title={isAddMode ? t('common.add') : t('common.edit')}
      size='large'
      onClose={onClose}
      open={open}
      loading={advIsLoading}
      extra={
        <Button icon={<LeftCircleOutlined />} shape='round' onClick={onClose}>
          {t('common.back')}
        </Button>
      }
    >
      <Form form={form} layout='vertical' name='advertisementForm' onFinish={onFinish} autoComplete='off'>
        <Form.Item<AdvertisementFormType> label='Id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item<AdvertisementFormType>
          label={t('adv:form.name')}
          name='name'
          rules={[
            { required: true, message: t('adv:form.nameRequired') },
            { min: 3, message: t('adv:form.nameMin') },
            { max: 100, message: t('adv:form.nameMax') }
          ]}
        >
          <Input placeholder={t('adv:form.name')} />
        </Form.Item>

        <Form.Item<AdvertisementFormType>
          label={t('adv:form.description')}
          name='description'
          rules={[
            { required: true, message: t('adv:form.descriptionRequired') },
            { min: 3, message: t('adv:form.descriptionMin') },
            { max: 100, message: t('adv:form.descriptionMax') }
          ]}
        >
          <Input placeholder={t('adv:form.description')} />
        </Form.Item>

        <Form.Item<AdvertisementFormType>
          label={t('adv:form.image')}
          name='image'
          rules={[{ required: true, message: t('adv:form.imageRequired') }]}
        >
          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
            listType='picture'
          >
            <Button icon={<UploadOutlined />}>{t('adv:form.selectPicture')}</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button className='mr-4' onClick={() => form.resetFields()}>
            {t('common.reset')}
          </Button>
          <Button loading={addAdvPending || updateAdvPending} type='primary' htmlType='submit'>
            {isAddMode ? t('common.add') : t('common.update')}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default AdvertisementForm
