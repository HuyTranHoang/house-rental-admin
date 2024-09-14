import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  FileTextOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Card, Col, Row, Statistic, Table } from 'antd'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const iconStyle = (color: string) => ({
  backgroundColor: color,
  color: 'white',
  fontSize: 24,
  padding: 8,
  borderRadius: 20
})

const statsData = [
  {
    title: 'Thành viên mới',
    value: 11.28,
    color: '#52c41a',
    icon: <UserOutlined style={iconStyle('#52c41a')} />,
    prefix: <ArrowUpOutlined />
  },
  {
    title: 'Doanh thu',
    value: 9.3,
    color: '#f5222d',
    icon: <DollarOutlined style={iconStyle('#f5222d')} />,
    prefix: <ArrowDownOutlined />
  },
  {
    title: 'Số bài đăng mới',
    value: 13.5,
    color: '#1890ff',
    icon: <FileTextOutlined style={iconStyle('#1890ff')} />,
    prefix: <ArrowUpOutlined />
  },
  {
    title: 'Nhận xét mới',
    value: 7.2,
    color: '#722ed1',
    icon: <MessageOutlined style={iconStyle('#722ed1')} />,
    prefix: <ArrowDownOutlined />
  }
]

const lineChartData = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 }
]

const pieChartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 }
]

const tableData = [
  { key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Bridge Street' },
  { key: 3, name: 'Joe Black', age: 32, address: 'Sydney No. 1 York Street' }
]

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' }
]

export default function Component() {
  return (
    <>
      <Row gutter={16}>
        {statsData.map((stat, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card className='mb-4 shadow-md transition-shadow duration-300 hover:shadow-lg'>
              <Statistic
                title={
                  <span>
                    {stat.icon} {stat.title}
                  </span>
                }
                value={stat.value}
                precision={2}
                valueStyle={{ color: stat.color }}
                prefix={stat.prefix}
                suffix='%'
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title='Biểu Đồ Đường' className='mb-6 shadow-md'>
            <LineChart
              width={500}
              height={300}
              data={lineChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey='pv' stroke='#8884d8' activeDot={{ r: 8 }} />
              <Line type='monotone' dataKey='uv' stroke='#82ca9d' />
            </LineChart>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title='Biểu Đồ Tròn' className='mb-6 shadow-md'>
            <PieChart width={500} height={300}>
              <Pie
                dataKey='value'
                isAnimationActive={false}
                data={pieChartData}
                cx='50%'
                cy='50%'
                outerRadius={80}
                fill='#8884d8'
                label
              />
              <Tooltip />
            </PieChart>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title='Biểu Đồ Cột' className='mb-6 shadow-md'>
            <BarChart width={500} height={300} data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='pv' fill='#8884d8' />
              <Bar dataKey='uv' fill='#82ca9d' />
            </BarChart>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title='Biểu Đồ Vùng' className='mb-6 shadow-md'>
            <AreaChart
              width={500}
              height={300}
              data={lineChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Area type='monotone' dataKey='uv' stroke='#8884d8' fill='#8884d8' />
            </AreaChart>
          </Card>
        </Col>
      </Row>

      <Card title='Bảng Dữ Liệu' className='shadow-md'>
        <Table columns={columns} dataSource={tableData} />
      </Card>
    </>
  )
}
