import BlockUserButton from '@/components/BlockUserButton.tsx'
import { authorityPrivilegesMap } from '@/features/role/authorityPrivilegesMap.ts'
import { UserDataSource } from '@/models/user.type.ts'
import { formatCurrency } from '@/utils/formatCurrentcy.ts'
import { green } from '@ant-design/colors'
import { Avatar, Badge, Button, Col, Modal, Row, Space, Tag, theme, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

interface UserDetailsModalProps {
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
  currentUser: UserDataSource | null
}

function UserDetailsModal({ isModalOpen, setIsModalOpen, currentUser }: UserDetailsModalProps) {
  const { t } = useTranslation(['common', 'user'])
  const {
    token: { colorBgLayout }
  } = theme.useToken()

  const footer = (
    <>
      <Button key='close' onClick={() => setIsModalOpen(false)}>
        {t('common.back')}
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
                <b>{t('user:table.fullName')}</b> {`${currentUser.firstName} ${currentUser.lastName}`}
              </Typography.Paragraph>

              <Typography.Paragraph>
                <b>{t('user:table.email')}</b> {currentUser.email}
              </Typography.Paragraph>

              <Typography.Paragraph>
                <b>{t('user:table.phoneNumber')}</b> {currentUser.phoneNumber}
              </Typography.Paragraph>

              <Typography.Paragraph>
                <b>{t('common.table.createdAt')}</b> {currentUser.createdAt}
              </Typography.Paragraph>

              <Space>
                <b>{t('user:table.status')}</b>
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
                  <b>{t('user:table.balance')}</b>
                  <Typography.Text style={{ color: green.primary }}>
                    {formatCurrency(currentUser.balance)}
                  </Typography.Text>
                </Space>
              </div>

              <div className='mx-0 my-4'>
                <Space wrap={true}>
                  <b>{t('user:table.roles')}</b>
                  <Typography.Text>{currentUser.roles.join(', ')}</Typography.Text>
                </Space>
              </div>

              <b>{t('user:table.authorities')}</b>
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
