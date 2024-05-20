import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { faHome, faMoneyCheckAlt, faHistory } from "@fortawesome/free-solid-svg-icons";
import { Button, Layout, Menu, theme } from "antd";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./logo.svg";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import TransactionHistory from "./components/TransactionHistory";

const { Header, Sider, Content } = Layout;


const MainLayout = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          {!collapsed && <span className="app-name">Mobilytix Rewards</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
        >
          <Menu.Item key="1" icon={<FontAwesomeIcon icon={faHome} />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FontAwesomeIcon icon={faMoneyCheckAlt} />}>
            <Link to="/transaction-form">Transaction Form</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FontAwesomeIcon icon={faHistory} />}>
            <Link to="/transaction-history">Transaction History</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
          title="Loyalty Management"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Button onClick={handleLogout}>Logout</Button>
          Loyalty Management
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transaction-form" element={<TransactionForm />} />
            <Route path="/transaction-history" element={<TransactionHistory />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;