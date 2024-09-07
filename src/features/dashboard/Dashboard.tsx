import { ArrowDownOutlined, ArrowUpOutlined, CarOutlined, CoffeeOutlined, HeartOutlined } from '@ant-design/icons'
import { Card, Col, Flex, Row, Statistic, Tooltip, Typography } from 'antd'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from 'recharts'
import { blue, green, Palette, purple, red } from '@ant-design/colors'

const demoData = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300
  }
]

const iconStyle = (color: Palette) => {
  return {
    backgroundColor: color[0],
    color: color[4],
    fontSize: 24,
    padding: 8,
    borderRadius: 16
  }
}

function Dashboard() {
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Typography.Title level={2}>Để tạm UI, sẽ cập nhật sau cho phù hợp!!!</Typography.Title>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title={
              <Flex justify='space-between'>
                Thành viên mới <CarOutlined style={iconStyle(green)} />
              </Flex>
            }
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix='%'
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title={
              <Flex justify='space-between'>
                Doanh thu <CarOutlined style={iconStyle(red)} />
              </Flex>
            }
            value={9.3}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowDownOutlined />}
            suffix='%'
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title={
              <Flex justify='space-between'>
                Số bài đăng mới <CoffeeOutlined style={iconStyle(blue)} />
              </Flex>
            }
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix='%'
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false}>
          <Statistic
            title={
              <Flex justify='space-between'>
                Nhận xét mới <HeartOutlined style={iconStyle(purple)} />
              </Flex>
            }
            value={9.3}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowDownOutlined />}
            suffix='%'
          />
        </Card>
      </Col>

      <Col span={12} style={{ marginTop: 24, backgroundColor: 'white' }}>
        <Typography.Title level={4}>Bar Chart</Typography.Title>
        <BarChart width={730} height={250} data={demoData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='pv' fill='#8884d8' />
          <Bar dataKey='uv' fill='#82ca9d' />
        </BarChart>
      </Col>

      <Col span={12} style={{ marginTop: 24, backgroundColor: 'white' }}>
        <Typography.Title level={4}>Area Chart</Typography.Title>
        <AreaChart width={730} height={250} data={demoData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
            </linearGradient>
            <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey='name' />
          <YAxis />
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <Area type='monotone' dataKey='uv' stroke='#8884d8' fillOpacity={1} fill='url(#colorUv)' />
          <Area type='monotone' dataKey='pv' stroke='#82ca9d' fillOpacity={1} fill='url(#colorPv)' />
        </AreaChart>
      </Col>
    </Row>
  )
}

export default Dashboard
