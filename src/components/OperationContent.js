import React, { useState, useEffect } from 'react';
import { Input, Select, Button, message, Form, Row, Col } from 'antd';
import axios from 'axios';

const { Option } = Select;

const OperationContent = () => {
  const [memberId, setMemberId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [operationType, setOperationType] = useState('');
  const [points, setPoints] = useState('');
  const [username, setUsername] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/members');
      setMembers(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch members.');
      setLoading(false);
    }
  };

  const handleMemberChange = (value, option) => {
    setMemberId(value);
    setMemberName(option.name); 
  };

  const handleUpdatePoints = async () => {
    if (!memberId || !operationType || !points) {
      message.error('Please fill in all fields');
      return;
    }

    try {
      const updatedPoints = operationType === 'credit' ? parseInt(points, 10) : -parseInt(points, 10);

      const response = await axios.post('http://localhost:3000/transactions', {
        member_id: memberId,
        name: memberName,
        points_updated: Math.abs(updatedPoints),
        description: `${operationType === 'credit' ? 'Credited' : 'Debited'} ${points} points`,
        type: operationType,
        updated_by: username,
        status: 'success',
      });

      if (response.data.status === 'error') {
        message.error(response.data.message);
      } else {
        message.success('Points updated successfully');
        setMemberId('');
        setMemberName(''); 
        setOperationType('');
        setPoints('');
      }
    } catch (error) {
      message.error('Failed to update points. Please try again.');
    }
  };

  return (
    <div>
      <h2>Update Member Points</h2>
      <Form layout="vertical" onFinish={handleUpdatePoints}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Member"
              rules={[{ required: true, message: 'Please select a member' }]}
            >
              <Select
                showSearch
                placeholder="Select Member"
                optionFilterProp="children"
                value={memberId}
                onChange={handleMemberChange}
                loading={loading}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase()) ||
                  option.value.toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: '100%' }}
              >
                {members.map((member) => (
                  <Option key={member.member_id} value={member.member_id} name={member.name}>
                    {`${member.member_id} - ${member.name}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Operation Type"
              rules={[{ required: true, message: 'Please select an operation type' }]}
            >
              <Select
                placeholder="Select Operation"
                value={operationType}
                onChange={(value) => setOperationType(value)}
                style={{ width: '100%' }}
              >
                <Option value="credit">Credit</Option>
                <Option value="debit">Debit</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Points"
              rules={[{ required: true, message: 'Please enter points' }]}
            >
              <Input
                placeholder="Points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Points
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OperationContent;
