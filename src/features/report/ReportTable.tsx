import { Button, ConfigProvider, Space, Table, TablePaginationConfig, TableProps, Tag } from 'antd'
import React from 'react'
import { Report as ReportType, ReportCategory, ReportStatus } from '../../models/report.type.ts'
import { Link } from 'react-router-dom'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useUpdateReportStatus } from './useReports.ts'

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


  const { updateReportStatusMutate, updateReportStatusPending } = useUpdateReportStatus()

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
      render: (text, record) => <Link to={`/property/${record.propertyId}`}>{text}</Link>
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
  )
}

export default ReportTable
