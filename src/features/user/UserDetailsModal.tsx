import BlockUserButton from '@/components/BlockUserButton.tsx'
import { authorityPrivilegesMap } from '@/features/role/authorityPrivilegesMap.ts'
import { UserDataSource } from '@/models/user.type.ts'
import { formatCurrency } from '@/utils/formatCurrentcy.ts'
import { green } from '@ant-design/colors'
import { Avatar, Badge, Button, Col, Modal, Row, Space, Tag, theme, Typography } from 'antd'

interface UserDetailsModalProps {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  currentUser: UserDataSource | null
}

function UserDetailsModal({ isModalOpen, setIsModalOpen, currentUser }: UserDetailsModalProps) {
  const {
    token: { colorBgLayout }
  } = theme.useToken()

  const footer = (
    <>
      <Button key='close' onClick={() => setIsModalOpen(false)}>
        Đóng
      </Button>

      {currentUser && <BlockUserButton record={currentUser} hasText />}
    </>
  )

  return (
    <>
      {currentUser && (
        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={footer}>
          <Row gutter={24} className='mb-5'>
            {/* Cột bên trái */}
            <Col span={8} className='text-center'>
              <Avatar
                size={100}
                src={currentUser.avatarUrl || `https://robohash.org/${currentUser.username}?set=set4`}
              />
              <p>
                <b>{currentUser.username}</b>
              </p>
            </Col>

            {/* Cột bên phải */}
            <Col span={16}>
              <Typography.Paragraph>
                <b>Họ và Tên:</b> {`${currentUser.firstName} ${currentUser.lastName}`}
              </Typography.Paragraph>

              <Typography.Paragraph>
                <b>Email:</b> {currentUser.email}
              </Typography.Paragraph>

              <Typography.Paragraph>
                <b>Số điện thoại:</b> {currentUser.phoneNumber}
              </Typography.Paragraph>

              <Typography.Paragraph>
                <b>Ngày tạo:</b> {currentUser.createdAt}
              </Typography.Paragraph>

              <Space>
                <b>Trạng thái:</b>
                {currentUser.nonLocked ? (
                  <Badge status='success' text='Hoạt động' />
                ) : (
                  <Badge status='error' text='Đã khóa' />
                )}
              </Space>
            </Col>

            <Col span={24}>
              <div className='mx-0 my-4'>
                <Space wrap={true}>
                  <b>Số dư tài khoản:</b>
                  <Typography.Text style={{ color: green.primary }}>
                    {formatCurrency(currentUser.balance)}
                  </Typography.Text>
                </Space>
              </div>

              <div className='mx-0 my-4'>
                <Space wrap={true}>
                  <b>Vai trò:</b>
                  <Typography.Text>{currentUser.roles.join(', ')}</Typography.Text>
                </Space>
              </div>

              <b>Quyền hạn:</b>
              <div
                className='mt-2 h-20 overflow-y-scroll p-2'
                style={{
                  backgroundColor: colorBgLayout
                }}
              >
                <Space wrap={true}>
                  {currentUser.authorities.map((authority) => {
                    const [displayName, color] = authorityPrivilegesMap[authority] || [authority, 'blue']
                    return (
                      <Tag key={authority} color={color}>
                        {displayName}
                      </Tag>
                    )
                  })}
                </Space>
              </div>
            </Col>
          </Row>
        </Modal>
      )}
    </>
  )
}

export default UserDetailsModal
