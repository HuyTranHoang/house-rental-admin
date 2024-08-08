import { Outlet, useNavigate } from 'react-router-dom'
import {
  BarChartOutlined,
  createFromIconfontCN,
  HomeOutlined,
  NotificationOutlined,
  SolutionOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import { useSelector } from 'react-redux'
import { selectUi } from './uiSlice.ts'

const { Header, Content, Sider } = Layout

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`
}))


const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4645396_ko0yqafz4er.js'
})


function AppLayout() {

  const navigate = useNavigate()
  const { breadcrumb } = useSelector(selectUi)

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()


  const siderItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
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
          label: 'Quản lý quận huyện'
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
        { key: 'roomTypeAmenity-amenity', 
          label: 'Quản lý tiện nghi',
          onClick: () => navigate('/amenity')
        },
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
          label: 'Quản lý đánh giá'
        },
      ]
    },
    {
      key: 'sub3',
      label: 'subnav 3',
      icon: <NotificationOutlined />,
      children: [
        { key: '9', label: 'option9' },
        { key: '10', label: 'option10' },
        { key: '11', label: 'option11' },
        { key: '12', label: 'option12' }
      ]
    }
  ]

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Layout>
        <Sider width={260} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={siderItems}
          />
        </Sider>
        <Layout style={{ padding: '0 24px' }}>
          <Breadcrumb items={breadcrumb} style={{ margin: '16px 0' }} />
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
