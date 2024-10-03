import ErrorFetching from "@/components/ErrorFetching";
import { useStatisticData } from "@/hooks/useDashboard";
import { Card, Tooltip } from "antd";
import { Legend, Pie, PieChart } from "recharts";


export function DashboardPieChart () {
    const { data, isLoading: isLoading, isError } = useStatisticData('month')

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <ErrorFetching />
  }
  const residual = data?.data.deposits - data?.data.withdrawals
  console.log(residual)
  console.log(data?.data.deposits)
  const chartData = [
    { name: 'Residual', value: residual || 0 , fill: '#82ca9d' },
    { name: 'Withdrawals', value: data?.data.withdrawals || 0 , fill: '#8884d8' }
  ];


    return (
        <Card title='Gói Thành Viên' className='mb-6 shadow-md'>
            <PieChart width={500} height={300}>
              <Pie
                dataKey='value'
                isAnimationActive={false}
                data={chartData}
                cx='50%'
                cy='50%'
                outerRadius={80}
                label
              />
              <Tooltip />
              <Legend layout="vertical" verticalAlign="middle" align="right" />

            </PieChart>
          </Card>
    );
}