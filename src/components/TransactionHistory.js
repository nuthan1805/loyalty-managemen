import React, { useState } from 'react';

import { Input, Button, Card } from "antd";

const TransactionHistory = () => {

  return (
    <div>
      <h1>View Transaction History</h1>
      <Input
        placeholder="Enter Member ID"
        
        style={{ marginBottom: "10px" }}
      />

      <Button type="primary" style={{ marginBottom: "20px" }}>
        View History
      </Button>

      <Card
        title="Card title"
        bordered={false}
        style={{
          width: "100%",
        }}
      >
        <p>Txn 1</p>
        <p>Txn 2</p>
        <p>Txn 3</p>
      </Card>
    </div>
  );
};

export default TransactionHistory;
