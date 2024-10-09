import useBoundStore from '@/store.ts'
import { Advertisement } from '@/types/advertisement.type'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { Button, Card, Flex, Image, Switch, Tooltip } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface AdvertisementItemProps {
  advertisement: Advertisement
  onEdit: () => void
  onDelete: () => void
  onActivate: () => void
  updateAdvActivePending: boolean
}

const AdvertisementItem: React.FC<AdvertisementItemProps> = ({
  advertisement,
  onEdit,
  onDelete,
  onActivate,
  updateAdvActivePending
}) => {
  const currentUser = useBoundStore((state) => state.user)

  const { t } = useTranslation()

  return (
    <Card
      title={advertisement.name}
      className='mb-4'
      extra={
        <Switch
          checked={advertisement.actived}
          onChange={onActivate}
          checkedChildren='Kích hoạt'
          unCheckedChildren='Vô hiệu hóa'
          loading={updateAdvActivePending}
          disabled={!hasAuthority(currentUser, 'advertisement:update')}
        />
      }
    >
      <Image
        src={advertisement.imageUrl}
        alt={advertisement.name}
        height={600}
        width={'100%'}
        className='object-cover'
      />
      <Flex justify='space-evenly' className='mt-4'>
        <Tooltip title={t('common.edit')}>
          <Button
            type='primary'
            onClick={onEdit}
            disabled={!hasAuthority(currentUser, 'advertisement:update')}
            className='mr-2'
          >
            <Edit />
          </Button>
        </Tooltip>
        <Tooltip title={t('common.delete')}>
          <Button
            danger
            onClick={onDelete}
            disabled={!hasAuthority(currentUser, 'advertisement:delete')}
            className='mr-2'
          >
            <Trash2 />
          </Button>
        </Tooltip>
      </Flex>
    </Card>
  )
}

export default AdvertisementItem
