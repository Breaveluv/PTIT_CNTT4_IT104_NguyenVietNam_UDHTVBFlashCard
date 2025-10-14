import React from 'react';
import { Form, Input, Button, Card, Typography, Layout, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../slice/authSlice';
import { useAppDispatch } from '../store/hooks';
import { validateRegisterData, hasValidationErrors, type RegisterData } from '../utils/validation';

const { Header } = Layout;
const { Title } = Typography;

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    
    const names = values.fullName.trim().split(' ');
    const firstName = names.slice(0, -1).join(' ') || '';
    const lastName = names.slice(-1).join(' ') || '';

    
    const registerData: RegisterData = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword
    };

    const validationErrors = validateRegisterData(registerData);
    if (hasValidationErrors(validationErrors)) {
      message.error(validationErrors[0].message);
      return;
    }

    try {
      const resultAction = await dispatch(registerUser({
        firstName,
        lastName,
        email: values.email,
        password: values.password
      }));
      if (registerUser.fulfilled.match(resultAction)) {
        message.success('Đăng ký thành công!');
        navigate('/');
      } else {
        message.error(resultAction.payload?.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      message.error('Đăng ký thất bại!');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{
        backgroundColor: '#fff',
        padding: '0 24px',
        lineHeight: '64px',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="logo" style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000' }}>
          VocabApp
        </div>
        <div className="nav-buttons">
          <Button
            type="primary"
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              marginRight: '8px'
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            type="primary"
            style={{
              backgroundColor: '#52c41a',
              borderColor: '#52c41a'
            }}
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </Header>

      <Content style={{
        padding: '50px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}>
        <Card
          title={<Title level={3} style={{ margin: 0, textAlign: 'center' }}>Đăng ký</Title>}
          style={{
            width: 400,
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '10px 0'
          }}
          headStyle={{ borderBottom: 'none', padding: '20px 24px 0' }}
          bodyStyle={{ padding: '24px' }}
        >
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input placeholder="Họ và tên" size="large" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email phải đúng định dạng!' }
              ]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự!' }
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Mật khẩu" size="large" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu xác nhận"
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận phải trùng khớp với Mật khẩu!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Mật khẩu xác nhận" size="large" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                  boxShadow: '0 2px 0 rgba(82, 196, 26, 0.04)'
                }}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Register;