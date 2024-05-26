import React, { useState, useEffect } from "react";
import { Input, Select, Button, message, Form,Card } from "antd";
import operationsIllustration from "../assets/points_update.png";
import "./OperationContent.css";
import apiClient from "../apiClient";


const { Option } = Select;

const OperationContent = () => {
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [operationType, setOperationType] = useState("");
  const [points, setPoints] = useState("");
  const [username, setUsername] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();


  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await apiClient.get("http://localhost:3000/members");
      setMembers(response.data);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch members.");
      setLoading(false);
    }
  };

  const handleMemberChange = (value, option) => {
    setMemberId(value);
    setMemberName(option.name);
  };

  const handleUpdatePoints = async () => {
    if (!memberId || !operationType || !points) {
      message.error("Please fill in all fields");
      return;
    }

    try {
      const updatedPoints =
        operationType === "credit"
          ? parseInt(points, 10)
          : -parseInt(points, 10);

      const response = await apiClient.post("http://localhost:3000/transactions", {
        member_id: memberId,
        name: memberName,
        points_updated: Math.abs(updatedPoints),
        description: `${
          operationType === "credit" ? "Credited" : "Debited"
        } ${points} points`,
        type: operationType,
        updated_by: username,
        status: "success",
      });

      if (response.data.status === "error") {
        message.error(response.data.message);
      } else {
        message.success("Points updated successfully");
        form.resetFields();
      }
    } catch (error) {
      message.error("Failed to update points. Please try again.");
    }
  };

  return (
    <Card>
    <div className="background-container">
        <div className="flex-container">
          <div className="form-container">
            <h2>Update Member Points</h2>
            <Form form={form} layout="vertical" onFinish={handleUpdatePoints}>
              <Form.Item
                label="Member"
                name="member"
                rules={[{ required: true, message: "Please select a member" }]}
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
              </Form.Item>
              <Form.Item
                label="Operation Type"
                name="operationType"
                rules={[
                  { required: true, message: "Please select an operation type" },
                ]}
              >
                <Select
                  placeholder="Select Operation"
                  value={operationType}
                  onChange={(value) => setOperationType(value)}
                >
                  <Option value="credit">Credit</Option>
                  <Option value="debit">Debit</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Points"
                name="points"
                rules={[{ required: true, message: "Please enter points" }]}
              >
                <Input
                  placeholder="Points"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                  Update Points
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="image-container">
            <img
              src={operationsIllustration}
              alt="Operations Illustration"
              className="operation-image"
            />
          </div>
        </div>
    </div>
    </Card>
  );
};

export default OperationContent;
