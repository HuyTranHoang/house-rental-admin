import { useAppDispatch } from '@/store.ts'
import AppSider from '@/ui/AppSider.tsx'
import { selectI18n, selectIsDarkMode, setI18n, toggleDarkMode } from '@/ui/appSlice.ts'
import { GlobalOutlined, MoonOutlined, SunOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Flex, FloatButton, Layout, Space, theme, Typography } from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import CustomBreadcrumbs from '../components/CustomBreadcrumbs.tsx'

const { Header, Content } = Layout

function AppLayout({ haveBgColor = true }: { haveBgColor?: boolean }) {
  const [showScrollButton, setShowScrollButton] = useState(false)
  const dispatch = useAppDispatch()
  const isDarkMode = useSelector(selectIsDarkMode)
  const i18n = useSelector(selectI18n)
  const { t } = useTranslation()

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
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <Flex justify='space-between' align='center' className='w-full'>
            <Flex>
              <img src='/favicon.webp' alt='Mogu logo' className='w-8' />

              <Typography.Title level={4} className='mx-2 my-0 text-white'>
                {t('webTitle')}
              </Typography.Title>
            </Flex>

            <Space>
              <Button type='link' className='mt-2 text-xl' onClick={() => dispatch(toggleDarkMode())}>
                {isDarkMode ? <SunOutlined className='text-white' /> : <MoonOutlined />}
              </Button>

              <Button type='link' className='mt-2 text-xl'>
                <GlobalOutlined className='text-white' />
                <Typography.Text
                  onClick={() => dispatch(setI18n('en'))}
                  className={clsx('text-white hover:text-blue-500', i18n === 'en' ? 'font-semibold' : 'opacity-50')}
                >
                  EN
                </Typography.Text>
                <Typography.Text
                  onClick={() => dispatch(setI18n('vi'))}
                  className={clsx('text-white hover:text-blue-500', i18n === 'vi' ? 'font-semibold' : 'opacity-50')}
                >
                  VI
                </Typography.Text>
              </Button>
            </Space>
          </Flex>
        </Header>
        <Layout>
          <AppSider darkMode={isDarkMode} />

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
              className={isDarkMode ? 'bg-slate-800' : ''}
            >
              <Outlet />
              {showScrollButton && <FloatButton icon={<VerticalAlignTopOutlined />} onClick={scrollToTop} />}
            </Content>
          </Layout>
        </Layout>
        <Footer
          className={clsx('px-0 py-3 text-center', {
            'bg-slate-950 text-white': isDarkMode,
            'bg-gray-100': !isDarkMode
          })}
        >
          Mogu Admin ©2024 Created by Group 2
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default AppLayout
