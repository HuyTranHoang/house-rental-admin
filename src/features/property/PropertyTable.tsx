import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import { useDeleteProperty } from '@/hooks/useProperties'
import { PropertyDataSource } from '@/models/property.type'
import { formatCurrency } from '@/utils/formatCurrentcy'
import { blue } from '@ant-design/colors'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, DescriptionsProps, Flex, Modal, Space, Table, TableProps, Tooltip } from 'antd'

const { confirm } = Modal

interface PropertyTableProps {
  dataSource: PropertyDataSource[]
  loading: boolean
  paginationProps: false | TableProps<PropertyDataSource>['pagination']
  handleTableChange: TableProps<PropertyDataSource>['onChange']
}

function PropertyTable({ dataSource, loading, paginationProps, handleTableChange }: PropertyTableProps) {
  const { deleteProperty } = useDeleteProperty()

  const showDeleteConfirm = (record: PropertyDataSource) => {
    const items: DescriptionsProps['items'] = [
      { key: 'title', label: 'Tiêu đề', children: <span>{record.title}</span>, span: 3 },
      { key: 'location', label: 'Vị trí', children: <span>{record.location}</span>, span: 3 },
      { key: 'price', label: 'Giá', children: <span>{record.price} VND</span>, span: 3 },
      { key: 'createdAt', label: 'Ngày tạo', children: <span>{record.createdAt}</span>, span: 3 }
    ]

    confirm({
      icon: null,
      title: <ConfirmModalTitle title='Xác nhận xóa bất động sản' />,
      content: <ConfirmModalContent items={items} />,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deleteProperty(record.id)
      }
    })
  }

  // const handleUpdateStatus = (id: number) => {
  //   setCurrentPropertyId(id)
  //   setUpdateStatusVisible(true)
  // }

  // const handleOk = () => {
  //   form
  //     .validateFields()
  //     .then((values) => {
  //       if (currentPropertyId) {
  //         updatePropertyStatusMutate({ id: currentPropertyId, status: values.status })
  //         setUpdateStatusVisible(false)
  //         form.resetFields()
  //       }
  //     })
  //     .catch((info) => {
  //       console.log('Validate Failed:', info)
  //     })
  // }

  // const handleCancel = () => {
  //   setUpdateStatusVisible(false)
  //   form.resetFields()
  // }

  const columns: TableProps<PropertyDataSource>['columns'] = [
    { title: '#', dataIndex: 'id', key: 'id', fixed: 'left', width: 50 },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    { title: 'Số phòng', dataIndex: 'numRooms', key: 'numRooms', width: 100 },
    {
      title: 'Diện tích',
      dataIndex: 'area',
      key: 'area',
      sorter: true,
      width: 120,
      render: (record) => `${record} m²`
    },
    { title: 'Quận/Huyện', dataIndex: 'districtName', key: 'districtName', sorter: true, width: 150 },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      width: 60,
      render: (record) => formatCurrency(record)
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      fixed: 'right',
      sorter: true,
      width: 150
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <Flex gap={16}>
          <Tooltip title='Chỉnh sửa'>
            <Button icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title='Xem chi tiết'>
            <Button
              icon={<EyeOutlined />}
              type='default'
              style={{ borderColor: blue.primary, color: blue.primary }}
              onClick={() => console.log('View detail')}
            />
          </Tooltip>
          <Tooltip title='Xóa'>
            <Button icon={<DeleteOutlined />} type='default' onClick={() => showDeleteConfirm(record)} danger />
          </Tooltip>
        </Flex>
      )
    }
  ]

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
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
        title='Cập nhật trạng thái'
        // onOk={handleOk}
        // onCancel={handleCancel}
        okText='Cập nhật'
        cancelText='Hủy'
      >
        place holder
      </Modal>
    </>
  )
}

export default PropertyTable
