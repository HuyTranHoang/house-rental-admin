
import { useDeleteAdvertisement, useUpdateIsActived } from '@/hooks/useAdvertisement'
import { Advertisement } from '@/types/advertisement.type'
import { Button, Card, Image, Modal, Switch, Tooltip } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import './Advertisement.css';

interface AdvertisementItemProps {
  advertisement: Advertisement
}

export const AdvertisementItem: React.FC<AdvertisementItemProps> = ({ advertisement }) => {
  const { updateAdvActive, updateAdvPending } = useUpdateIsActived()
  const { deleteAdvMutate, deleteAdvPending } = useDeleteAdvertisement()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<Advertisement | null>(null)

  const { t } = useTranslation(['common', 'city'])

  const handleDeleteConfirmation = () => {
    setCurrentRecord(advertisement)
    setIsModalOpen(true)
  }

  const handleActivate = async () => {
    try {
      await updateAdvActive(advertisement.id)
      toast.success(`Quảng cáo ${advertisement.actived ? 'vô hiệu hóa' : 'kích hoạt'} thành công!`)
    } catch (error) {
      console.error('Error updating advertisement active status:', error)
      toast.error('Cập nhật trạng thái quảng cáo thất bại.')
    }
  }

  return (
    <>
      <Card
        title={advertisement.name}
        className='mb-4'
        extra={
          <Switch
            defaultChecked={advertisement.actived}
            onChange={handleActivate}
            checkedChildren='Kích hoạt'
            unCheckedChildren='Vô hiệu hóa'
            loading={updateAdvPending}
          />
        }
      >
        <Image src={advertisement.imageUrl} alt={advertisement.name} className="fixed-image" />
        <div className='mt-4 flex justify-evenly'>
          <Tooltip title='Chỉnh sửa'>
            <Button type='primary' onClick={() => console.log('Chỉnh sửa quảng cáo với ID:', advertisement.id)} className='mr-2'>
              <Edit />
            </Button>
          </Tooltip>
          <Tooltip title='Xoá'>
            <Button danger onClick={handleDeleteConfirmation} className='mr-2'>
              <Trash2 />
            </Button>
          </Tooltip>
        </div>
      </Card>

      <Modal
        open={isModalOpen}
        className='w-96'
        title={`Bạn có chắc chắn muốn xoá '${currentRecord?.name}'`}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deleteAdvPending }}
        cancelButtonProps={{ disabled: deleteAdvPending }}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => {
          if (currentRecord) {
            deleteAdvMutate(currentRecord.id).then(() => {
              setCurrentRecord(null)
              setIsModalOpen(false)
              toast.success('Xoá quảng cáo thành công')
            })
          }
        }}
      >
      </Modal>
    </>
  )
}
