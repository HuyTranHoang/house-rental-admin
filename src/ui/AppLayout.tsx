import { Outlet, useNavigate } from 'react-router-dom'
import {
  BarChartOutlined,
  createFromIconfontCN,
  HomeOutlined,
  LogoutOutlined,
  SolutionOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Flex, Layout, Menu, MenuProps, theme, Typography } from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import CustomBreadcrumbs from '../components/CustomBreadcrumbs.tsx'
import { useAppDispatch } from '../store.ts'
import { logout } from '../features/auth/authSlice.ts'
import { red } from '@ant-design/colors'

const { Header, Content, Sider } = Layout

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4645396_ko0yqafz4er.js'
})


function AppLayout() {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()


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
      icon: <IconFont type="icon-city" />,
      children: [
        {
          key: 'cityDistrict-city',
          label: 'Quản lý thành phố',
          onClick: () => navigate('/city')
        },
        {
          key: 'cityDistrict-district',
          label: 'Quản lý quận huyện',
          onClick: () => alert('Chưa làm')
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
          onClick: () => alert('Chưa làm')
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
          onClick: () => alert('Chưa làm')
        },
        {
          key: 'userRole-role',
          label: 'Quản lý vai trò',
          onClick: () => navigate('/role')
        }
      ]
    },
    {
      type: 'divider',
      style: { margin: '12px 0' }
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      className: 'menu-item-logout',
      style: { color: red[5] },
      onClick: () => dispatch(logout())
    }
  ]

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Flex align="center">
          <img src="/logo1.png" alt="Mogu logo" style={{ width: 30 }} />
          <Typography.Title level={4} style={{ color: 'white', margin: '0 12px' }}>Trang quản trị</Typography.Title>
        </Flex>
      </Header>
      <Layout>
        <Sider width={260} style={{ background: colorBgContainer }}>
          <Flex justify="center" align="center" style={{ height: 50, background: colorBgContainer, margin: '8px 0' }}>
            <img src="/LOGO_TEXT.png" alt="Mogu logo" style={{ width: 100 }} />
          </Flex>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={siderItems}
          />
        </Sider>
        <Layout style={{ padding: '0 24px' }}>
          <CustomBreadcrumbs />
          <Content
            style={{
              padding: 24,
              margin: 0,
              // minHeight: 'calc(100vh - 190px)',
              minHeight: 260,
              background: colorBgContainer,
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
