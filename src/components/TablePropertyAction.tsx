import { Button } from 'antd';
import { FormOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

function TablePropertyAction(props: { onDetail: () => void, onDelete: () => void, disabled?: boolean, onSetStatus: () => void }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button 
                disabled={props.disabled} 
                icon={<EyeOutlined />} 
                onClick={props.onDetail}
            >
                Xem Chi Tiết
            </Button>

            <Button 
                disabled={props.disabled} 
                icon={<DeleteOutlined />} 
                type="default" 
                onClick={props.onDelete} 
                danger
            >
                Xóa
            </Button>

            <Button 
                disabled={props.disabled} 
                icon={<FormOutlined />} 
                onClick={props.onSetStatus}
            >
                Chọn Trạng Thái
            </Button>
        </div>
    );
}

export default TablePropertyAction;