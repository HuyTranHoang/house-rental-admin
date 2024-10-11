import axiosInstance from '@/axiosInstance.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import useBoundStore from '@/store.ts'
import { User } from '@/types/user.type'
import filterMenuItems from '@/utils/filterMenuItem.ts'
import { toTitleCase } from '@/utils/toTitleCase.ts'
import {
  AuditOutlined,
  BarChartOutlined,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  PictureOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  TransactionOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Avatar, Button, ConfigProvider, Dropdown, Flex, Form, Input, Layout, Menu, MenuProps, Modal, Space, theme, Typography } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Building2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function AppSider({ darkMode }: { darkMode: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('breadcrumbs')
  const currentUser = useBoundStore((state) => state.user)
  const logout = useBoundStore((state) => state.logout)
  const [form] = Form.useForm()

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const { mutate: updatePasswordMutate, isPending } = useMutation({
    mutationFn: async (values) => await axiosInstance.put<User>('/api/user/change-password', values),
    onSuccess: (response) => {
      if (response && response.status === 200) {
        toast.success('Thay đổi mật khẩu thành công')
        form.resetFields()
      } else {
        toast.error('Mật khẩu hiện tại không chính xác, vui lòng thử lại.')
      }
    }
  })

  const siderItems: MenuProps['items'] = [
    {
      key: ROUTER_NAMES.DASHBOARD,
      label: t('dashboard'),
      icon: <BarChartOutlined />,
      onClick: () => navigate(ROUTER_NAMES.DASHBOARD)
    },
    {
      key: ROUTER_NAMES.TRANSACTION,
      label: t('transaction'),
      icon: <TransactionOutlined />,
      onClick: () => navigate(ROUTER_NAMES.TRANSACTION)
    },
    {
      key: ROUTER_NAMES.MEMBER_SHIP,
      label: t('memberShip.list'),
      icon: <AuditOutlined />,
      onClick: () => navigate(ROUTER_NAMES.MEMBER_SHIP)
    },
    {
      key: 'property',
      label: t('propertyManagement'),
      icon: <ScheduleOutlined />,
      children: [
        {
          key: ROUTER_NAMES.PROPERTY,
          label: t('property.list'),
          onClick: () => navigate(ROUTER_NAMES.PROPERTY)
        },
        {
          key: ROUTER_NAMES.REPORT,
          label: t('report.list'),
          onClick: () => navigate(ROUTER_NAMES.REPORT)
        }
      ]
    },
    {
      key: 'cityDistrict',
      label: t('cityAndDistrict'),
      icon: <Building2 size={16} />,
      children: [
        {
          key: ROUTER_NAMES.CITY,
          label: t('city.list'),
          onClick: () => navigate(ROUTER_NAMES.CITY)
        },
        {
          key: ROUTER_NAMES.DISTRICT,
          label: t('district.list'),
          onClick: () => navigate(ROUTER_NAMES.DISTRICT)
        }
      ]
    },
    {
      key: 'roomTypeAmenity',
      label: t('roomTypeAndAmenity'),
      icon: <HomeOutlined />,
      children: [
        {
          key: ROUTER_NAMES.ROOM_TYPE,
          label: t('roomType.list'),
          onClick: () => navigate(ROUTER_NAMES.ROOM_TYPE)
        },
        {
          key: ROUTER_NAMES.AMENITY,
          label: t('amenity.list'),
          onClick: () => navigate(ROUTER_NAMES.AMENITY)
        }
      ]
    },
    {
      key: 'reportReview',
      label: t('commentManagement'),
      icon: <SolutionOutlined />,
      children: [
        {
          key: ROUTER_NAMES.COMMENT,
          label: t('comment.list'),
          onClick: () => navigate(ROUTER_NAMES.COMMENT)
        },
        {
          key: ROUTER_NAMES.COMMENT_REPORT,
          label: t('commentReport.list'),
          onClick: () => navigate(ROUTER_NAMES.COMMENT_REPORT)
        }
      ]
    },
    {
      key: 'userRole',
      label: t('userAndRole'),
      icon: <UserOutlined />,
      children: [
        {
          key: ROUTER_NAMES.USER,
          label: t('user.list'),
          onClick: () => navigate(ROUTER_NAMES.USER)
        },
        {
          key: ROUTER_NAMES.ROLE,
          label: t('role.list'),
          onClick: () => navigate(ROUTER_NAMES.ROLE)
        }
      ]
    },
    {
      key: 'advertisement',
      label: t('advertisementManagement'),
      icon: <PictureOutlined />,
      children: [
        {
          key: ROUTER_NAMES.ADVERTISEMENT,
          label: t('advertisement.picture'),
          onClick: () => navigate(ROUTER_NAMES.ADVERTISEMENT)
        }
      ]
    }
  ]

  const filteredSiderItems = filterMenuItems(siderItems, currentUser)

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'username',
      label: (
        <Flex vertical>
          <Typography.Text type='secondary'>{t('currentLoginAccount')}</Typography.Text>
          <Typography.Text strong>{currentUser?.username}</Typography.Text>
        </Flex>
      ),
      disabled: true,
      style: { padding: '8px 16px', cursor: 'default' }
    },
    {
      type: 'divider'
    },
    {
      key: 'home',
      label: t('home'),
      icon: <HomeOutlined />
    },
    {
      key: 'profile',
      label: t('profile'),
      icon: <EditOutlined />
    },
    {
      key: 'logout',
      label: t('logout'),
      icon: <LogoutOutlined />,
      danger: true
    }
  ]

  const dropdownOnClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'home':
        navigate(ROUTER_NAMES.DASHBOARD)
        break
      case 'profile':
        setIsChangePasswordOpen(true)
        break
      case 'logout':
        logout()
        navigate(ROUTER_NAMES.LOGIN)
        localStorage.removeItem('jwtToken')
        axiosInstance.post('/api/auth/logout', {}, { withCredentials: true }).then(() => {
          toast.success('Đăng xuất thành công')
        })
        break
    }
  }

  return (
    <>
    <Sider
      width={260}
      style={{
        background: colorBgContainer,
        height: '100vh',
        position: 'fixed'
      }}
      className='shadow'
    >
      <div style={{ position: 'relative' }}>
        <Layout
          className='container'
          style={{
            height: 'calc(100vh - 120px)',
            background: colorBgContainer,
            overflowY: 'scroll'
          }}
        >
          <Flex justify='center' align='center' style={{ height: 50, background: colorBgContainer, margin: '8px 0' }}>
            <img src={darkMode ? '/LOGO_TEXT_DARK.png' : '/LOGO_TEXT.png'} alt='Mogu logo' style={{ width: 100 }} />
          </Flex>
          <Menu
            mode='inline'
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={['cityDistrict']}
            style={{ borderRight: 0 }}
            items={filteredSiderItems}
          />
        </Layout>
        <Space
          direction='vertical'
          align='center'
          size='large'
          style={{ position: 'absolute', bottom: -75, width: '100%' }}
        >
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultBg: darkMode ? '#333' : '#e0e0e0',
                  defaultHoverBg: darkMode ? '#444' : '#d4d4d4',
                  defaultHoverBorderColor: darkMode ? '#444' : '#d4d4d4',
                  defaultHoverColor: darkMode ? 'white' : 'black'
                }
              }
            }}
          >
            <Dropdown menu={{ items: dropdownItems, onClick: dropdownOnClick }} placement='top'>
              <Button
                icon={
                  <Avatar src={currentUser?.avatarUrl || `https://robohash.org/${currentUser?.username}?set=set4`} />
                }
                size='large'
                style={{
                  padding: '24px 0',
                  width: '200px',
                  marginBottom: 16
                }}
              >
                {toTitleCase(currentUser?.firstName)} {toTitleCase(currentUser?.lastName)}
              </Button>
            </Dropdown>
          </ConfigProvider>
        </Space>
      </div>
    </Sider>

    <Modal title="Change password"
    open={isChangePasswordOpen}
    onCancel={() => setIsChangePasswordOpen(false)}
    footer={null}>
    
      <Form form={form} layout='vertical' onFinish={(values) => updatePasswordMutate(values)}>
      <Form.Item
          label='Mật khẩu hiện tại'
          name='oldPassword'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu'
            },
            {
              pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
              message: 'Mật khẩu gồm 8 ký tự bao gồm chữ và số'
            }
          ]}
        >
          <Input.Password placeholder='Mật khẩu hiện tại' />
        </Form.Item>

        <Form.Item
          label='Mật khẩu mới'
          name='newPassword'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu'
            },
            {
              pattern: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
              message: 'Mật khẩu gồm 8 ký tự bao gồm chữ và số'
            }
          ]}
        >
          <Input.Password placeholder='Mật khẩu mới' />
        </Form.Item>

        <Form.Item
          label='Nhập lại mật khẩu mới'
          name='confirmPassword'
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập lại mật khẩu mới'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu không trùng khớp'))
              }
            })
          ]}
        >
          <Input.Password placeholder={'Nhập lại mật khẩu mới'} />
        </Form.Item>

        <Form.Item>
          <Space>
          <Button 
          loading={isPending}
          onClick={() => {
            form.resetFields()
            setIsChangePasswordOpen(false)
          }}>Quay lại</Button>

          <Button loading={isPending} htmlType='submit' type='primary'>Cập nhật</Button>
          </Space>
        </Form.Item>
      </Form>

    </Modal>
    </>
  )
}

export default AppSider
