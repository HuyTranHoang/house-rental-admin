import axiosInstance from '@/axiosInstance.ts'
import ROUTER_NAMES from '@/constant/routerNames.ts'
import { toTitleCase } from '@/utils/toTitleCase.ts'
import {
  BarChartOutlined,
  createFromIconfontCN,
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  SettingOutlined,
  SolutionOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Button, ConfigProvider, Dropdown, Flex, Layout, Menu, MenuProps, Space, theme, Typography } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import useBoundStore from '@/store.ts'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4645396_ko0yqafz4er.js'
})

function AppSider({ darkMode }: { darkMode: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('breadcrumbs')
  const user = useBoundStore((state) => state.user)
  const logout = useBoundStore((state) => state.logout)

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const siderItems: MenuProps['items'] = [
    {
      key: ROUTER_NAMES.DASHBOARD,
      label: t('dashboard'),
      icon: <BarChartOutlined />,
      onClick: () => navigate(ROUTER_NAMES.DASHBOARD)
    },
    {
      key: 'property',
      label: t('property'),
      icon: <ScheduleOutlined />,
      onClick: () => navigate(ROUTER_NAMES.PROPERTY)
    },
    {
      key: 'cityDistrict',
      label: t('cityAndDistrict'),
      icon: <IconFont type='icon-city' />,
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
      label: t('reportAndReview'),
      icon: <SolutionOutlined />,
      children: [
        {
          key: ROUTER_NAMES.REPORT,
          label: t('report.list'),
          onClick: () => navigate(ROUTER_NAMES.REPORT)
        },
        {
          key: ROUTER_NAMES.REVIEW,
          label: t('review.list'),
          onClick: () => navigate(ROUTER_NAMES.REVIEW)
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
      key: 'transations',
      label: <Typography.Text type='danger'>Check bản dịch (Dev Only)</Typography.Text>,
      icon: <SettingOutlined className='text-red-500' />,
      onClick: () => window.open('/?showtranslations')
    }
  ]

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'username',
      label: (
        <Flex vertical>
          <Typography.Text type='secondary'>{t('currentLoginAccount')}</Typography.Text>
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
        toast.info('Chưa có làm uwu!!!')
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
    <Sider
      width={260}
      style={{
        background: colorBgContainer,
        height: 'calc(100vh - 100px)',
        position: 'sticky',
        top: 40
      }}
    >
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
            <img src={darkMode ? '/LOGO_TEXT_DARK.png' : '/LOGO_TEXT.png'} alt='Mogu logo' style={{ width: 100 }} />
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
