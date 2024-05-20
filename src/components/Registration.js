import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, message, Form } from 'antd';
import axios from 'axios';
import './Registration.css';

const Registration = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/auth/register', values);
      localStorage.setItem('token', response.data.token);
      message.success('Registration successful! Please check your email for confirmation.');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-box">
        <h2>Register</h2>
        <Form onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Register
            </Button>
          </Form.Item>
        </Form>
        <p>Already have an account? <Link to="/login">Login now!</Link></p>
      </div>
    </div>
  );
};

export default Registration;
