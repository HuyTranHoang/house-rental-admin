import { Avatar, Badge, Col, Modal, Row, Space, Tag, Typography } from 'antd'
import { UserDataSource } from '@/models/user.type.ts'
import { authorityPrivilegesMap } from '@/features/role/authorityPrivilegesMap.ts'
import { gray } from '@ant-design/colors'

interface UserDetailsModalProps {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  currentUser: UserDataSource | null
}

function UserDetailsModal({ isModalOpen, setIsModalOpen, currentUser }: UserDetailsModalProps) {
  return (
    <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
      {currentUser && (
        <div>
          {/* Hàng đầu tiên */}
          <Row gutter={16} style={{ marginBottom: '20px' }}>
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
          </Row>

          {/* Hàng tiếp theo */}
          <Row>
            <Col span={24}>
              <div style={{ marginBottom: 16 }}>
                <Space wrap={true}>
                  <b>Vai trò:</b>
                  <Typography.Text style={{ color: gray.primary }}>
                    {currentUser.roles.join(', ')}
                  </Typography.Text>
                </Space>
              </div>

              <div>
                <Space wrap={true}>
                  <b>Quyền hạn:</b>
                  {currentUser.authorities.map(authority => {
                    const [displayName, color] = authorityPrivilegesMap[authority] || [authority, 'blue'];
                    return (
                      <Tag key={authority} color={color}>
                        {displayName}
                      </Tag>
                    );
                  })}
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Modal>
  )
}

export default UserDetailsModal
