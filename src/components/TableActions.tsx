import { DeleteOutlined, FormOutlined } from '@ant-design/icons'
import { Button, Space } from 'antd'
import { useTranslation } from 'react-i18next'

interface TableActionsProps {
  onUpdate: () => void
  onDelete: () => void
  updateDisabled?: boolean
  deleteDisabled?: boolean
}

function TableActions({ deleteDisabled, updateDisabled, onUpdate, onDelete }: TableActionsProps) {
  const { t } = useTranslation()

  return (
    <Space size='middle'>
      <Button disabled={updateDisabled} icon={<FormOutlined />} onClick={onUpdate}>
        {t('common.edit')}
      </Button>

      <Button disabled={deleteDisabled} icon={<DeleteOutlined />} type='default' onClick={onDelete} danger>
        {t('common.delete')}
      </Button>
    </Space>
  )
}

export default TableActions
