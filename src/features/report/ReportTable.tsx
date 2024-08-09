import {
  Badge,
  Button,
  ConfigProvider,
  Descriptions,
  DescriptionsProps,
  Modal,
  Space,
  Table,
  TablePaginationConfig,
  TableProps,
  Tag
} from 'antd'
import React, { useState } from 'react'
import { Report as ReportType, ReportCategory, ReportStatus } from '../../models/report.type.ts'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useUpdateReportStatus } from './useReports.ts'
import { useQuery } from '@tanstack/react-query'
import { getPropertyById } from '../api/property.api.ts'
import { formatCurrency } from '../../utils/formatCurrentcy.ts'
import { customFormatDate } from '../../utils/customFormatDate.ts'

type DataSourceType = ReportType & {
  key: React.Key;
}

interface ReportTableProps {
  dataSource: DataSourceType[];
  loading: boolean;
  paginationProps: false | TablePaginationConfig | undefined;
  handleTableChange: TableProps<DataSourceType>['onChange'];
  status: ReportStatus
}

function ReportTable({
                       dataSource,
                       loading,
                       status,
                       paginationProps,
                       handleTableChange
                     }: ReportTableProps) {


  const [propertyId, setPropertyId] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const { updateReportStatusMutate, updateReportStatusPending } = useUpdateReportStatus()

  const { data: propertyData, isLoading: propertyIsLoading, isError: propertyIsError } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyById(propertyId),
    enabled: !!propertyId
  })


  const modalItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Loại phòng',
      children: propertyData?.roomTypeName
    },
    {
      key: '2',
      label: 'Thành phố',
      children: propertyData?.cityName
    },
    {
      key: '3',
      label: 'Quận huyện',
      children: propertyData?.districtName
    },
    {
      key: '4',
      label: 'Giá thuê',
      children: propertyData ? formatCurrency(propertyData.price) : ''
    },
    {
      key: '5',
      label: 'Địa chỉ',
      children: propertyData?.location,
      span: 2
    },
    {
      key: 'blocked',
      label: 'Blocked',
      children: (
        <Badge status={propertyData?.blocked ? 'error' : 'success'}
               text={propertyData?.blocked ? 'Khóa' : 'Hoạt động'} />
      ),
      span: 3
    },
    {
      key: '7',
      label: 'Diện tích',
      children: `${propertyData?.area} m²`
    },
    {
      key: '8',
      label: 'Số phòng ngủ',
      children: propertyData?.numRooms
    },
    {
      key: '9',
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
      key: '10',
      label: 'Tiện ích',
      span: 2,
      children: (
        <>
          {propertyData?.amenities.map((amenity, index) => (
            <Tag key={index} color="blue">
              {amenity}
            </Tag>
          ))}
        </>
      )
    },
    {
      key: '11',
      label: 'Mô tả',
      span: 3,
      children: propertyData?.description
    },
    {
      key: '12',
      label: 'Hình ảnh',
      children: 'Hình ảnh'
    }
  ]

  const columns: TableProps<DataSourceType>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 50
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'username',
      key: 'username',
      sorter: true
    },
    {
      title: 'Bài đăng',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (text, record) =>
        <Button onClick={() => {
          setOpen(!open)
          setPropertyId(record.propertyId)
        }} type="link">{text}</Button>
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
      filters: [
        { text: 'Lừa đảo', value: ReportCategory.SCAM },
        { text: 'Nội dung không phù hợp', value: ReportCategory.INAPPROPRIATE_CONTENT },
        { text: 'Trùng lặp', value: ReportCategory.DUPLICATE },
        { text: 'Thông tin sai lệch', value: ReportCategory.MISINFORMATION },
        { text: 'Khác', value: ReportCategory.OTHER }
      ],
      render: (category: ReportCategory) => {
        const categoryMap = {
          [ReportCategory.SCAM]: ['Lừa đảo', 'magenta'],
          [ReportCategory.INAPPROPRIATE_CONTENT]: ['Nội dung không phù hợp', 'red'],
          [ReportCategory.DUPLICATE]: ['Trùng lặp', 'volcano'],
          [ReportCategory.MISINFORMATION]: ['Thông tin sai lệch', 'orange'],
          [ReportCategory.OTHER]: ['Khác', 'gold']
        }
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
      fixed: 'right',
      width: 200
    }
  ]

  if (status === ReportStatus.PENDING) {
    columns.push({
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00b96b'
              }
            }}
          >
            <Button loading={updateReportStatusPending}
                    onClick={() => updateReportStatusMutate({ id: record.id, status: ReportStatus.APPROVED })}
                    icon={<CheckOutlined />}
                    type="primary">
              Duyệt
            </Button>
          </ConfigProvider>
          <Button loading={updateReportStatusPending}
                  onClick={() => updateReportStatusMutate({ id: record.id, status: ReportStatus.REJECTED })}
                  icon={<CloseOutlined />}
                  danger>
            Từ chối
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
        loading={loading}
        locale={{
          triggerDesc: 'Sắp xếp giảm dần',
          triggerAsc: 'Sắp xếp tăng dần',
          cancelSort: 'Hủy sắp xếp',
          filterReset: 'Bỏ lọc',
          filterConfirm: 'Lọc'
        }}
      />

      {
        propertyIsError && <Modal
          title="Error"
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={1000}
        >
          <p>Something went wrong</p>
        </Modal>
      }

      {
        propertyData && <Modal
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          loading={propertyIsLoading}
          width={1000}
        >
          <Descriptions title={propertyData.title} bordered items={modalItems} />
        </Modal>
      }
    </>
  )
}

export default ReportTable
