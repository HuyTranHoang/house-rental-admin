import CustomIndicator from '@/components/CustomIndicator.tsx'
import useRefreshToken from '@/hooks/useRefreshToken.ts'
import router from '@/router.tsx'
import { Spin } from 'antd'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import './App.css'

function App() {
  const isLoading = useRefreshToken()

  if (isLoading) {
    return <Spin indicator={<CustomIndicator />} tip={'Đang tải dữ liệu...Vui lòng đợi trong giây lát!!!'} fullscreen />
  }

  return (
    <>
      <Toaster richColors={true} position='bottom-center' />
      <RouterProvider router={router} />
    </>
  )
}

export default App
