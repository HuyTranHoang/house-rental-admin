import {
  Badge,
  Button,
  Col,
  ConfigProvider,
  Descriptions,
  DescriptionsProps,
  Image,
  Modal,
  Row,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag,
  Typography
} from 'antd'
import { useState } from 'react'
import { Report, ReportCategory, ReportDataSource, ReportStatus } from '@/models/report.type.ts'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { useUpdateReportStatus } from '@/hooks/useReports.ts'
import { useQuery } from '@tanstack/react-query'
import { getPropertyById } from '@/api/property.api.ts'
import { formatCurrency } from '@/utils/formatCurrentcy.ts'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { FilterValue } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import DOMPurify from 'dompurify'

interface ReportTableProps {
  dataSource: ReportDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<ReportDataSource>['onChange']
  status: ReportStatus
  filteredInfo: Record<string, FilterValue | null>
  sortedInfo: SorterResult<ReportDataSource>
}

const categoryMap = {
  [ReportCategory.SCAM]: ['Lừa đảo', 'magenta'],
  [ReportCategory.INAPPROPRIATE_CONTENT]: ['Nội dung không phù hợp', 'red'],
  [ReportCategory.DUPLICATE]: ['Trùng lặp', 'volcano'],
  [ReportCategory.MISINFORMATION]: ['Thông tin sai lệch', 'orange'],
  [ReportCategory.OTHER]: ['Khác', 'gold']
}

