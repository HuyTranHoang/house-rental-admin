import { Avatar, Button, ConfigProvider, Dropdown, Flex, Layout, Menu, MenuProps, Space, theme, Typography } from 'antd'
import { toTitleCase } from '@/utils/toTitleCase.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { toast } from 'sonner'
import { logout, selectAuth } from '@/features/auth/authSlice.ts'
import Sider from 'antd/es/layout/Sider'
import {
  BarChartOutlined,
  createFromIconfontCN,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  SolutionOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/store.ts'
import { useSelector } from 'react-redux'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4645396_ko0yqafz4er.js'
})

function AppSider() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { user } = useSelector(selectAuth)

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const siderItems: MenuProps['items'] = [
    {
      key: ROUTER_NAMES.DASHBOARD,
      label: 'Tổng quan',
      icon: <BarChartOutlined />,
      onClick: () => navigate(ROUTER_NAMES.DASHBOARD)
    },
    {
      key: 'cityDistrict',
      label: 'Thành phố và quận huyện',
      icon: <IconFont type='icon-city' />,
      children: [
        {
          key: ROUTER_NAMES.CITY,
          label: 'Quản lý thành phố',
          onClick: () => navigate(ROUTER_NAMES.CITY)
        },
        {
          key: ROUTER_NAMES.DISTRICT,
          label: 'Quản lý quận huyện',
          onClick: () => navigate(ROUTER_NAMES.DISTRICT)
        }
      ]
    },
    {
      key: 'roomTypeAmenity',
      label: 'Loại phòng và tiện nghi',
      icon: <HomeOutlined />,
      children: [
        {
          key: ROUTER_NAMES.ROOM_TYPE,
          label: 'Quản lý lọai phòng',
          onClick: () => navigate(ROUTER_NAMES.ROOM_TYPE)
        },
        {
          key: ROUTER_NAMES.AMENITY,
          label: 'Quản lý tiện nghi',
          onClick: () => navigate(ROUTER_NAMES.AMENITY)
        }
      ]
    },
    {
      key: 'reportReview',
      label: 'Báo cáo và đánh giá',
      icon: <SolutionOutlined />,
      children: [
        {
          key: ROUTER_NAMES.REPORT,
          label: 'Quản lý báo cáo',
          onClick: () => navigate(ROUTER_NAMES.REPORT)
        },
        {
          key: ROUTER_NAMES.REVIEW,
          label: 'Quản lý đánh giá',
          onClick: () => navigate(ROUTER_NAMES.REVIEW)
        }
      ]
    },
    {
      key: 'userRole',
      label: 'Người dùng và vai trò',
      icon: <UserOutlined />,
      children: [
        {
          key: ROUTER_NAMES.USER,
          label: 'Quản lý người dùng',
          onClick: () => navigate(ROUTER_NAMES.USER)
        },
        {
          key: ROUTER_NAMES.ROLE,
          label: 'Quản lý vai trò',
          onClick: () => navigate(ROUTER_NAMES.ROLE)
        }
      ]
    }
  ]

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'username',
      label: (
        <Flex vertical>
          <Typography.Text type='secondary'>Tài khoản đăng nhập</Typography.Text>
          <Typography.Text strong>{user?.username}</Typography.Text>
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
      label: 'Trang chủ',
      icon: <HomeOutlined />
    },
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <EditOutlined />
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
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
        toast.info('Chưa có làm uwu!!!')
        break
      case 'logout':
        dispatch(logout())
        localStorage.removeItem('jwtToken')
        toast.success('Đăng xuất thành công')
        navigate(ROUTER_NAMES.LOGIN)
        break
    }
  }

  return (
    <Sider width={260} style={{ background: colorBgContainer }}>
      <div style={{ position: 'relative' }}>
        <Layout
          className='container'
          style={{
            height: 'calc(100vh - 200px)',
            background: colorBgContainer,
            overflowY: 'scroll'
          }}
        >
          <Flex justify='center' align='center' style={{ height: 50, background: colorBgContainer, margin: '8px 0' }}>
            <img src='/LOGO_TEXT.png' alt='Mogu logo' style={{ width: 100 }} />
          </Flex>
          <Menu
            mode='inline'
            defaultSelectedKeys={[location.pathname]}
            defaultOpenKeys={['cityDistrict']}
            style={{ borderRight: 0 }}
            items={siderItems}
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
                  defaultBg: '#e0e0e0',
                  defaultHoverBg: '#d4d4d4',
                  defaultHoverBorderColor: '#d4d4d4',
                  defaultHoverColor: 'black'
                }
              }
            }}
          >
            <Dropdown menu={{ items: dropdownItems, onClick: dropdownOnClick }} placement='top'>
              <Button
                icon={<Avatar src={user?.avatarUrl || `https://robohash.org/${user?.username}?set=set4`} />}
                size='large'
                style={{
                  padding: '24px 0',
                  width: '200px',
                  marginBottom: 16
                }}
              >
                {toTitleCase(user?.firstName)} {toTitleCase(user?.lastName)}
              </Button>
            </Dropdown>
          </ConfigProvider>
        </Space>
      </div>
    </Sider>
  )
}

export default AppSider