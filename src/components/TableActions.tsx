import { Button, Space } from 'antd'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'

function TableActions(props: { onUpdate: () => void, onDelete: () => void, disabled?: boolean }) {
  return <Space size="middle">
    <Button disabled={props.disabled} icon={<FormOutlined />} onClick={props.onUpdate}>
      Cập nhật
    </Button>

    <Button disabled={props.disabled}
            icon={<DeleteOutlined />} type="default"
            onClick={props.onDelete}
            danger>
      Xóa
    </Button>
  </Space>
}

export default TableActions