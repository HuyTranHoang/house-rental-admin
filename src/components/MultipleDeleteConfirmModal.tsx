import { DescriptionsProps, Modal } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ConfirmModalContent from '../components/ConfirmModalContent'
import ConfirmModalTitle from '../components/ConfirmModalTitle'

interface MultipleDeleteConfirmProps {
  deleteIdList: number[]
  title: string
  onOk: () => void
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  pending: boolean
}

const MultipleDeleteConfirmModal: React.FC<MultipleDeleteConfirmProps> = ({
  deleteIdList,
  title,
  onOk,
  isModalOpen,
  setIsModalOpen,
  pending
}) => {
  const { t } = useTranslation()

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: t('common.deleteModal.quantitySelected'),
      children: <span>{deleteIdList.length}</span>
    }
  ]

  return (
    <Modal
      open={isModalOpen}
      className='w-96'
      title={<ConfirmModalTitle title={title} />}
      onCancel={() => setIsModalOpen(false)}
      onOk={onOk}
      okText={t('common.ok')}
      okType='danger'
      cancelText={t('common.cancel')}
      okButtonProps={{ loading: pending }}
      cancelButtonProps={{ disabled: pending }}
    >
      <ConfirmModalContent items={items} />
    </Modal>
  )
}

export default MultipleDeleteConfirmModal
