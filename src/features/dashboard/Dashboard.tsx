
import { Card, Col, Row, Table } from 'antd'
import {
  Pie,
  PieChart,
  Tooltip,
} from 'recharts'
import DashboardStatistic from './DashboardStatistic'
import { DashboardLineChart } from './DashboardLineChart'


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
      <DashboardStatistic/>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <DashboardLineChart/>
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

      

      <Card title='Bảng Dữ Liệu' className='shadow-md'>
        <Table columns={columns} dataSource={tableData} />
      </Card>
    </>
  )
}
