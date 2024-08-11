import { Checkbox, Col, Flex, Form, FormProps, Input, Row, Spin, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { loginFailure, loginRequest, loginSuccess, selectAuth } from './authSlice.ts'
import { useAppDispatch } from '@/store.ts'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { User } from '@/models/user.type.ts'
import { toast } from 'sonner'
import axios from 'axios'
import GradientButton from '@/components/GradientButton.tsx'
import { AntDesignOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { delay } from '@/utils/delay.ts'

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo)
}

function Login() {

  const { isAdmin, isLoading } = useSelector(selectAuth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [spinning, setSpinning] = useState(true)

  useEffect(() => {
    if (isAdmin) {
      delay(300)
        .then(() => navigate(redirectTo))
    } else {
      delay(300)
        .then(() => setSpinning(false))
    }
  }, [isAdmin, navigate, redirectTo])

  const onFinish = async (values: FieldType) => {
    console.log('Success submit:', values)
    try {
      dispatch(loginRequest())
      const response = await axios.post<User>('/api/auth/login', values)
      console.log('>>>LOGIN.JSX', response)
      toast.success('Đăng nhập thành công')

      const payload: { user: User, token: string } = {
        user: response.data,
        token: response.headers['jwt-token']
      }

      localStorage.setItem('jwtToken', payload.token)
      dispatch(loginSuccess(payload))
      navigate(redirectTo)
    } catch (error) {
      console.log('>>>LOGIN.JSX', error)
      toast.error('Sai tên tài khoản hoặc mật khẩu')
      dispatch(loginFailure())
    }
  }

  if (isAdmin) {
    return <Spin spinning={spinning} fullscreen />
  }

  return (
    <Row className="login-page-bg">
      <Col span={24}>
        <Flex justify="center" align="middle">
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{
              width: '400px',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '120px',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
            }}
          >

            <Flex vertical justify="center" align="center" style={{ marginBottom: '24px' }}>
              <img src="/logo.png" alt="Mogu logo" style={{ width: 140 }} />
              <Typography.Title level={3} style={{ textAlign: 'center' }}>Đăng nhập</Typography.Title>
              <Typography.Text type="secondary" className="centered-text" style={{ fontSize: 12 }}>Chào mừng bạn trở
                lại,
                vui lòng nhập thông tin
                tài khoản để tiếp tục.</Typography.Text>
            </Flex>

            <Form.Item<FieldType>
              label="Tài khoản"
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Ghi nhớ thông tin</Checkbox>
                </Form.Item>
                <a href="">Quên mật khẩu?</a>
              </Flex>
            </Form.Item>

            <Form.Item>
              <GradientButton type="primary" htmlType="submit" icon={<AntDesignOutlined />}
                              loading={isLoading} block>
                Đăng nhập
              </GradientButton>
            </Form.Item>
          </Form>
        </Flex>
      </Col>
    </Row>
  )
}

export default Login
