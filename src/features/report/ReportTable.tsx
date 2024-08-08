import { Button, Space, Table, TablePaginationConfig, TableProps, Tag } from 'antd'
import React from 'react'
import { Report as ReportType, ReportStatus } from '../../models/report.type.ts'
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ReportStatus) => {
        if (status === ReportStatus.PENDING) {
          return <Tag color="blue">Chờ duyệt</Tag>
        } else if (status === ReportStatus.APPROVED) {
          return <Tag color="green">Đã duyệt</Tag>
        }

        return <Tag color="red">Đã từ chối</Tag>
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
          <Button loading={updateReportStatusPending}
                  onClick={() => updateReportStatusMutate({ id: record.id, status: ReportStatus.APPROVED })}
                  icon={<CheckOutlined />}
                  type="primary">
            Duyệt
          </Button>
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
        cancelSort: 'Hủy sắp xếp'
      }}
    />
  )
}

export default ReportTable
