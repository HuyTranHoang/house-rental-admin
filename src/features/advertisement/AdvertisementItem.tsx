import { Advertisement } from '@/types/advertisement.type'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { Button, Card, Image, Switch, Tooltip } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import './Advertisement.css'

interface AdvertisementItemProps {
  advertisement: Advertisement
  setIsModalOpen: (open: boolean) => void
  setCurrentRecord: (record: Advertisement) => void
  updateAdvActivePending: boolean
  updateAdvActive: UseMutateAsyncFunction<Advertisement | undefined, Error, number, unknown>
}

export const AdvertisementItem = ({
  advertisement,
  setIsModalOpen,
  setCurrentRecord,
  updateAdvActivePending,
  updateAdvActive
}: AdvertisementItemProps) => {
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
            loading={updateAdvActivePending}
          />
        }
      >
        <Image src={advertisement.imageUrl} alt={advertisement.name} className='fixed-image' />
        <div className='mt-4 flex justify-evenly'>
          <Tooltip title='Chỉnh sửa'>
            <Button
              type='primary'
              onClick={() => console.log('Chỉnh sửa quảng cáo với ID:', advertisement.id)}
              className='mr-2'
            >
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
    </>
  )
}
