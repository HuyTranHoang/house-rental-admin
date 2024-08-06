import { Col, FormProps, Row, Spin, Typography } from 'antd'
import { Checkbox, Form, Input } from 'antd'
import { useSelector } from 'react-redux'
import { loginFailure, loginRequest, loginSuccess, selectAuth } from './authSlice.ts'
import { useAppDispatch } from '../../store.ts'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { User } from '../../models/user.type.ts'
import { toast } from 'sonner'
import axios from 'axios'
import GradientButton from '../../components/GradientButton.tsx'
import { AntDesignOutlined } from '@ant-design/icons'

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
      setTimeout(() => {
        navigate(redirectTo)
      }, 300)
    } else {
      setTimeout(() => {
        setSpinning(false)
      }, 300)
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
      dispatch(loginFailure())
    }
  }

  if (isAdmin) {
    return <Spin spinning={spinning} fullscreen  />
  }

  return (
    <Row>
      <Col span={24}>
        <Typography.Title level={2}>Login tạm thời, xây UI sau</Typography.Title>
        <Form
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 8 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <GradientButton type="primary" htmlType="submit" size="large" icon={<AntDesignOutlined />}
                            loading={isLoading} block>
              Đăng nhập
            </GradientButton>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default Login