function ReportTable({
  dataSource,
  loading,
  status,
  paginationProps,
  handleTableChange,
  filteredInfo,
  sortedInfo
}: ReportTableProps) {
  const [propertyId, setPropertyId] = useState<number>(0)
  const [report, setReport] = useState<Report>({} as Report)
  const [open, setOpen] = useState(false)
  const { updateReportStatusMutate, updateReportStatusPending } = useUpdateReportStatus()

  const {
    data: propertyData,
    isLoading: propertyIsLoading,
    isError: propertyIsError
  } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyById(propertyId),
    enabled: !!propertyId
  })

  const ModalFooter = (
    <Space>
      {status === ReportStatus.PENDING && (
        <>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00b96b'
              }
            }}
          >
            <Button
              loading={updateReportStatusPending}
              onClick={() => {
                updateReportStatusMutate({ id: report.id, status: ReportStatus.APPROVED })
                setOpen(false)
              }}
              icon={<CheckOutlined />}
              type='primary'
            >
              Duyệt, khóa bài đăng
            </Button>
          </ConfigProvider>
          <Button
            loading={updateReportStatusPending}
            onClick={() => {
              updateReportStatusMutate({ id: report.id, status: ReportStatus.REJECTED })
              setOpen(false)
            }}
            icon={<CloseOutlined />}
            danger
          >
            Từ chối, giữ bài đăng
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
      children: propertyData?.roomTypeName
    },
    {
      key: 'city',
      label: 'Thành phố',
      children: propertyData?.cityName
    },
    {
      key: 'district',
      label: 'Quận huyện',
      children: propertyData?.districtName
    },
    {
      key: 'price',
      label: 'Giá thuê',
      children: propertyData ? formatCurrency(propertyData.price) : ''
    },
    {
      key: 'location',
      label: 'Địa chỉ',
      children: propertyData?.location,
      span: 2
    },
    {
      key: 'blocked',
      label: 'Blocked',
      children: (
        <Badge
          status={propertyData?.blocked ? 'error' : 'success'}
          text={propertyData?.blocked ? 'Khóa' : 'Hoạt động'}
        />
      ),
      span: 3
    },
    {
      key: 'area',
      label: 'Diện tích',
      children: `${propertyData?.area} m²`
    },
    {
      key: 'numRooms',
      label: 'Số phòng ngủ',
      children: propertyData?.numRooms
    },
    {
      key: 'createdAt',
      label: 'Thời gian đăng',
      children: customFormatDate(propertyData?.createdAt)
    },
    {
      key: 'username',
      label: 'Người đăng',
      span: 1,
      children: propertyData?.userName
    },
    {
      key: 'amenities',
      label: 'Tiện ích',
      span: 2,
      children: (
        <>
          {propertyData?.amenities.map((amenity, index) => (
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
            {propertyData?.title}
          </Typography.Title>
          <div dangerouslySetInnerHTML={{ __html: propertyData ? DOMPurify.sanitize(propertyData.description) : '' }} />
        </>
      )
    },
    {
      key: 'images',
      label: `Hình ảnh (${propertyData?.propertyImages.length})`,
      children: (
        <Row gutter={[8, 8]}>
          <Image.PreviewGroup>
            {propertyData?.propertyImages.map((image, index) => (
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

  const modalReportItems: DescriptionsProps['items'] = [
    {
      key: 'usernameReport',
      label: 'Tên tài khoản',
      children: report?.username
    },
    {
      key: 'category',
      label: 'Loại báo cáo',
      children: report.category,
      span: 2
    },
    {
      key: 'reason',
      label: 'Lý do',
      children: report?.reason,
      span: 3
    },
    {
      key: 'createdAt',
      label: 'Thời gian báo cáo',
      children: report?.createdAt
    }
  ]

  const columns: TableProps<ReportDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 50
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
      sortOrder: sortedInfo.field === 'username' ? sortedInfo.order : null
    },
    {
      title: 'Bài đăng',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      sortOrder: sortedInfo.field === 'title' ? sortedInfo.order : null,
      render: (text, record) => (
        <Button
          onClick={() => {
            setOpen(!open)
            setPropertyId(record.propertyId)
            setReport(record)
          }}
          type='link'
        >
          {text}
        </Button>
      )
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Loại báo cáo',
      dataIndex: 'category',
      key: 'category',
      sorter: true,
      sortOrder: sortedInfo.field === 'category' ? sortedInfo.order : null,
      filters: [
        { text: 'Lừa đảo', value: ReportCategory.SCAM },
        { text: 'Nội dung không phù hợp', value: ReportCategory.INAPPROPRIATE_CONTENT },
        { text: 'Trùng lặp', value: ReportCategory.DUPLICATE },
        { text: 'Thông tin sai lệch', value: ReportCategory.MISINFORMATION },
        { text: 'Khác', value: ReportCategory.OTHER }
      ],
      filteredValue: filteredInfo.category || null,
      render: (category: ReportCategory) => {
        const [text, color] = categoryMap[category]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ReportStatus) => {
        const statusMap = {
          [ReportStatus.PENDING]: ['Chờ duyệt', 'blue'],
          [ReportStatus.APPROVED]: ['Đã duyệt', 'green'],
          [ReportStatus.REJECTED]: ['Đã từ chối', 'red']
        }
        const [text, color] = statusMap[status]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      fixed: 'right',
      width: 200
    }
  ]

  if (status === ReportStatus.PENDING) {
    columns.push({
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type='primary'
            onClick={() => {
              setOpen(!open)
              setPropertyId(record.propertyId)
              setReport(record)
            }}
          >
            Xét duyệt
          </Button>
        </Space>
      )
    })
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
        loading={loading || updateReportStatusPending}
        locale={{
          triggerDesc: 'Sắp xếp giảm dần',
          triggerAsc: 'Sắp xếp tăng dần',
          cancelSort: 'Hủy sắp xếp',
          filterReset: 'Bỏ lọc',
          filterConfirm: 'Lọc'
        }}
      />

      {propertyIsError && (
        <Modal title='Error' open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)} width={1000}>
          <p>Something went wrong</p>
        </Modal>
      )}

      {propertyData && (
        <Modal
          open={open}
          footer={ModalFooter}
          onCancel={() => setOpen(false)}
          loading={propertyIsLoading}
          width={1000}
        >
          <Typography.Title level={4}>Chi tiết bài đăng</Typography.Title>

          <Descriptions bordered items={modalItems} />

          <Typography.Title level={4}>Nội dung báo cáo</Typography.Title>

          {report && <Descriptions bordered items={modalReportItems} />}
        </Modal>
      )}
    </>
  )
}

export default ReportTable
