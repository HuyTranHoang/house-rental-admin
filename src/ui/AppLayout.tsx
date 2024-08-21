import { Outlet, useNavigate } from 'react-router-dom'
import {
  BarChartOutlined,
  createFromIconfontCN,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  SolutionOutlined,
  UserOutlined, VerticalAlignTopOutlined
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  FloatButton,
  Layout,
  Menu,
  MenuProps,
  Space,
  theme,
  Typography
} from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import CustomBreadcrumbs from '../components/CustomBreadcrumbs.tsx'
import { useAppDispatch } from '../store.ts'
import { logout, selectAuth } from '@/features/auth/authSlice.ts'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { toTitleCase } from '@/utils/toTitleCase.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { useEffect, useState } from 'react'

const { Header, Content, Sider } = Layout

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4645396_ko0yqafz4er.js'
})


function AppLayout({ haveBgColor = true }: { haveBgColor?: boolean }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useSelector(selectAuth)

  const [showScrollButton, setShowScrollButton] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG, colorBgLayout }
  } = theme.useToken()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const siderItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: <BarChartOutlined />,
      onClick: () => navigate(ROUTER_NAMES.DASHBOARD)
    },
    {
      key: 'cityDistrict',
      label: 'Thành phố và quận huyện',
      icon: <IconFont type="icon-city" />,
      children: [
        {
          key: 'cityDistrict-city',
          label: 'Quản lý thành phố',
          onClick: () => navigate(ROUTER_NAMES.CITY)
        },
        {
          key: 'cityDistrict-district',
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
          key: 'roomTypeAmenity-roomType',
          label: 'Quản lý lọai phòng',
          onClick: () => navigate(ROUTER_NAMES.ROOM_TYPE)
        },
        {
          key: 'roomTypeAmenity-amenity',
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
          key: 'reportReview-report',
          label: 'Quản lý báo cáo',
          onClick: () => navigate(ROUTER_NAMES.REPORT)
        },
        {
          key: 'reportReview-review',
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
          key: 'userRole-user',
          label: 'Quản lý người dùng',
          onClick: () => navigate(ROUTER_NAMES.USER)
        },
        {
          key: 'userRole-role',
          label: 'Quản lý vai trò',
          onClick: () => navigate(ROUTER_NAMES.ROLE)
        }
      ]
    }
  ]

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'username',
      label: <Flex vertical>
        <Typography.Text type="secondary">Tài khoản đăng nhập</Typography.Text>
        <Typography.Text strong>{user?.username}</Typography.Text>
      </Flex>,
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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Flex align="center">
          <img src="/logo1.png" alt="Mogu logo" style={{ width: 30 }} />
          <Typography.Title level={4} style={{ color: 'white', margin: '0 12px' }}>
            Trang quản trị
          </Typography.Title>
        </Flex>
      </Header>
      <Layout>
        <Sider width={260} style={{ background: colorBgLayout }}>
          <Layout style={{ height: 'calc(100vh - 100px)', background: colorBgContainer }}>
            <Flex justify="center" align="center" style={{ height: 50, background: colorBgContainer, margin: '8px 0' }}>
              <img src="/LOGO_TEXT.png" alt="Mogu logo" style={{ width: 100 }} />
            </Flex>
            <Space direction="vertical" align="center" size="large"
                   style={{ height: '100%', justifyContent: 'space-between' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                defaultOpenKeys={['cityDistrict']}
                style={{ borderRight: 0 }}
                items={siderItems}
              />
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
                <Dropdown menu={{ items: dropdownItems, onClick: dropdownOnClick }} placement="top"
                >
                  <Button
                    icon={<Avatar src={user?.avatarUrl || `https://robohash.org/${user?.username}?set=set4`} />}
                    size="large"
                    style={{
                      padding: '24px 0',
                      width: '200px',
                      marginBottom: 16
                    }}>
                    {toTitleCase(user?.firstName)} {toTitleCase(user?.lastName)}
                  </Button>
                </Dropdown>
              </ConfigProvider>
            </Space>
          </Layout>
        </Sider>
        <Layout style={{ padding: '0 24px' }}>
          <CustomBreadcrumbs />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 'calc(100vh - 185px)',
              // minHeight: 260,
              background: haveBgColor ? colorBgContainer : '#F5F5F5',
              borderRadius: borderRadiusLG
            }}
          >
            <Outlet />
            {showScrollButton && (
              <FloatButton icon={<VerticalAlignTopOutlined />} onClick={scrollToTop} />
            )}
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: 'center', padding: '10px 0' }}>Mogu Admin ©2024 Created by Group 2</Footer>
    </Layout>
  )
}

export default AppLayout
