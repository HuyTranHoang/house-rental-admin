import { UserDataSource } from '@/models/user.type'
import { CloseCircleOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Modal, Table, TablePaginationConfig, TableProps } from 'antd'
import { useState } from 'react'

const { confirm } = Modal

interface UserTableProps {
  dataSource: UserDataSource[]
  loading: boolean
  paginationProps: false | TablePaginationConfig | undefined
  handleTableChange: TableProps<UserDataSource>['onChange']
  isNonLocked: boolean
}

function UserTable({ dataSource, loading, paginationProps, handleTableChange }: UserTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState<UserDataSource | null>(null)

  const handleView = (record: UserDataSource) => {
    setCurrentReview(record)
    setIsModalOpen(true)
  }

  const handleBlockUser = (record: UserDataSource) => {
    confirm({
      title: 'Bạn có chắc chắn muốn khóa tài khoản này?',
      onOk() {
        console.log('Khóa người dùng', record.id)
      }
    })
  }

  const columns: TableProps<UserDataSource>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'id',
      fixed: 'left',
      width: 50
    },
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true
    },
    {
      title: 'Hành động',
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record: UserDataSource) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Button
            icon={<EyeOutlined />}
            type='default'
            style={{ borderColor: '#1890ff', color: '#1890ff', marginRight: '1rem' }}
            onClick={() => handleView(record)}
          />
          <Button icon={<CloseCircleOutlined />} type='default' onClick={() => handleBlockUser(record)} danger>
            Khoá
          </Button>
        </div>
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

      <Modal title='Chi tiết tài khoản' open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        {currentReview && (
          <>
            <p>
              <b>Tài khoản:</b> {currentReview.username}
            </p>
            <p>
              <b>Email:</b> {currentReview.email}
            </p>
            <p>
              <b>Vai trò:</b> {currentReview.roles}
            </p>
            <p>
              <b>Ngày tạo:</b> {currentReview.createdAt}
            </p>
          </>
        )}
      </Modal>
    </>
  )
}

export default UserTable
