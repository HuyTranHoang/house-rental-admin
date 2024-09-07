import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import { useBlockProperty, useDeleteProperty, useUpdatePropertyStatus } from '@/hooks/useProperties'
import { Property, PropertyDataSource, PropertyStatus } from '@/models/property.type'
import { formatCurrency } from '@/utils/formatCurrentcy'
import { blue } from '@ant-design/colors'
import { CheckOutlined, CloseOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Col,
  ConfigProvider,
  Descriptions,
  DescriptionsProps,
  Flex,
  Image,
  Modal,
  Row,
  Space,
  Switch,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import DOMPurify from 'dompurify'
import { useState } from 'react'

const { confirm } = Modal

interface PropertyTableProps {
  status: PropertyStatus
  dataSource: PropertyDataSource[]
  loading: boolean
  paginationProps: false | TableProps<PropertyDataSource>['pagination']
  handleTableChange: TableProps<PropertyDataSource>['onChange']
  sortedInfo: SorterResult<PropertyDataSource>
}

function PropertyTable({
  status,
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  sortedInfo
}: PropertyTableProps) {
  const [open, setOpen] = useState(false)
  const [currentProperty, setCurrentProperty] = useState<Property | undefined>(undefined)

  const { deleteProperty } = useDeleteProperty()
  const { updatePropertyStatus, updatePropertyStatusIsPending } = useUpdatePropertyStatus()
  const { blockProperty } = useBlockProperty()

  const showDeleteConfirm = (record: PropertyDataSource) => {
    const items: DescriptionsProps['items'] = [
      { key: 'title', label: 'Tiêu đề', children: <span>{record.title}</span>, span: 3 },
      { key: 'location', label: 'Vị trí', children: <span>{record.location}</span>, span: 3 },
      { key: 'price', label: 'Giá', children: <span>{record.price} VND</span>, span: 3 },
      { key: 'createdAt', label: 'Ngày tạo', children: <span>{record.createdAt}</span>, span: 3 }
    ]

    confirm({
      icon: null,
      title: <ConfirmModalTitle title='Xác nhận xóa bất bài đăng' />,
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

  const ModalFooter = (
    <Space>
      {status === PropertyStatus.PENDING && (
        <>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00b96b'
              }
            }}
          >
            <Button
              loading={updatePropertyStatusIsPending}
              onClick={() => {
                updatePropertyStatus({ id: currentProperty!.id, status: PropertyStatus.APPROVED })
                setOpen(false)
              }}
              icon={<CheckOutlined />}
              type='primary'
            >
              Duyệt, bài đăng hợp lệ
            </Button>
          </ConfigProvider>
          <Button
            loading={updatePropertyStatusIsPending}
            onClick={() => {
              updatePropertyStatus({ id: currentProperty!.id, status: PropertyStatus.REJECTED })
              setOpen(false)
            }}
            icon={<CloseOutlined />}
            danger
          >
            Từ chối, bài đăng không hợp lệ
          </Button>
        </>
      )}
      <Button onClick={() => setOpen(false)}>Quay lại</Button>
    </Space>
  )

  const modalItems: DescriptionsProps['items'] = [
    {
      key: 'roomType',
      label: 'Loại phòng',
      children: currentProperty?.roomTypeName
    },
    {
      key: 'city',
      label: 'Thành phố',
      children: currentProperty?.cityName
    },
    {
      key: 'district',
      label: 'Quận huyện',
      children: currentProperty?.districtName
    },
    {
      key: 'price',
      label: 'Giá thuê',
      children: currentProperty ? formatCurrency(currentProperty.price) : ''
    },
    {
      key: 'location',
      label: 'Địa chỉ',
      children: currentProperty?.location,
      span: 2
    },
    {
      key: 'blocked',
      label: 'Trạng thái',
      children: (
        <Badge
          status={currentProperty?.blocked ? 'error' : 'success'}
          text={currentProperty?.blocked ? 'Khóa' : 'Hoạt động'}
        />
      ),
      span: 3
    },
    {
      key: 'area',
      label: 'Diện tích',
      children: `${currentProperty?.area} m²`
    },
    {
      key: 'numRooms',
      label: 'Số phòng ngủ',
      children: currentProperty?.numRooms
    },
    {
      key: 'createdAt',
      label: 'Thời gian đăng',
      children: currentProperty?.createdAt
    },
    {
      key: 'username',
      label: 'Người đăng',
      span: 1,
      children: currentProperty?.userName
    },
    {
      key: 'amenities',
      label: 'Tiện ích',
      span: 2,
      children: (
        <>
          {currentProperty?.amenities.map((amenity, index) => (
            <Tag key={index} color='blue'>
              {amenity}
            </Tag>
          ))}
        </>
      )
    },
    {
      key: 'description',
      label: 'Mô tả',
      span: 3,
      children: (
        <>
          <Typography.Title level={5} style={{ margin: '0 0 12px' }}>
            {currentProperty?.title}
          </Typography.Title>
          <div
            dangerouslySetInnerHTML={{ __html: currentProperty ? DOMPurify.sanitize(currentProperty.description) : '' }}
          />
        </>
      )
    },
    {
      key: 'images',
      label: `Hình ảnh (${currentProperty?.propertyImages.length})`,
      children: (
        <Row gutter={[8, 8]}>
          <Image.PreviewGroup>
            {currentProperty?.propertyImages.map((image, index) => (
              <Col key={index} span={6}>
                <Image
                  preview={{
                    mask: (
                      <>
                        <EyeOutlined style={{ marginRight: 6 }} /> Chi tiết
                      </>
                    )
                  }}
                  src={image}
                  className='size-48 object-cover p-2'
                />
              </Col>
            ))}
          </Image.PreviewGroup>
        </Row>
      )
    }
  ]

  const columns: TableProps<PropertyDataSource>['columns'] = [
    { title: '#', dataIndex: 'index', key: 'index', fixed: 'left', width: 50 },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title'
    },
    { title: 'Vị trí', dataIndex: 'location', key: 'location' },
    {
      title: 'Diện tích',
      dataIndex: 'area',
      key: 'area',
      sorter: true,
      sortOrder: sortedInfo.field === 'area' ? sortedInfo.order : null,
      width: 120,
      render: (record) => `${record} m²`
    },
    { title: 'Loại phòng', dataIndex: 'roomTypeName', key: 'roomTypeName', width: 150 },
    {
      title: 'Thành phố',
      dataIndex: 'cityName',
      key: 'cityName',
      width: 150
    },
    { title: 'Quận/Huyện', dataIndex: 'districtName', key: 'districtName', width: 150 },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      sortOrder: sortedInfo.field === 'price' ? sortedInfo.order : null,
      width: 60,
      render: (record) => formatCurrency(record)
    },
    {
      title: 'Bị chặn',
      dataIndex: 'blocked',
      key: 'blocked',
      width: 130,
      render: (blocked, record) => (
        <Switch
          checkedChildren='Chặn'
          unCheckedChildren='Hoạt động'
          defaultChecked={blocked}
          onChange={(e) => {
            const status = e ? 'block' : 'unblock'
            blockProperty({ id: record.id, status })
          }}
        />
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      fixed: 'right',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      width: 150
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <Flex gap={16}>
          <Tooltip title='Xem và duyệt'>
            <Button
              icon={<EyeOutlined />}
              type='default'
              style={{ borderColor: blue.primary, color: blue.primary }}
              onClick={() => {
                setCurrentProperty(record)
                setOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip title='Xóa'>
            <Button icon={<DeleteOutlined />} type='default' onClick={() => showDeleteConfirm(record)} danger />
          </Tooltip>
        </Flex>
      )
    }
  ]

  if (status === PropertyStatus.PENDING || status === PropertyStatus.REJECTED) {
    columns.splice(8, 1)
  }

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
          cancelSort: 'Hủy sắp xếp',
          filterConfirm: 'Lọc',
          filterReset: 'Bỏ lọc'
        }}
      />

      {currentProperty && (
        <Modal open={open} footer={ModalFooter} onCancel={() => setOpen(false)} width={1000}>
          <Typography.Title level={4}>Chi tiết bài đăng</Typography.Title>

          <Descriptions bordered items={modalItems} />
        </Modal>
      )}
    </>
  )
}

export default PropertyTable
