import { Descriptions, DescriptionsProps } from 'antd'
import { gray } from '@ant-design/colors'

function ConfirmModalContent({ items }: { items: DescriptionsProps['items'] }) {
  return (
    <>
      <Descriptions size="small" bordered items={items} />
      <p style={{ color: gray[4], textAlign: 'center' }}>Lưu ý: Hành động này không thể hoàn tác!</p>
    </>
  )
}

export default ConfirmModalContent
