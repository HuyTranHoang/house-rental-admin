import { Avatar, Badge, Button, Col, Modal, Row, Space, Tag, Typography } from 'antd'
import { UserDataSource } from '@/models/user.type.ts'
import { authorityPrivilegesMap } from '@/features/role/authorityPrivilegesMap.ts'
import { gray, green } from '@ant-design/colors'
import BlockUserButton from '@/components/BlockUserButton.tsx'
import { formatCurrency } from '@/utils/formatCurrentcy.ts'

interface UserDetailsModalProps {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  currentUser: UserDataSource | null
}

function UserDetailsModal({ isModalOpen, setIsModalOpen, currentUser }: UserDetailsModalProps) {
  const footer = (
    <>
      <Button key="close" onClick={() => setIsModalOpen(false)}>
        Đóng
      </Button>

      {currentUser && <BlockUserButton record={currentUser} hasText />}
    </>
  )

  return (
    <>
      {currentUser &&
        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={footer}>
          <Row gutter={24} style={{ marginBottom: '20px' }}>
            {/* Cột bên trái */}
            <Col span={8} style={{ textAlign: 'center' }}>
              <Avatar
                size={100}
                src={
                  currentUser.avatarUrl ||
                  `https://robohash.org/${currentUser.username}?set=set4`
                }
              />
              <p><b>{currentUser.username}</b></p>
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
                <b>Trạng thái:</b>{currentUser.nonLocked
                ? <Badge status="success" text="Hoạt động" />
                : <Badge status="error" text="Đã khóa" />
              }
              </Space>
            </Col>

            <Col span={24}>
              <div style={{ margin: '16px 0' }}>
                <Space wrap={true}>
                  <b>Số dư tài khoản:</b>
                  <Typography.Text style={{ color: green.primary }}>
                    {formatCurrency(currentUser.balance)}
                  </Typography.Text>
                </Space>
              </div>

              <div style={{ margin: '16px 0' }}>
                <Space wrap={true}>
                  <b>Vai trò:</b>
                  <Typography.Text style={{ color: gray.primary }}>
                    {currentUser.roles.join(', ')}
                  </Typography.Text>
                </Space>
              </div>

              <b>Quyền hạn:</b>
              <div style={{
                height: 80,
                marginTop: 8,
                overflowY: 'scroll',
                backgroundColor: '#fafafa',
                padding: 8,
                boxShadow: 'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset'
              }}>
                <Space wrap={true}>
                  {currentUser.authorities.map(authority => {
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
        </Modal>}
    </>
  )
}

export default UserDetailsModal
