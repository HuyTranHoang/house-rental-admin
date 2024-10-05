import DashboardReviewItem from '@/features/dashboard/DashboardReviewItem.tsx'
import { Col, Row } from 'antd'
import { DashboardAreaChart } from './DashboardAreaChart'
import { DashboardBarChart } from './DashboardBarChart'
import { DashboardLineChart } from './DashboardLineChart'
import DashboardStatistic from './DashboardStatistic'

export default function Component() {
  return (
    <>
      <DashboardStatistic />

      <Row gutter={16} className='mb-4'>
        <Col xs={24} lg={16}>
          <DashboardLineChart />
        </Col>
        <Col xs={24} lg={8}>
          <DashboardReviewItem />
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
