import { useUpdateIsActived } from '@/hooks/useAdvertisement'
import { Advertisement } from '@/types/advertisement.type'
import { Button, Card, Image, Switch, Tooltip } from 'antd'
import { Edit, Trash2 } from 'lucide-react'

interface AdvertisementItemProps {
  advertisement: Advertisement
  onDelete: (id: number) => void
}

export const AdvertisementItem: React.FC<AdvertisementItemProps> = ({ advertisement, onDelete }) => {
  const { updateAdvActive, updateAdvPending } = useUpdateIsActived()

  const handleDelete = () => {
    onDelete(advertisement.id)
  }

  const handleEdit = () => {
    console.log('Chỉnh sửa quảng cáo với ID:', advertisement.id)
  }

  const handleActivate = async () => {
    try {
      await updateAdvActive(advertisement.id)
    } catch (error) {
      console.error('Error updating advertisement active status:', error)
    }
  }

  return (
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
      <Image src={advertisement.imageUrl} alt={advertisement.name} />
      <div className='mt-4 flex justify-evenly'>
        <Tooltip title='Chỉnh sửa'>
          <Button type='primary' onClick={handleEdit} className='mr-2'>
            <Edit />
          </Button>
        </Tooltip>
        <Tooltip title='Xoá'>
          <Button danger onClick={handleDelete} className='mr-2'>
            <Trash2 />
          </Button>
        </Tooltip>
      </div>
    </Card>
  )
}
