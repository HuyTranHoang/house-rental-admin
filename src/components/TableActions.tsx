import { DeleteOutlined, FormOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { useTranslation } from 'react-i18next'

function TableActions(props: { onUpdate: () => void; onDelete: () => void; disabled?: boolean }) {
  const { t } = useTranslation()

  return (
    <Space size='middle'>
      <Button disabled={props.disabled} icon={<FormOutlined />} onClick={props.onUpdate}>
        {t('common.edit')}
      </Button>

      <Button disabled={props.disabled} icon={<DeleteOutlined />} type='default' onClick={props.onDelete} danger>
        {t('common.delete')}
      </Button>
    </Space>
  )
}

export default TableActions
