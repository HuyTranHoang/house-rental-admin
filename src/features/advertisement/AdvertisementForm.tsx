import React, { useEffect, useState } from 'react'
import { Button, Drawer, Form, Input, Upload, UploadFile } from 'antd'
import { LeftCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { RcFile } from 'antd/es/upload'
import { useAdvertisement, useCreateAdvertisement, useUpdateAdvertisement } from '@/hooks/useAdvertisement'
import { AdvertisementForm as AdvertisementFormType } from '@/types/advertisement.type'
import { validateFile } from '@/utils/uploadFile'

interface AdvertisementFormProps {
  id: number
  open: boolean
  onClose: () => void
}

const AdvertisementForm: React.FC<AdvertisementFormProps> = ({ id, open, onClose }) => {
  const [form] = Form.useForm<AdvertisementFormType>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { t } = useTranslation(['common', 'city'])

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
      toast.error('Vui lòng chọn hình ảnh cho quảng cáo')
      return
    }

    values.image = fileList[0].originFileObj as RcFile
    const mutate = isAddMode ? addAdvMutate : updateAdvMutate
    mutate(values).then(() => {
      onClose()
      form.resetFields()
      toast.success(isAddMode ? 'Thêm thành công' : 'Cập nhật thành công')
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
          label='Tên quảng cáo'
          name='name'
          rules={[
            { required: true, message: 'Không được để trống' },
            { min: 3, message: 'trên 3 kí tự' },
            { max: 100, message: 'dưới 100 kí tự' }
          ]}
        >
          <Input placeholder='Tên quảng cáo' />
        </Form.Item>

        <Form.Item<AdvertisementFormType>
          label='Ghi chú'
          name='description'
          rules={[
            { required: true, message: 'Không được để trống' },
            { min: 3, message: 'trên 3 kí tự' },
            { max: 100, message: 'dưới 100 kí tự' }
          ]}
        >
          <Input placeholder='Ghi chú' />
        </Form.Item>

        <Form.Item<AdvertisementFormType>
          label='Hình ảnh'
          name='image'
          rules={[{ required: true, message: 'Hình ảnh không được để trống' }]}
        >
          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
            listType='picture'
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
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