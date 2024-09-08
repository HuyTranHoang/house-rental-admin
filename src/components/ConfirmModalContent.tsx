import { gray } from '@ant-design/colors'
import { Descriptions, DescriptionsProps } from 'antd'
import { useTranslation } from 'react-i18next'

function ConfirmModalContent({ items }: { items: DescriptionsProps['items'] }) {
  const { t } = useTranslation()

  return (
    <>
      <Descriptions size='small' bordered items={items} />
      <p style={{ color: gray[4], textAlign: 'center' }}>{t('common.deleteModal.note')}</p>
    </>
  )
}

export default ConfirmModalContent
