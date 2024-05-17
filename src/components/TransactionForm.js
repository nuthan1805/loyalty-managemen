import React, { useState, useEffect } from 'react';
import { Input, Button, message, Table } from 'antd';
import axios from 'axios';

const TransactionForm = () => {
  const [memberId, setMemberId] = useState('');
  const [points, setPoints] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchMembers();
  }, []);

  const handleUpdatePoints = async () => {
    if (!memberId || !points) {
      message.error('Please enter both member ID and points.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/transactions/${memberId}`, {
        points,
        description,
      });
      if (response.status === 200) {
        setPoints('')
        setDescription('')
        message.success('Points updated successfully.');
      }
    } catch (error) {
      message.error('Failed to update points. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Member ID',
      dataIndex: 'member_id',
      key: 'member_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => setMemberId(record.member_id)}>
          Select
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Update Member Points</h2>
      <Input
        placeholder="Enter Member ID"
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Input
        placeholder="Enter Points"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Input
        placeholder="Enter Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <Button type="primary" onClick={handleUpdatePoints} style={{ marginBottom: '20px' }}>
        Update Points
      </Button>
      <Table
        columns={columns}
        dataSource={members}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default TransactionForm;
