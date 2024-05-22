import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Table, Tag } from "antd";
import axios from 'axios';
import moment from 'moment';
import './TransactionHistory.css';

const TransactionHistory = () => {
  const [memberId, setMemberId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showTable, setShowTable] = useState(false);

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
      title: 'Points Updated',
      dataIndex: 'points_updated',
      key: 'points_updated',
    },
    {
      title: 'Updated By',
      dataIndex: 'updated_by',
      key: 'updated_by',
    },
    {
      title: 'Date',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const handleViewHistory = () => {
    if (memberId) {
      axios.get(`http://localhost:3000/transactions/history/${memberId}`)
        .then(response => {
          const lastFiveTransactions = response.data.slice(5);
          setTransactions(response.data);
          console.log('')
          setShowTable(true);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
        });
    }
  };

  return (
    <div className="transaction-history">
      <h1>View Transaction History</h1>
      <div className="input-group">
        <Input
          placeholder="Enter Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button type="primary" onClick={handleViewHistory}>
          View History
        </Button>
      </div>

      {showTable && (
        <Card
          title="Transaction History"
          bordered={false}
          style={{
            width: "100%",
            backgroundColor: '#f0f2f5',
          }}
        >
          <Table columns={columns} dataSource={transactions} rowKey="id" pagination={false} />
        </Card>
      )}
    </div>
  );
};

export default TransactionHistory;
