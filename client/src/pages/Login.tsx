// Updated Login.tsx
import React from 'react';
import { Form, Input, Button, Card, Typography, Layout, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../slice/authSlice';
import { useAppDispatch } from '../store/hooks';
import "./Login.css";

const { Header } = Layout;
const { Title } = Typography;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const resultAction = await dispatch(loginUser({
        email: values.email,
        password: values.password
      }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        message.success('Đăng nhập thành công!');
        localStorage.setItem('currentUser', JSON.stringify(resultAction.payload));
        navigate('/');
      } else {
        message.error(resultAction.payload?.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      message.error('Đăng nhập thất bại!');
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
          title={<Title level={3} style={{ margin: 0, textAlign: 'center' }}>Login</Title>}
          style={{ 
            width: 400, 
            borderRadius: 8, 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
            padding: '10px 0' 
          }}
          headStyle={{ borderBottom: 'none', padding: '20px 24px 0' }}
          bodyStyle={{ padding: '24px' }}
        >
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: 'email', message: 'Email phải đúng định dạng!' }
              ]}
            >
              <Input  size="large" />
            </Form.Item>

            <Form.Item
              label="Passwork"
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự!' }
              ]}
            >
              <Input.Password  size="large" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ 
                  backgroundColor: '#1890ff', 
                  borderColor: '#1890ff',
                  boxShadow: '0 2px 0 rgba(24, 144, 255, 0.04)'
                }}
              >
               Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}