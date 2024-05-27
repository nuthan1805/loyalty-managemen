import React, { useState, useEffect } from "react";
import { Select, Button, Card, Table, Tag } from "antd";
import moment from "moment";
import { useMediaQuery } from "react-responsive";
import { EyeOutlined } from "@ant-design/icons";
import "./TransactionHistory.css";
import HistoryImage from "../assets/txn_history.svg";
import apiClient from "../apiClient";

const { Option } = Select;

const TransactionHistory = () => {
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");

  const isSmallScreen = useMediaQuery({ query: "(max-width: 550px)" });

  useEffect(() => {
    apiClient
      .get("https://loyalty-manager.onrender.com/members")
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      });
  }, []);

  const columns = [
    {
      title: "Member ID",
      dataIndex: "member_id",
      key: "member_id",
      responsive: ['xs', 'sm', 'md', 'lg']
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      responsive: ['xs', 'sm', 'md', 'lg']
    },
    {
      title: "Points Updated",
      dataIndex: "points_updated",
      key: "points_updated",
      responsive: ['xs', 'sm', 'md', 'lg']
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      responsive: ['xs', 'sm', 'md', 'lg'],
      filters: [
        { text: 'Credited', value: 'credit' },
        { text: 'Debited', value: 'debit' }
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <Tag color={type === "credit" ? "blue" : "orange"}>
          {type === "credit" ? "Credited" : "Debited"}
        </Tag>
      ),
    },
    {
      title: "Updated By",
      dataIndex: "updated_by",
      key: "updated_by",
      responsive: ['xs', 'sm', 'md', 'lg']
    },
    {
      title: "Date",
      dataIndex: "updated_at",
      key: "updated_at",
      responsive: ['xs', 'sm', 'md', 'lg'],
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ['xs', 'sm', 'md', 'lg'],
      render: (status) => (
        <Tag color={status === "success" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const handleViewHistory = () => {
    if (memberId) {
      apiClient
        .get(`https://loyalty-manager.onrender.com/transactions/history/${memberId}`)
        .then((response) => {
          const lastFiveTransactions = response.data.slice(0, 5);
          setTransactions(lastFiveTransactions);
          setShowTable(true);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
        });
    }
  };

  const handleMemberChange = (value, option) => {
    setMemberId(value);
    setMemberName(option.name);
  };

  return (
    <div className="transaction-history">
      <Card className="main-card">
        <h3>View Transaction History</h3>
        <div className="input-group">
          <Select
            showSearch
            className="select-dropdown"
            placeholder="Select Member ID"
            optionFilterProp="children"
            value={memberId}
            style={{ flex: 1, marginRight: "10px" }}
            onChange={handleMemberChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase()) ||
              option.value.toLowerCase().includes(input.toLowerCase())
            }
          >
            {members.map((member) => (
              <Option
                key={member.member_id}
                value={member.member_id}
                name={member.name}
              >
                {`${member.member_id} - ${member.name}`}
              </Option>
            ))}
          </Select>
          {isSmallScreen ? (
            <Button
              className="history-btn"
              type="primary"
              onClick={handleViewHistory}
              icon={<EyeOutlined />}
              style={{ flexShrink: 0 }}
            />
          ) : (
            <Button
              className="history-icon"
              type="primary"
              onClick={handleViewHistory}
              style={{ flexShrink: 0 }}
            >
              View History
            </Button>
          )}
        </div>
        <div className="content-container">
          {showTable ? (
            <Card bordered={false} className="table-card">
              <Table
                columns={columns}
                dataSource={transactions}
                rowKey="id"
                pagination={false}
                className="custom-table"
                scroll={{ x: 'max-content' }}
              />

            </Card>
          ) : (
            <img
              src={HistoryImage}
              alt="Decorative background"
              className="background-image"
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default TransactionHistory;
