import { Outlet } from 'react-router-dom'
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { Flex, FloatButton, Layout, theme, Typography } from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import CustomBreadcrumbs from '../components/CustomBreadcrumbs.tsx'
import { useEffect, useState } from 'react'
import AppSider from '@/ui/AppSider.tsx'

const { Header, Content } = Layout

function AppLayout({ haveBgColor = true }: { haveBgColor?: boolean }) {
  const [showScrollButton, setShowScrollButton] = useState(false)

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Flex align='center'>
          <img src='/favicon.webp' alt='Mogu logo' style={{ width: 30 }} />
          <Typography.Title level={4} style={{ color: 'white', margin: '0 12px' }}>
            Trang quản trị
          </Typography.Title>
        </Flex>
      </Header>
      <Layout>
        <AppSider />

        <Layout style={{ padding: '0 24px' }}>
          <CustomBreadcrumbs />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 'calc(100vh - 155px)',
              // minHeight: 260,
              background: haveBgColor ? colorBgContainer : '#F5F5F5',
              borderRadius: borderRadiusLG
            }}
          >
            <Outlet />
            {showScrollButton && <FloatButton icon={<VerticalAlignTopOutlined />} onClick={scrollToTop} />}
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: 'center', padding: '10px 0' }}>Mogu Admin ©2024 Created by Group 2</Footer>
    </Layout>
  )
}

export default AppLayout
