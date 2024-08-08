import { Alert, Empty } from 'antd'

function ErrorFetching() {
  return (
    <>
      <Alert
        message="Lỗi"
        description="Có lỗi xảy ra trong quá trình lấy dữ liệu. Vui lòng thử lại sau."
        type="error"
        showIcon
        style={{ marginBottom: '3rem' }}
      />

      <Empty />
    </>
  )
}

export default ErrorFetching
