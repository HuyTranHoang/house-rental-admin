import { Card, Col, Row, Tooltip } from "antd";
import { Area, AreaChart, Bar, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { BarChart } from "recharts/types/chart/BarChart";

export function DashboardBarChart() {

    const lineChartData = [
        { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 }
      ]
    return (
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
    );
}
