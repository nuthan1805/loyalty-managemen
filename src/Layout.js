import React, { useState, useEffect, useCallback, useRef } from "react";
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
  ConfigProvider,
  Tour,
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
import profileImage from "./assets/profile.svg";
import apiClient from "./apiClient";

const { Header, Sider, Content } = Layout;

const MainLayout = ({ onLogout }) => {
  const ref1 = useRef(null);
  const refDashboard = useRef(null);
  const refTransactionForm = useRef(null);
  const refTransactionHistory = useRef(null);
  const refBellIcon = useRef(null);
  const refAvatarProfile = useRef(null);

  const [collapsed, setCollapsed] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [hideDescription, setHideDescription] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("loginStatus");
    onLogout();
    navigate("/login");
  }, [navigate, onLogout]);

  const showLogoutConfirmation = () => {
    Modal.confirm({
      title: "Logout",
      content: "Are you sure you want to logout?",
      className: darkTheme ? "dark-modal" : "",
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
    <Menu className={darkTheme? 'profile':''}>
      {isMobileView && (
        <>
          <Menu.Item key="notifications">
            <Tooltip title="No notifications yet">
              <FontAwesomeIcon
                icon={faBell}
                style={{
                  marginRight: "10px",
                  fontSize: "16px",
                }}
              />
              Notifications
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="username">
            <UserOutlined />
            <span style={{ marginLeft: "10px" }}>{username}</span>
          </Menu.Item>
        </>
      )}
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
    "/transaction-history": "Transactions",
    "/add-member": "Manage Member",
    "/operation": "Points Operation",
  };

  const pathToDescription = {
    "/": "Get insights, track progress, and manage tasks efficiently.",
    "/transaction-form": "Initiate, record, and manage transactions seamlessly",
    "/transaction-history":
      "View detailed logs of all past transactions and activities.",
    "/add-member": "Efficiently add, update, or remove members as needed.",
    "/operation":
      "Update points effortlessly with credit or debit transactions.",
  };

  const currentTitle = pathToTitle[location.pathname] || "Loyalty Management";
  const currentDescription = pathToDescription[location.pathname] || "";

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const handleResize = () => {
      if (window.innerWidth < 800) {
        setCollapsed(true);
        setIsTourOpen(false)
      } else {
        setCollapsed(false);
        setIsTourOpen(true);
      }

      if (window.innerWidth < 671) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }

      if (window.innerWidth < 800) {
        setHideDescription(true);
      } else {
        setHideDescription(false);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const setLogoutTimeout = () => {
      clearTimeout(window.inactivityTimeout);
      window.inactivityTimeout = setTimeout(() => {
        handleLogout();
      }, 15 * 60 * 1000); 
    };

    const resetInactivityTimer = () => {
      setLogoutTimeout();
    };

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);

    setLogoutTimeout();

    return () => {
      clearTimeout(window.inactivityTimeout);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
    };
  }, [handleLogout]);

  useEffect(() => {
    try {
      const storedLoginStatus = localStorage.getItem("loginStatus");

      if (storedLoginStatus === "0" || storedLoginStatus === "1") {
        setIsTourOpen(true);
        console.log("Opening tour...", storedLoginStatus);
      } else {
        setIsTourOpen(false);
        console.log("Tour remains closed.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, []);

  const handleCloseTour = () => {
    localStorage.setItem("loginStatus", "2");
    setIsTourOpen(false);
  };

  const tourSteps = [
    {
      title: "Dashboard",
      description: " Your go-to for real-time metrics and insights, helping you make informed decisions and track progress towards goals.",
      target: () => refDashboard.current,
    },
    {
      title: "Toggle Sidebar",
      description: "Customize your navigation experience with a simple click, maximizing screen space or accessing sections quickly.",
      target: () => ref1.current,
    },
    {
      title: "Transaction Form",
      description: "This is where you can credit or debit points for members and update their details hassle-free. It's like managing a digital piggy bank, keeping track of who gets what, all with a few clicks.",
      target: () => refTransactionForm.current,
    },
    {
      title: "Transaction History",
      description: " Access member specific transaction records for detailed analysis.",
      target: () => refTransactionHistory.current,
    },
    {
      title: "Notifications",
      description: "Stay informed with timely alerts about important events and updates within your digital ecosystem.",
      target: () => refBellIcon.current,
    },
    {
      title: "User Profile",
      description: "Choose between the soothing darkness of dark mode or the clarity of light mode to tailor your viewing experience. Once you're done, securely log out, knowing your preferences are saved for next time. It's your profile, your style.",
      target: () => refAvatarProfile.current,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgBase: darkTheme ? "#001529" : "#FBFBFB",
          colorTextBase: darkTheme ? "#FFFFFF" : "#000000",
          colorBgContainer: darkTheme ? "#001529" : "#FFFFFF",
          colorBgLayout :darkTheme ? "#001529" : "#FFFFFF",
        },
        components: {
          Modal: {
            colorBgElevated: darkTheme ? "#001529" : "#FFFFFF",
          },
          Dropdown: {
            colorBgElevated: darkTheme ? "#001529" : "#FFFFFF",
          },
          Card:{
            colorBgElevated: darkTheme ? "#001529" : "#FFFFFF",
          },
          Form: {
            colorBgElevated: darkTheme ? "#001529" : "#FFFFFF",
          }
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          style={{
            borderRight: darkTheme ? "1px solid #ECECEC" : "1px solid #ECECEC",
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
              <Link ref={refDashboard} to="/">
                Dashboard
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link className="txnFormSubMenu" ref={refTransactionForm}>
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
              </Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<FontAwesomeIcon icon={faHistory} />}>
              <Link ref={refTransactionHistory} to="/transaction-history">
                Transaction History
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: darkTheme ? "#001529" : "#FBFBFB",
              padding: "0 24px",
              position: "fixed",
              zIndex: "5",
              borderBottom: darkTheme
                ? "1px solid #ECECEC"
                : "1px solid #ECECEC",
              width: collapsed ? "calc(100% - 80px)" : "calc(100% - 200px)",
              transition: "0.3s ease",
            }}
          >
            <div>
              <Button
                ref={ref1}
                className="hamburger_menu"
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
                className="manage-title"
                style={{
                  marginLeft: "10px",
                  color: darkTheme ? "#FFFFFF" : "#394054",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                {currentTitle}
              </span>
              <br></br>
              {!hideDescription && (
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
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {!isMobileView && (
                <>
                  <Tooltip color="black" title="No notifications yet">
                    <FontAwesomeIcon
                      icon={faBell}
                      style={{
                        marginRight: "20px",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: darkTheme ? "#FFFFFF" : "#394054",
                      }}
                      className="icon-bell"
                      ref={refBellIcon}
                    />
                  </Tooltip>
                  <Dropdown
                    overlay={profileMenu}
                    trigger={["hover"]}
                    className="avatar-profile"
                  >
                    <Avatar
                      style={{ cursor: "pointer" }}
                      src={profileImage}
                      ref={refAvatarProfile}
                    />
                  </Dropdown>
                  <span
                    style={{
                      marginLeft: "10px",
                      paddingRight: "10px",
                      color: darkTheme ? "#FFFFFF" : "black",
                    }}
                  >
                    {username}
                  </span>
                </>
              )}
              {isMobileView && (
                <Dropdown
                  overlay={profileMenu}
                  trigger={["hover"]}
                  className="avatar-profile"
                >
                  <Avatar
                    style={{ cursor: "pointer" }}
                    src={profileImage}
                    ref={refAvatarProfile}
                  />
                </Dropdown>
              )}
            </div>
          </Header>
          <Content
            style={{
              marginTop: "64px",
              padding: 20,
              minHeight: 280,
              background: darkTheme ? "#001529" : "#FBFBFB",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard darkTheme={darkTheme} />} />
              <Route path="/transaction-form" element={<TransactionForm />} />
              <Route
                path="/transaction-history"
                element={<TransactionHistory />}
              />
              <Route
                path="/add-member"
                element={<AddMemberForm darkTheme={darkTheme} />}
              />
              <Route path="/operation" element={<OperationContent />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>

      <Tour steps={tourSteps} open={isTourOpen} onClose={handleCloseTour} />
    </ConfigProvider>
  );
};

export default MainLayout;
