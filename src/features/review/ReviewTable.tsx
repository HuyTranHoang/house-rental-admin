import { Modal, Rate, Table, TablePaginationConfig, TableProps } from "antd";
import { Review } from "../../models/review.type";
import { TableRowSelection } from "antd/es/table/interface";
import { useNavigate } from "react-router-dom";
import TableActions from "../../components/TableActions";
import { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";


const { confirm } = Modal

type DataSourceType = Review & {
    key: React.Key;
}

interface ReviewTableProps {
    dataSource: DataSourceType[];
    loading: boolean;
    paginationProps: false | TablePaginationConfig | undefined;
    handleTableChange: TableProps<DataSourceType>['onChange'];
    rowSelection: TableRowSelection<DataSourceType> | undefined
}

function ReviewTable({
                    dataSource,
                    loading,
                    paginationProps,
                    handleTableChange,
                    rowSelection
                    }: ReviewTableProps) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentReview, setCurrentReview] =   useState<DataSourceType | null>(null);

    const handleView = (record: DataSourceType) => {
        setCurrentReview(record);
        setIsModalOpen(true);
    };

    const columns: TableProps<DataSourceType>['columns'] = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            width: 50
        },
        {
            title: 'Tài khoản',
            dataIndex: 'username',
            key: 'username',
            sorter: true
        },
        // {
        //     title: 'Bài đăng',
        //     dataIndex: 'title',
        //     key: 'title',
        //     sorter: true
        // },
        {
            title: 'Nội dung',
            dataIndex: 'comment',
            key: 'comment',
            sorter: true
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            sorter: true,
            render: (rating: number) => <Rate disabled defaultValue={rating} />
        },
        {
            title: 'Hành động',
            key: 'action',
            fixed: 'right',
            width: 110,
            render: (_, record: DataSourceType) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <EyeOutlined 
                        style={{ cursor: 'pointer', color: '#1890ff', fontSize: '18px' }} 
                        onClick={() => handleView(record)} 
                    />
                </div>
            )
        }
    ]

    return (
        <>
        <Table
            dataSource={dataSource}
            columns={columns}
            rowSelection={{ ...rowSelection }}
            pagination={{
            position: ['bottomCenter'],
            pageSizeOptions: ['5', '10', '20'],
            locale: { items_per_page: '/ trang' },
            showSizeChanger: true,
            ...paginationProps
            }}
            onChange={handleTableChange}
            loading={loading}
            locale={{
            triggerDesc: 'Sắp xếp giảm dần',
            triggerAsc: 'Sắp xếp tăng dần',
            cancelSort: 'Hủy sắp xếp'
            }}
        />

        <Modal
            title="Chi tiết đánh giá"
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            {currentReview && (
            <div>
                <p><strong>Tài khoản:</strong> {currentReview.username}</p>
                <p><strong>Bài đăng:</strong> {currentReview.title}</p>
                <p><strong>Đánh giá:</strong> <Rate disabled defaultValue={currentReview.rating} /></p>
                <p><strong>Nội dung:</strong> {currentReview.comment}</p>
            </div>
            )}
        </Modal>
        </>
    )
}

export default ReviewTable