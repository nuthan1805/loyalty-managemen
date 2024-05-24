import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, message, Form, Card } from 'antd';
import axios from 'axios';
import './Registration.css';
import newBackgroundImage from '../assets/txn_history.svg'; 
import {
  MailFilled,
  LockFilled,
  UserOutlined,
} from "@ant-design/icons";

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/auth/register', values);
      localStorage.setItem('token', response.data.token);
      message.success('Registration successful! Please check your email for confirmation.');
      navigate('/login');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="main-logo-container">
        <div className="comviva-main-logo"></div>
      </div>
      <div className="main-background-container"></div>
      <div className="main-container-popup">
        <div className="login-content-container">
          <div className="login-popup-background-container">
            <div className="login-mobilytix-logo">
              MobiLytix <span className="trade-mark">™</span>
            </div>
            <div className="login-mobilytix-description">Rewards</div>
            <div className="login-background-container">
              <img src={newBackgroundImage} alt="Side" />
            </div>
          </div>
          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-highlight"></div>
            <div className="divider-line"></div>
          </div>
          <div className="login-popup-form-container">
            <div className="top-right-logo-register"></div>
            <Card className="login-box">
              <h3>Register now,</h3>
              <p>Create an account to get started</p>
              <Form onFinish={onFinish} className="login-form">
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input placeholder="Username" className="textbox" prefix={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <Input placeholder="Email" className="textbox" prefix={<MailFilled />}/>
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password placeholder="Password" className="textbox" prefix={<LockFilled />}/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} className="comviva-button">
                    Register
                  </Button>
                </Form.Item>
              </Form>
              <p>Already have an account? <Link to="/login">Login now!</Link></p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
