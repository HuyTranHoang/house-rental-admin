import { useAdvertisements, useDeleteAdvertisement, useUpdateIsActived } from '@/hooks/useAdvertisement'
import useBoundStore from '@/store.ts'
import { Advertisement } from '@/types/advertisement.type'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Col, Flex, Modal, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AdvertisementForm from './AdvertisementForm'
import AdvertisementItem from './AdvertisementItem.tsx'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import ErrorFetching from '@/components/ErrorFetching.tsx'
import { useNavigate } from 'react-router-dom'

function AdvertisementManager() {
  const currentUser = useBoundStore((state) => state.user)
  const navigate = useNavigate()

  const [editId, setEditId] = useState<number>(0)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null)

  const { t } = useTranslation(['common', 'adv'])
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
        toast.success(t('adv:toast.success.delete'))
      })
    }
  }

  const handleActivate = async (id: number, actived: boolean) => {
    try {
      await updateAdvActive(id)
      toast.success(actived ? t('adv:toast.success.deactivate') : t('adv:toast.success.activate'))
    } catch (error) {
      console.error('Error updating advertisement active status:', error)
      toast.error(t('adv:toast.error.update'))
    }
  }

  useEffect(() => {
    if (!hasAuthority(currentUser,'advertisement:read')) {
      navigate(ROUTER_NAMES.DASHBOARD)
    }
  },[currentUser, navigate])

  if (advIsError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align='center' justify='space-between' className='mb-3'>
        <Typography.Title level={2} className='m-0'>
          {t('adv:title')}
        </Typography.Title>
        <Button
          shape='round'
          type='primary'
          disabled={!hasAuthority(currentUser, 'advertisement:create')}
          onClick={() => handleOpenForm()}
        >
          <PlusCircleOutlined /> {t('common.add')}
        </Button>
      </Flex>

      {advIsLoading && <Alert className='mt-2' message={t('common.loading')} type='info' />}

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
        title={t('adv:deleteModal.title', { name: currentAd?.name })}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deleteAdvPending }}
        cancelButtonProps={{ disabled: deleteAdvPending }}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={handleDelete}
      >
        <img src={currentAd?.imageUrl} alt={currentAd?.name} className='w-full object-cover' />
        <Typography.Text type='danger'>{t('adv:deleteModal.content')}</Typography.Text>
      </Modal>
    </>
  )
}

export default AdvertisementManager
