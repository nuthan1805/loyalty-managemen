import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, message, Form } from 'antd';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/auth/login', values);
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
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <Form onFinish={onFinish}>
          <Form.Item name="identifier" rules={[{ required: true, message: 'Please input your username or email!' }]}>
            <Input placeholder="Username or Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <p>Don't have an account? <Link to="/register">Register now!</Link></p>
      </div>
    </div>
  );
};

export default Login;
