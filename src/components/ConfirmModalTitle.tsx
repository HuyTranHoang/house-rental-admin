import { Flex } from 'antd'
import { red } from '@ant-design/colors'
import { WarningOutlined } from '@ant-design/icons'

function ConfirmModalTitle({ title }: { title: string }) {
  return (
    <Flex vertical align='center'>
      <Flex
        justify='center'
        align='center'
        style={{ backgroundColor: red[0], width: 44, height: 44, borderRadius: '100%' }}
      >
        <WarningOutlined style={{ color: red.primary, fontSize: 24 }} />
      </Flex>
      <span style={{ margin: '6px 0' }}>{title}</span>
    </Flex>
  )
}

export default ConfirmModalTitle
