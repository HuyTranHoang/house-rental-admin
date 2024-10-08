import { useAdvertisements, useDeleteAdvertisement, useUpdateIsActived } from '@/hooks/useAdvertisement'
import { Advertisement } from '@/types/advertisement.type.ts'
import { Alert, Button, Col, Divider, Flex, Modal, Row, Space, Typography } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AddUpdateAdvertisement from './AddUpdateAdvertisement'
import { AdvertisementItem } from './AdvertisementItem'
import { PlusCircleOutlined } from '@ant-design/icons'

export function ListAdvertisement() {
  const [editId, setEditId] = useState<number>(0)
  const [formOpen, setFormOpen] = useState(false)

  const { deleteAdvMutate, deleteAdvPending } = useDeleteAdvertisement()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Advertisement | null>(null)

  const { updateAdvActive, updateAdvActivePending } = useUpdateIsActived()

  const { t } = useTranslation(['common'])
  const { advData, advIsLoading, advIsError } = useAdvertisements()

  const handeOpenForm = (id: number) => {
    setEditId(id)
    setFormOpen(true)
  }

  if (advIsError) return <Alert message='Lỗi khi lấy quảng cáo' type='error' />

  return (
    <>
      <Flex align='center' justify='space-between' className='mb-3'>
        <Flex align='center'>
          <Typography.Title level={2} className='m-0'>
            Quảng Cáo
          </Typography.Title>
          <Divider type='vertical' className='mx-4 h-10 bg-gray-600' />
        </Flex>
        <Space>
          <Button shape='round' type='primary' onClick={() => handeOpenForm(0)}>
            <PlusCircleOutlined /> Thêm mới
          </Button>
        </Space>
      </Flex>

      {advIsLoading && <Alert className='mt-2' message='Đang tải dữ liệu' type='info' />}

      <Row gutter={16} className='flex justify-center mt-8'>
        {advData?.map((ad) => (
          <Col span={7} key={ad.id}>
            <AdvertisementItem
              advertisement={ad}
              setCurrentRecord={setCurrentRecord}
              setIsModalOpen={setIsDeleteModalOpen}
              updateAdvActive={updateAdvActive}
              updateAdvActivePending={updateAdvActivePending}
            />
          </Col>
        ))}
      </Row>

      <AddUpdateAdvertisement id={editId} formOpen={formOpen} setFormOpen={setFormOpen} />

      <Modal
        open={isDeleteModalOpen}
        className='w-96'
        title={`Bạn có chắc chắn muốn xoá '${currentRecord?.name}'`}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deleteAdvPending }}
        cancelButtonProps={{ disabled: deleteAdvPending }}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={() => {
          if (currentRecord) {
            deleteAdvMutate(currentRecord.id).then(() => {
              setCurrentRecord(null)
              setIsDeleteModalOpen(false)
              toast.success('Xoá quảng cáo thành công')
            })
          }
        }}
      >
        <img src={currentRecord?.imageUrl} alt={currentRecord?.name} className='w-full object-cover' />
        <Typography.Text type='danger'>Hành động này không thể hoàn tác</Typography.Text>
      </Modal>
    </>
  )
}
