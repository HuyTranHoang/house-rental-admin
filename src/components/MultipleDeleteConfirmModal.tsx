import { DescriptionsProps, Modal } from 'antd'
import React from 'react'
import ConfirmModalContent from '../components/ConfirmModalContent'
import ConfirmModalTitle from '../components/ConfirmModalTitle'

interface MultipleDeleteConfirmProps {
  deleteIdList: number[]
  title: string
  onOk: () => void
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

const MultipleDeleteConfirmModal: React.FC<MultipleDeleteConfirmProps> = ({ deleteIdList, title, onOk, isModalOpen, setIsModalOpen }) => {
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Số lượng đã chọn',
      children: <span>{deleteIdList.length}</span>
    }
  ]

  const handleOk = () => {
    onOk()
    setIsModalOpen(false)
  }

  return (
    <Modal
      open={isModalOpen}
      className='w-96'
      title={<ConfirmModalTitle title={title} />}
      onCancel={() => setIsModalOpen(false)}
      onOk={handleOk}
      okText='Xác nhận'
      okType='danger'
      cancelText='Hủy'
    >
      <ConfirmModalContent items={items} />
    </Modal>
  )
}

export default MultipleDeleteConfirmModal