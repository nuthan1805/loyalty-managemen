import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHome,
  faMoneyCheckAlt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Dropdown,
  Modal,
  Switch,
  Tooltip,
  Avatar,
} from "antd";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import logo from "./assets/comviva_logo.png";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import AddMemberForm from "./components/AddMemberForm";
import OperationContent from "./components/OperationContent";
import TransactionHistory from "./components/TransactionHistory";
import { calc } from "antd/es/theme/internal";
import profileImage from "./assets/profile.svg";

const { Header, Sider, Content } = Layout;

const MainLayout = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
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
    console.log('>>>>>>>>>>>>>>>>>>>logout token',localStorage.removeItem("token"))
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    onLogout();
    navigate("/login");
  };

  const showLogoutConfirmation = () => {
    Modal.confirm({
      title: "Logout",
      content: "Are you sure you want to logout?",
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

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="themeSwitch">
        <Switch size="small" checked={darkTheme} onChange={toggleTheme} />
        <span style={{ marginLeft: "10px" }}>Dark Mode</span>
      </Menu.Item>
      <Menu.Item key="logout" onClick={showLogoutConfirmation}>
        <LogoutOutlined />
        <span style={{ marginLeft: "25px" }}>Logout</span>
      </Menu.Item>
    </Menu>
  );

  const pathToTitle = {
    "/": "Dashboard",
    "/transaction-form": "Transaction Form",
    "/transaction-history": "Transaction History",
    "/add-member": "Manage Member",
    "/operation": "Points Operation",
  };

  const pathToDescription = {
    "/": "Get insights, track progress, and manage tasks efficiently.",
    "/transaction-form": "Initiate, record, and manage transactions seamlessly",
    "/transaction-history":
      "View detailed logs of all past transactions and activities.",
    "/add-member": "Efficiently add, update, or remove team members as needed.",
    "/operation":
      "Update points effortlessly with credit or debit transactions.",
  };

  const currentTitle = pathToTitle[location.pathname] || "Loyalty Management";
  const currentDescription = pathToDescription[location.pathname] || "";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{
          borderRight: "2px solid #ECECEC",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          transition: "0.3s ease",
        }}
        theme={darkTheme ? "dark" : "light"}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="logo-container">
          {collapsed && <img src={logo} alt="Logo" className="logo" />}
          {!collapsed && (
            <span className="app-name">
              <span
                style={{
                  color: "#ED1C24",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                MobiLytix
              </span>
              <span
                style={{
                  color: darkTheme ? "white" : "black",
                  fontSize: "13px",
                }}
              >
                {" "}
                Rewards
              </span>
            </span>
          )}
        </div>
        <Menu
          theme={darkTheme ? "dark" : "light"}
          style={{ fontSize: "13px", border: "none" }}
          defaultSelectedKeys={[getPathnameKey()]}
        >
          <Menu.Item key="1" icon={<FontAwesomeIcon icon={faHome} />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu
            key="2"
            icon={<FontAwesomeIcon icon={faMoneyCheckAlt} />}
            title="Transaction Form"
          >
            <Menu.Item key="4">
              <Link to="/add-member">Manage Member</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/operation">Points Operation</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="3" icon={<FontAwesomeIcon icon={faHistory} />}>
            <Link to="/transaction-history">Transaction History</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#FBFBFB",
            padding: "0 24px",
            position: "fixed",
            zIndex: "5",
            borderBottom: "1px solid #ECECEC",
            width: collapsed ? "calc(100% - 80px)" : "calc(100% - 200px)",
            transition: "0.3s ease",
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

            <span
              style={{
                marginLeft: "10px",
                color: "#394054",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {currentTitle}
            </span>
            <br></br>
            <span
              style={{
                fontSize: "12px",
                position: "absolute",
                marginTop: "-45px",
                marginLeft: "75px",
                color: "#888",
              }}
            >
              {currentDescription}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="No notifications yet">
              <FontAwesomeIcon
                icon={faBell}
                style={{
                  marginRight: "20px",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Dropdown overlay={profileMenu} trigger={["hover"]}>
              <Avatar style={{ cursor: "pointer" }} src={profileImage} />
            </Dropdown>
            <span style={{ marginLeft: "10px", color: "black" }}>
              {username}
            </span>
          </div>
        </Header>
        <Content
          style={{
            marginTop: "64px",
            padding: 20,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transaction-form" element={<TransactionForm />} />
            <Route
              path="/transaction-history"
              element={<TransactionHistory />}
            />
            <Route path="/add-member" element={<AddMemberForm />} />
            <Route path="/operation" element={<OperationContent />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
