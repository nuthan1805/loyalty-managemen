import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { faHome, faMoneyCheckAlt, faHistory } from "@fortawesome/free-solid-svg-icons";
import { Button, Layout, Menu, theme, Dropdown, Modal } from "antd";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import logo from "./logo.svg";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import AddMemberForm from "./components/AddMemberForm";
import OperationContent from "./components/OperationContent";
import TransactionHistory from "./components/TransactionHistory";

const { Header, Sider, Content } = Layout;

const MainLayout = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email'); 
    onLogout();
    navigate('/login');
  };

  const showLogoutConfirmation = () => {
    Modal.confirm({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      onOk: handleLogout,
      onCancel: () => {},
    });
  };

  const getPathnameKey = () => {
    const pathname = location.pathname;
    if (pathname === "/") return "1";
    if (pathname === "/transaction-form") return "2";
    if (pathname === "/transaction-history") return "3";
    if (pathname === "/add-member") return "4";
    if (pathname === "/operation") return "5";
    return "/";
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={showLogoutConfirmation}>
        <LogoutOutlined />
        <span style={{ marginLeft: '10px' }}>Logout</span>
      </Menu.Item>
    </Menu>
  );

  const pathToTitle = {
    "/": "Dashboard",
    "/transaction-form": "Transaction Form",
    "/transaction-history": "Transaction History",
    "/add-member": "Add Member",
    "/operation": "Operation",
  };

  const currentTitle = pathToTitle[location.pathname] || "Loyalty Management";

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
          defaultSelectedKeys={[getPathnameKey()]}
        >
          <Menu.Item key="1" icon={<FontAwesomeIcon icon={faHome} />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu key="2" icon={<FontAwesomeIcon icon={faMoneyCheckAlt} />} title="Transaction Form">
            <Menu.Item key="4">
              <Link to="/add-member">Add Member</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/operation">Operation</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="3" icon={<FontAwesomeIcon icon={faHistory} />}>
            <Link to="/transaction-history">Transaction History</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: colorBgContainer,
            padding: '0 24px',
          }}
        >
          <div>
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
            <span style={{ marginLeft: '10px', color: 'black', fontSize:'25px', fontWeight:'700' }}>{currentTitle}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown overlay={profileMenu} trigger={['hover']}>
              <Button icon={<UserOutlined />} />
            </Dropdown>
            <span style={{ marginLeft: '10px', color: 'black' }}>{username}</span>
          </div>
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
            <Route path="/add-member" element={<AddMemberForm />} />
            <Route path="/operation" element={<OperationContent />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
