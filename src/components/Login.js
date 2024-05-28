import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, message, Form, Card } from 'antd';
import apiClient from '../apiClient'
import './Login.css';
import newBackgroundImage from '../assets/login_image.svg';
import { LockFilled, UserOutlined } from "@ant-design/icons";
import comviva_text from '../assets/comviva_logo_text.png'


const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 769);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 769);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', values);
      message.success('Login successful');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);
      onLogin();
      navigate('/');
    } catch (error) {
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="main-logo-container">
        <div className="comviva-main-logo">
        <img src={comviva_text} alt="Side" />
        </div>
      </div>
      <div className="main-background-container"></div>
      <div className="main-container-popup">
        <div className="login-content-container">
          {isLargeScreen && (
            <div className="login-popup-background-container">
              <div className="login-mobilytix-logo">
                MobiLytix <span className="trade-mark">™</span>
              </div>
              <div className="login-mobilytix-description">Rewards</div>
              <div className="login-background-container">
                <img src={newBackgroundImage} alt="Side" />
              </div>
            </div>
          )}
          {isLargeScreen && (
            <div className="divider">
              <div className="divider-line"></div>
              <div className="divider-highlight"></div>
              <div className="divider-line"></div>
            </div>
          )}
          <div className="login-popup-form-container">
            <div className="top-right-logo"></div>

            <Card className="login-box">
              <h3>Welcome,</h3>
              <p>Please login to get started</p>
              <Form onFinish={onFinish} className="login-form">
                <Form.Item
                  name="identifier"
                  rules={[{ required: true, message: 'Please input your username or email!' }]}
                >
                  <Input placeholder="Username or Email" className="textbox" prefix={<UserOutlined />} />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="Password" className="textbox" prefix={<LockFilled />} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} className="comviva-button">
                    Sign In
                  </Button>
                </Form.Item>
              </Form>
              <p>Don't have an account? <Link to="/register">Register now!</Link></p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
