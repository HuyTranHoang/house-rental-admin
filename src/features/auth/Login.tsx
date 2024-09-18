'use client'

import GradientButton from '@/components/GradientButton'
import { User } from '@/models/user.type'
import useBoundStore from '@/store'
import { delay } from '@/utils/delay'
import { AntDesignOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Checkbox, Col, Flex, Form, Input, Row, Spin, Typography } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

type LoginFormType = {
  username: string
  password: string
  remember?: boolean
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'
  const isAdmin = useBoundStore((state) => state.isAdmin)
  const loginSuccess = useBoundStore((state) => state.loginSuccess)

  const [spinning, setSpinning] = useState(true)

  useEffect(() => {
    if (isAdmin) {
      delay(300).then(() => navigate(redirectTo))
    } else {
      delay(300).then(() => setSpinning(false))
    }
  }, [isAdmin, navigate, redirectTo])

  const loginMutation = useMutation({
    mutationFn: (values: LoginFormType) => axios.post<User>('/api/auth/login', values),
    onSuccess: (response) => {
      toast.success('Đăng nhập thành công')

      const payload = {
        user: response.data,
        token: response.headers['jwt-token']
      }

      localStorage.setItem('jwtToken', payload.token)
      loginSuccess(payload.user, payload.token)
      navigate(redirectTo)
    },
    onError: () => {
      toast.error('Sai tên tài khoản hoặc mật khẩu')
    }
  })

  if (spinning) {
    return <Spin spinning={spinning} fullscreen />
  }

  return (
    <Row className='login-page-bg'>
      <Col span={24}>
        <Flex justify='center' align='middle'>
          <Form
            name='login'
            initialValues={{ remember: true }}
            onFinish={(values) => loginMutation.mutate(values)}
            autoComplete='off'
            layout='vertical'
            style={{
              width: '400px',
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '32px',
              marginTop: '120px',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
            }}
          >
            <Flex vertical justify='center' align='center' style={{ marginBottom: '24px' }}>
              <img src='/logo.webp' alt='Mogu logo' style={{ width: 140 }} />
              <Typography.Title level={3} style={{ textAlign: 'center' }}>
                Đăng nhập
              </Typography.Title>
              <Typography.Text type='secondary' className='centered-text' style={{ fontSize: 12 }}>
                Chào mừng bạn trở lại, vui lòng nhập thông tin tài khoản để tiếp tục.
              </Typography.Text>
            </Flex>

            <Form.Item<LoginFormType>
              label='Tài khoản'
              name='username'
              rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item<LoginFormType>
              label='Mật khẩu'
              name='password'
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item>
              <Flex justify='space-between' align='center'>
                <Form.Item name='remember' valuePropName='checked' noStyle>
                  <Checkbox>Ghi nhớ thông tin</Checkbox>
                </Form.Item>
                <a href=''>Quên mật khẩu?</a>
              </Flex>
            </Form.Item>

            <Form.Item>
              <GradientButton
                type='primary'
                htmlType='submit'
                icon={<AntDesignOutlined />}
                loading={loginMutation.isPending}
                block
              >
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
