import { Button, Space } from 'antd'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'

function TableActions(props: { onUpdate: () => void, onDelete: () => void }) {
  return <Space size="middle">
    <Button icon={<FormOutlined />} onClick={props.onUpdate}>
      Cập nhật
    </Button>

    <Button icon={<DeleteOutlined />} type="default"
            onClick={props.onDelete}
            danger>
      Xóa
    </Button>
  </Space>
}

export default TableActions