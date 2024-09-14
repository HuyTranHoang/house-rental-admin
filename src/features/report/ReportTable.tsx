import { getPropertyById } from '@/api/property.api.ts'
import { useUpdateReportStatus } from '@/hooks/useReports.ts'
import { Report, ReportCategory, ReportDataSource, ReportStatus } from '@/models/report.type.ts'
import { customFormatDate } from '@/utils/customFormatDate.ts'
import { formatCurrency } from '@/utils/formatCurrentcy.ts'
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
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
import { FilterValue } from 'antd/es/table/interface'
import { SorterResult } from 'antd/lib/table/interface'
import DOMPurify from 'dompurify'
import { t } from 'i18next'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  [ReportCategory.SCAM]: [t('report:type.scam'), 'magenta'],
  [ReportCategory.INAPPROPRIATE_CONTENT]: [t('report:type.inappropriateContent'), 'red'],
  [ReportCategory.DUPLICATE]: [t('report:type.duplicate'), 'volcano'],
  [ReportCategory.MISINFORMATION]: [t('report:type.misinformation'), 'orange'],
  [ReportCategory.OTHER]: [t('report:type.other'), 'gold']
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
  const { t } = useTranslation(['common', 'report'])

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
             {t('report:button.approve')}
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
            {t('report:button.reject')}
          </Button>
        </>
      )}
      {status === ReportStatus.APPROVED && (
        <>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00b96b'
              }
            }}
          >
            <Button
              ///Gọi function update blocked của property ở chỗ này
              loading={updateReportStatusPending}
              onClick={() => {
                updateReportStatusMutate({ id: report.id, status: ReportStatus.APPROVED })
                setOpen(false)
              }}
              icon={<CheckOutlined />}
              type='primary'
            >
             {t('report:button.active')}
            </Button>
          </ConfigProvider>
        </>
      )}
      <Button onClick={() => setOpen(false)}>{t('common.back')}</Button>
    </Space>
  )

  const modalItems: DescriptionsProps['items'] = [
    {
      key: 'roomType',
      label: t('report:detailModal.roomType'),
      children: propertyData?.roomTypeName
    },
    {
      key: 'city',
      label: t('report:detailModal.city'),
      children: propertyData?.cityName
    },
    {
      key: 'district',
      label: t('report:detailModal.district'),
      children: propertyData?.districtName
    },
    {
      key: 'price',
      label: t('report:detailModal.price'),
      children: propertyData ? formatCurrency(propertyData.price) : ''
    },
    {
      key: 'location',
      label: t('report:detailModal.location'),
      children: propertyData?.location,
      span: 2
    },
    {
      key: 'blocked',
      label: t('report:table.status'),
      children: (
        <Badge
          status={propertyData?.blocked ? 'error' : 'success'}
          text={propertyData?.blocked ? t('report:status.blocked') : t('report:status.reviewed')}
        />
      ),
      span: 3
    },
    {
      key: 'area',
      label: t('report:detailModal.area'),
      children: `${propertyData?.area} m²`
    },
    {
      key: 'numRooms',
      label: t('report:detailModal.numRooms'),
      children: propertyData?.numRooms
    },
    {
      key: 'createdAt',
      label: t('report:detailModal.createdAt'),
      children: customFormatDate(propertyData?.createdAt)
    },
    {
      key: 'username',
      label: t('report:detailModal.username'),
      span: 1,
      children: propertyData?.userName
    },
    {
      key: 'amenities',
      label: t('report:detailModal.amenities'),
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
      label: t('report:detailModal.description'),
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
      label: `${t('report:detailModal.image')} (${propertyData?.propertyImages.length})`,
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
      label: t('report:table.username'),
      children: report?.username,
    },
    {
      key: 'category',
      label: t('report:table.type'),
      children: report.category,
      span: 2
    },
    {
      key: 'reason',
      label: t('report:table.reason'),
      children: report?.reason,
      span: 3
    },
    {
      key: 'createdAt',
      label: t('report:detailModal.createdAt'),
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
      title: t('report:table.username'),
      dataIndex: 'username',
      key: 'username',
      width: 150,
      sorter: true,
      sortOrder: sortedInfo.field === 'username' ? sortedInfo.order : null
    },
    {
      title: t('report:table.property'),
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
          className="block w-72 overflow-hidden overflow-ellipsis whitespace-nowrap"
        >
          {text}
        </Button>
      )
    },
    {
      title: t('report:table.type'),
      dataIndex: 'category',
      key: 'category',
      sorter: true,
      width: 150,
      sortOrder: sortedInfo.field === 'category' ? sortedInfo.order : null,
      filters: [
        { text: t('report:type.scam'), value: ReportCategory.SCAM },
        { text: t('report:type.inappropriateContent'), value: ReportCategory.INAPPROPRIATE_CONTENT },
        { text: t('report:type.duplicate'), value: ReportCategory.DUPLICATE },
        { text: t('report:type.misinformation'), value: ReportCategory.MISINFORMATION },
        { text: t('report:type.other'), value: ReportCategory.OTHER }
      ],
      filteredValue: filteredInfo.category || null,
      render: (category: ReportCategory) => {
        const [text, color] = categoryMap[category]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: t('report:table.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: ReportStatus) => {
        const statusMap = {
          [ReportStatus.PENDING]: [t('report:status.pending'), 'blue'],
          [ReportStatus.APPROVED]: [t('report:status.approved'), 'green'],
          [ReportStatus.REJECTED]: [t('report:status.rejected'), 'red']
        }
        const [text, color] = statusMap[status]
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: t('report:table.createdAt'),
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
      title: t('report:table.action'),
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
            {t('report:button.review')}
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
          locale: { items_per_page: `${t('common:common.pagination.itemsPerPage')}` },
          showSizeChanger: true,
          ...paginationProps
        }}
        onChange={handleTableChange}
        loading={loading || updateReportStatusPending}
        locale={{
          triggerDesc: t('common.table.triggerDesc'),
          triggerAsc: t('common.table.triggerAsc'),
          cancelSort: t('common.table.cancelSort'),
          filterReset: t('common.table.filterReset'),
          filterConfirm: t('common.table.filterConfirm')
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

          <Typography.Title level={4}>{t('report:detailModal.content')}</Typography.Title>

          {report && <Descriptions bordered items={modalReportItems} />}
        </Modal>
      )}
    </>
  )
}

export default ReportTable
