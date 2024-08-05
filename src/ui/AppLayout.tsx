import { Outlet, useNavigate } from 'react-router-dom'
import { LaptopOutlined, NotificationOutlined, TruckOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Breadcrumb, Layout, Menu, theme } from 'antd'

const { Header, Content, Sider } = Layout

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`
}))

function AppLayout() {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const navigate = useNavigate()

  const siderItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <LaptopOutlined />,
      onClick: () => navigate('/')
    },
    {
      key: 'cityDistrict',
      label: 'Thành phố và quận huyện',
      icon: <TruckOutlined />,
      children: [
        {
          key: 'cityDistrict-city',
          label: 'Danh sách thành phố',
          icon: <TruckOutlined />,
          onClick: () => navigate('/city')
        },
        { key: 'cityDistrict-district', label: 'Danh sách quận huyện' },
      ]
    },
    {
      key: 'sub1',
      label: 'subnav 1',
      icon: <UserOutlined />,
      children: [
        { key: '1', label: 'option1' },
        { key: '2', label: 'option2' },
        { key: '3', label: 'option3' },
        { key: '4', label: 'option4' }
      ]
    },
    {
      key: 'sub2',
      label: 'subnav 2',
      icon: <LaptopOutlined />,
      children: [
        { key: '5', label: 'option5' },
        { key: '6', label: 'option6' },
        { key: '7', label: 'option7' },
        { key: '8', label: 'option8' }
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
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              // minHeight: 'calc(100vh - 150px)',
              minHeight: 260,
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AppLayout
