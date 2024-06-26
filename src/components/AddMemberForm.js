import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  message,
  Table,
  Space,
  Tooltip,
  Modal,
  Form,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./AddMember.css";
import apiClient from "../apiClient";

const { confirm } = Modal;

const AddMemberForm = ({ darkTheme }) => {
  const [memberId, setMemberId] = useState("");
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [searchQuery]);

  const fetchMembers = async () => {
    try {
      const response = await apiClient.get("/members");
      let filteredMembers = response.data;
      if (searchQuery) {
        filteredMembers = filteredMembers.filter(
          (member) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.member_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setMembers(filteredMembers);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch members.");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUpdate = async (memberId) => {
    try {
      const response = await apiClient.get(`/members/${memberId}`);
      const member = response.data.data;
      setMemberId(member.member_id);
      form.setFieldsValue({
        name: member.name,
        email: member.email,
        points: member.points,
      });
      setVisible(true);
    } catch (error) {
      message.error("Failed to fetch member details. Please try again.");
    }
  };

  const handleDelete = (memberId) => {
    confirm({
      title: "Are you sure you want to delete this member?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        apiClient
          .delete(`/members/${memberId}`)
          .then(() => {
            setMembers(members.filter((member) => member.id !== memberId));
            fetchMembers();
            message.success("Member deleted successfully.");
          })
          .catch(() => {
            message.error("Failed to delete member. Please try again.");
          });
      },
      onCancel() {
        console.log("Cancel");
      },
      className: darkTheme ? "dark-modal" : "",
    });
  };

  const handleAddMember = () => {
    setVisible(true);
    setMemberId("");
    form.resetFields();
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
    setMemberId("");
  };

  const handleCreate = async (values) => {
    try {
      if (memberId) {
        await apiClient.put(`/members/${memberId}`, values);
        message.success("Member details updated.");
      } else {
        const response = await apiClient.post("/members", {
          ...values,
          points: 0,
        });
        await apiClient.post(`/transactions`, {
          member_id: response.data.data.member_id,
          name: values.name,
          points_updated: values.points,
          description: "Added new member",
          updated_by: username,
          status: "success",
          type: "credit",
        });
        message.success("Member added and transaction logged successfully.");
      }
      setVisible(false);
      form.resetFields();
      setMemberId("");
      const response = await apiClient.get("/members");
      setMembers(response.data);
    } catch (error) {
      message.error("Failed to perform action. Please try again.");
    }
  };

  const columns = [
    {
      title: "Member ID",
      dataIndex: "member_id",
      key: "member_id",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      responsive: ["xs", "sm", "md", "lg"],
      sorter: (a, b) => a.points - b.points,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Action",
      key: "action",
      responsive: ["xs", "sm", "md", "lg"],
      render: (text, record) => (
        <Space size="middle">
          <Tooltip color="black" title="Delete member">
            <DeleteOutlined onClick={() => handleDelete(record.member_id)} />
          </Tooltip>
          <Tooltip color="black" title="Update member details">
            <EditOutlined onClick={() => handleUpdate(record.member_id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "50px" }}>
      <Input.Search
        placeholder="Search members"
        onChange={handleSearch}
        style={{ width: 250, float: "right", marginBottom: "10px" }}
      />
      <Button
        className="member-btn"
        type="primary"
        onClick={handleAddMember}
        style={{ marginBottom: "30px" }}
      >
        Add New Member
      </Button>
      <Table
        columns={columns}
        dataSource={members}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 4 }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={memberId ? "Update Member Details" : "Add New Member"}
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {memberId ? "Update" : "Create"}
          </Button>,
        ]}
        className={darkTheme ? "dark-modal" : ""}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          {!memberId && (
            <Form.Item
              name="member_id"
              label="Member ID"
              rules={[{ required: true, message: "Please enter member ID" }]}
            >
              <Input placeholder="Enter member ID" />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter member name" }]}
          >
            <Input placeholder="Enter member name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter member email" }]}
          >
            <Input placeholder="Enter member email" />
          </Form.Item>
          <Form.Item
            name="points"
            label="Points"
            rules={[
              {
                required: true,
                message: "Please enter points",
              },
              {
                pattern: /^[0-9]*$/,
                message: "Points should only contain numbers",
              },
            ]}
          >
            <Input disabled={memberId} placeholder="Enter the points" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddMemberForm;
