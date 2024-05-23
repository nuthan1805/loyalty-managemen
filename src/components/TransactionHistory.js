import React, { useState, useEffect } from "react";
import { Select, Button, Card, Table, Tag } from "antd";
import axios from "axios";
import moment from "moment";
import "./TransactionHistory.css";
import HistoryImage from "../assets/txn_history.svg";

const { Option } = Select;

const TransactionHistory = () => {
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/members")
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
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Points Updated",
      dataIndex: "points_updated",
      key: "points_updated",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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
    },
    {
      title: "Date",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "success" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const handleViewHistory = () => {
    if (memberId) {
      axios
        .get(`http://localhost:3000/transactions/history/${memberId}`)
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
          <Button
            type="primary"
            onClick={handleViewHistory}
            style={{ flexShrink: 0 }}
          >
            View History
          </Button>
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
