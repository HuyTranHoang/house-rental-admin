import { Table, TableProps, Modal, DescriptionsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import { useDeleteProperty } from '@/hooks/useProperties';
import ConfirmModalTitle from '@/components/ConfirmModalTitle';
import ConfirmModalContent from '@/components/ConfirmModalContent';
import TableActions from '@/components/TableActions';
import { PropertyDataSource } from '@/models/property.type';

const { confirm } = Modal;

interface PropertyTableProps {
  dataSource: PropertyDataSource[];
  loading: boolean;
  paginationProps: false | TableProps<PropertyDataSource>['pagination'];
  handleTableChange: TableProps<PropertyDataSource>['onChange'];
  rowSelection?: TableRowSelection<PropertyDataSource>;
}

function PropertyTable({
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  rowSelection
}: PropertyTableProps) {
  const navigate = useNavigate();
  const { mutate: deletePropertyMutate } = useDeleteProperty();

  const showDeleteConfirm = (record: PropertyDataSource) => {
    const items: DescriptionsProps['items'] = [
      { key: '1', label: 'ID', children: <span>{record.id}</span>, span: 3 },
      { key: '2', label: 'Tiêu đề', children: <span>{record.title}</span>, span: 3 },
      { key: '3', label: 'Mô tả', children: <span>{record.description}</span>, span: 3 },
      { key: '4', label: 'Vị trí', children: <span>{record.location}</span>, span: 3 },
      { key: '5', label: 'Số phòng', children: <span>{record.numRooms}</span>, span: 3 },
      { key: '6', label: 'Diện tích', children: <span>{record.area} m²</span>, span: 3 },
      { key: '7', label: 'Quận/Huyện', children: <span>{record.districtName}</span>, span: 3 },
      { key: '9', label: 'Giá', children: <span>{record.price} VND</span>, span: 3 },
      { key: '10', label: 'Ngày tạo', children: <span>{record.createdAt}</span>, span: 3 },
    ];

    confirm({
      icon: null,
      title: <ConfirmModalTitle title="Xác nhận xóa bài đăng" />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deletePropertyMutate(record.id);
      }
    });
  };

  const columns: TableProps<PropertyDataSource>['columns'] = [
    { title: '#', dataIndex: 'id', key: 'id', fixed: 'left', width: 50 },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', fixed : 'right', width : 100},
    { title: 'Vị trí', dataIndex: 'location', key: 'location' , fixed : 'right', width : 100 },
    { title: 'Số phòng', dataIndex: 'numRooms', key: 'numRooms' },
    { title: 'Diện tích', dataIndex: 'area', key: 'area',sorter: true, },
    { title: 'Quận/Huyện', dataIndex: 'districtName', key: 'districtName',sorter: true, },
    { title: 'Giá', dataIndex: 'price', key: 'price',sorter: true, },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      fixed: 'right',
      width: 150,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <TableActions
          onUpdate={() => navigate(`/property/${record.id}/edit`)}
          onDelete={() => showDeleteConfirm(record)}
        />
      ),
    }
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowSelection={rowSelection}
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
  );
}

export default PropertyTable;