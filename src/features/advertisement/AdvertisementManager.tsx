import { useAdvertisements, useDeleteAdvertisement, useUpdateIsActived } from '@/hooks/useAdvertisement'
import { Advertisement } from '@/types/advertisement.type'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Col, Flex, Modal, Row, Typography } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AdvertisementForm from './AdvertisementForm'
import AdvertisementItem from './AdvertisementItem.tsx'

function AdvertisementManager() {
  const [editId, setEditId] = useState<number>(0)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null)

  const { t } = useTranslation(['common'])
  const { advData, advIsLoading, advIsError } = useAdvertisements()
  const { deleteAdvMutate, deleteAdvPending } = useDeleteAdvertisement()
  const { updateAdvActive, updateAdvActivePending } = useUpdateIsActived()

  const handleOpenForm = (id: number = 0) => {
    setEditId(id)
    setFormOpen(true)
  }

  const handleDeleteConfirmation = (ad: Advertisement) => {
    setCurrentAd(ad)
    setDeleteModalOpen(true)
  }

  const handleDelete = () => {
    if (currentAd) {
      deleteAdvMutate(currentAd.id).then(() => {
        setCurrentAd(null)
        setDeleteModalOpen(false)
        toast.success('Xoá quảng cáo thành công')
      })
    }
  }

  const handleActivate = async (id: number, actived: boolean) => {
    try {
      await updateAdvActive(id)
      toast.success(`Quảng cáo ${actived ? 'vô hiệu hóa' : 'kích hoạt'} thành công!`)
    } catch (error) {
      console.error('Error updating advertisement active status:', error)
      toast.error('Cập nhật trạng thái quảng cáo thất bại.')
    }
  }

  if (advIsError) return <Alert message='Lỗi khi lấy quảng cáo' type='error' />

  return (
    <>
      <Flex align='center' justify='space-between' className='mb-3'>
        <Typography.Title level={2} className='m-0'>
          Quảng Cáo
        </Typography.Title>
        <Button shape='round' type='primary' onClick={() => handleOpenForm()}>
          <PlusCircleOutlined /> Thêm mới
        </Button>
      </Flex>

      {advIsLoading && <Alert className='mt-2' message='Đang tải dữ liệu' type='info' />}

      <Row gutter={16} className='mt-8 flex justify-center'>
        {advData?.map((ad) => (
          <Col span={8} key={ad.id}>
            <AdvertisementItem
              advertisement={ad}
              onEdit={() => handleOpenForm(ad.id)}
              onDelete={() => handleDeleteConfirmation(ad)}
              onActivate={() => handleActivate(ad.id, ad.actived)}
              updateAdvActivePending={updateAdvActivePending}
            />
          </Col>
        ))}
      </Row>

      <AdvertisementForm id={editId} open={formOpen} onClose={() => setFormOpen(false)} />

      <Modal
        open={deleteModalOpen}
        title={`Bạn có chắc chắn muốn xoá '${currentAd?.name}'`}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deleteAdvPending }}
        cancelButtonProps={{ disabled: deleteAdvPending }}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
      >
        <img src={currentAd?.imageUrl} alt={currentAd?.name} className='w-full object-cover' />
        <Typography.Text type='danger'>Hành động này không thể hoàn tác</Typography.Text>
      </Modal>
    </>
  )
}

export default AdvertisementManager
