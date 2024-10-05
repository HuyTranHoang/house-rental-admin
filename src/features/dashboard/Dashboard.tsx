import { Col, Row } from 'antd'
import { DashboardAreaChart } from './DashboardAreaChart'
import { DashboardBarChart } from './DashboardBarChart'
import { DashboardLineChart } from './DashboardLineChart'
import DashboardStatistic from './DashboardStatistic'
import { DashboardReviewItem } from './DashboardReviewItem'

// const tableData = [
//   { key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
//   { key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Bridge Street' },
//   { key: 3, name: 'Joe Black', age: 32, address: 'Sydney No. 1 York Street' }
// ]

// const columns = [
//   { title: 'Name', dataIndex: 'name', key: 'name' },
//   { title: 'Age', dataIndex: 'age', key: 'age' },
//   { title: 'Address', dataIndex: 'address', key: 'address' }
// ]

export default function Component() {
  return (
    <>
      <DashboardStatistic />

      <Row gutter={16}>
        <Col xs={2} lg={12}>
          <DashboardLineChart />
        </Col>
        <Col xs={24} lg={12}>
          <DashboardReviewItem/>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <DashboardAreaChart />
        </Col>
        <Col xs={24} lg={12}>
          <DashboardBarChart />
        </Col>
      </Row>

      {/* <Card title='Bảng Dữ Liệu' className='shadow-md'>
        <Table columns={columns} dataSource={tableData} />
      </Card> */}
    </>
  )
}
