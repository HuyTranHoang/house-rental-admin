import ErrorFetching from "@/components/ErrorFetching";
import { useLineChartData } from "@/hooks/useDashboard";
import { Card, Tooltip } from "antd";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

export function DashboardLineChart() {
    const { data, isLoading, isError } = useLineChartData();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <ErrorFetching />
    }

    return (
        <Card title='Biểu Đồ Đường' className='mb-6 shadow-md'>
            <LineChart
              width={500}
              height={300}
              data={data?.data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='months' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey='users' stroke='#ee5df9' name="Người dùng"/>
              <Line type='monotone' dataKey='properties' stroke='#82ca9d' name="Bài đăng" />
              <Line type='monotone' dataKey='comments' stroke='#1500ff' name="Bình luận" />
            </LineChart>
          </Card>
    );
}
