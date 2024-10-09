import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import ROUTER_NAMES from '@/constant/routerNames.ts'

function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
      extra={<Link to={ROUTER_NAMES.DASHBOARD}><Button type="primary">Trở về trang chủ</Button></Link>}
    />
  )
}

export default NotFound
