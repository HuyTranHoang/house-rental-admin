import { Outlet, useNavigate } from 'react-router-dom'
import {
  BarChartOutlined,
  createFromIconfontCN,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  SolutionOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Button, ConfigProvider, Dropdown, Flex, Layout, Menu, MenuProps, Space, theme, Typography } from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import CustomBreadcrumbs from '../components/CustomBreadcrumbs.tsx'
import { useAppDispatch } from '../store.ts'
import { logout, selectAuth } from '@/features/auth/authSlice.ts'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { toTitleCase } from '@/utils/toTitleCase.ts'

const { Header, Content, Sider } = Layout

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4645396_ko0yqafz4er.js'
})


function AppLayout({ haveBgColor = true }: { haveBgColor?: boolean }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useSelector(selectAuth)


  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const siderItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: 'Tổng quan',
      icon: <BarChartOutlined />,
      onClick: () => navigate('/')
    },
    {
      key: 'cityDistrict',
      label: 'Thành phố và quận huyện',
      icon: <IconFont type='icon-city' />,
      children: [
        {
          key: 'cityDistrict-city',
          label: 'Quản lý thành phố',
          onClick: () => navigate('/city')
        },
        {
          key: 'cityDistrict-district',
          label: 'Quản lý quận huyện',
          onClick: () => navigate('/district')
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
          onClick: () => navigate('/roomType')
        },
        {
          key: 'roomTypeAmenity-amenity',
          label: 'Quản lý tiện nghi',
          onClick: () => navigate('/amenity')
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
          onClick: () => navigate('/report')
        },
        {
          key: 'reportReview-review',
          label: 'Quản lý đánh giá',
          onClick: () => navigate('/review')
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
          onClick: () => navigate('/user')
        },
        {
          key: 'userRole-role',
          label: 'Quản lý vai trò',
          onClick: () => navigate('/role')
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
        navigate('/')
        break
      case 'profile':
        navigate('/profile')
        break
      case 'logout':
        dispatch(logout())
        toast.success('Đăng xuất thành công')
        navigate('/login')
        break
    }
  }

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
        <Sider width={260} style={{ background: colorBgContainer }}>
          <Layout style={{ height: '100%', background: colorBgContainer }}>
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
                    icon={<Avatar src="https://i.pinimg.com/236x/c5/c2/78/c5c27866e134285971505f6984f031f2.jpg" />}
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
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>Mogu Admin ©2024 Created by Group 2</Footer>
    </Layout>
  )
}

export default AppLayout
