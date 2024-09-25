import useBoundStore from '@/store.ts'
import AppSider from '@/ui/AppSider.tsx'
import { GlobalOutlined, MoonOutlined, SunOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Flex, FloatButton, Layout, Space, theme, Typography } from 'antd'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import CustomBreadcrumbs from '../components/CustomBreadcrumbs.tsx'

const { Content, Footer } = Layout

export default function AppLayout({ haveBgColor = true }: { haveBgColor?: boolean }) {
  const [showScrollButton, setShowScrollButton] = useState(false)
  const isDarkMode = useBoundStore((state) => state.isDarkMode)
  const toggleDarkMode = useBoundStore((state) => state.toggleDarkMode)
  const i18n = useBoundStore((state) => state.i18n)
  const setI18n = useBoundStore((state) => state.setI18n)

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
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <Layout className='min-h-screen'>
        <AppSider darkMode={isDarkMode} />
        {/*260 is width of AppSider*/}
        <Layout style={{ padding: '0 24px', marginLeft: 260 }}>
          <Flex justify='space-between'>
            <CustomBreadcrumbs />

            <Space>
              <Button type='link' className='mt-2 text-xl' onClick={() => toggleDarkMode()}>
                {isDarkMode ? <SunOutlined className='text-white' /> : <MoonOutlined className='text-gray-600' />}
              </Button>

              <Button type='link' className='mt-2 text-xl'>
                <GlobalOutlined className={clsx(isDarkMode && 'text-white', !isDarkMode && 'text-gray-600')} />
                <Typography.Text
                  onClick={() => setI18n('en')}
                  className={clsx('hover:text-blue-500', i18n === 'en' ? 'font-semibold' : 'opacity-50')}
                >
                  EN
                </Typography.Text>
                <Typography.Text
                  onClick={() => setI18n('vi')}
                  className={clsx('hover:text-blue-500', i18n === 'vi' ? 'font-semibold' : 'opacity-50')}
                >
                  VI
                </Typography.Text>
              </Button>
            </Space>
          </Flex>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 'calc(100vh - 95px)',
              background: haveBgColor ? colorBgContainer : '#F5F5F5',
              borderRadius: borderRadiusLG
            }}
            className={isDarkMode ? 'bg-slate-800' : ''}
          >
            <Outlet />
            {showScrollButton && <FloatButton icon={<VerticalAlignTopOutlined />} onClick={scrollToTop} />}
          </Content>
          <Footer className='px-0 py-3 text-center'>Mogu Admin ©2024 Created by Group 2</Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
