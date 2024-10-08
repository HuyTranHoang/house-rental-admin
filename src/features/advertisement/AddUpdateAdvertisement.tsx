import { useAdvertisement, useCreateAdvertisement, useUpdateAdvertisement } from '@/hooks/useAdvertisement'
import { AdvertisementForm } from '@/types/advertisement.type'
import { LeftCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, FormProps, Input, Upload, UploadFile } from 'antd'
import { RcFile } from 'antd/es/upload'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AddUpdateAdvertisementProps {
  id: number
  formOpen: boolean
  setFormOpen: (open: boolean) => void
}

function AddUpdateAdvertisement({ id, formOpen, setFormOpen }: AddUpdateAdvertisementProps) {
  const isAddMode = id === 0
  const [form] = Form.useForm<AdvertisementForm>()
  const { t } = useTranslation(['common', 'city'])
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const { addAdvMutate, addAdvPending } = useCreateAdvertisement()
  const { updateAdvMutate, updateAdvPending } = useUpdateAdvertisement()
  const { advData, advIsLoading } = useAdvertisement(id)

  const title = isAddMode ? t('common.add') : t('common.edit')

  const onFinish: FormProps<AdvertisementForm>['onFinish'] = (values) => {
    console.log('Form Values: ', values)

    if (!fileList.length) {
      toast.error('Vui lòng chọn hình ảnh cho quảng cáo')
      return
    }

    values.image = fileList[0].originFileObj as RcFile
    const mutate = isAddMode ? addAdvMutate : updateAdvMutate
    mutate(values).then(() => {
      setFormOpen(false)
      form.resetFields()
      toast.success(isAddMode ? 'Thêm thành công' : 'Cập nhật thành công')
    })
  }

  const onClose = () => setFormOpen(false)

  const beforeUpload = (file: UploadFile): boolean => {
    setFileList([file])
    return false
  }

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => setFileList(fileList)

  useEffect(() => {
    if (formOpen && advData) {
      form.setFieldsValue({
        id: advData.id,
        name: advData.name,
        image: advData.imageUrl
      })
      setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: advData.imageUrl }])
    } else {
      form.resetFields()
      setFileList([])
    }
  }, [advData, form, formOpen])

  return (
    <Drawer
      title={title}
      size='large'
      onClose={onClose}
      open={formOpen}
      loading={advIsLoading}
      extra={
        <Button icon={<LeftCircleOutlined />} shape='round' onClick={onClose}>
          {t('common.back')}
        </Button>
      }
    >
      <Form form={form} layout='vertical' name='advertisementForm' onFinish={onFinish} autoComplete='off'>
        <Form.Item<AdvertisementForm> label='Id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item<AdvertisementForm>
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
        <Form.Item<AdvertisementForm>
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

        <Form.Item<AdvertisementForm>
          label='Hình ảnh'
          name='image'
          rules={[{ required: true, message: 'Hình ảnh không được để trống' }]}
        >
          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
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

export default AddUpdateAdvertisement
