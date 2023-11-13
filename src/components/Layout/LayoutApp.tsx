import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  SelectOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button} from 'antd';
const { Header, Sider, Content } = Layout;
const LayoutApp = () => {
  const [collapsed, setCollapsed] = useState(false);
  const storedRole = localStorage.getItem('role');
  const role: boolean = storedRole ? storedRole === 'true' : false;
  const navigator = useNavigate()

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigator('/login');
  };
  return (
    <Layout style={{borderRadius:30}}  >
      <Sider 
      style={{  borderTopLeftRadius: 30, borderBottomLeftRadius: 30}} 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      >
        <div className="demo-logo-vertical"  style={{background:'pink'}}/>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
            color: 'white',
            marginLeft: 9,
          }}
        />
        <Menu
          onClick={({ key }) => {
            if (key === 'logout') {
              handleLogout();
            } else {
              navigator(key);
            }
          }}
          theme= 'dark'
          mode="inline"

          items={[
            {
              key: (role === true) ? '/home' : '/',
              icon: <HomeOutlined />,
              label: 'Home',

            },
            {
              key: '/employeesmanager',
              icon: <UserOutlined />,
              label: 'Employees Manager',

            },
            {
              key: '/bookingmanagement',
              icon: <SelectOutlined />,
              label: 'Booking Management',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Logout',
            },
          ]}
        />
      </Sider>
      <Layout style={{borderTopRightRadius:30, borderBottomRightRadius:30, background:'#69b1ff'}} >
        {/* <Header 
          style={{
            padding: 0,
            background: 'dark',
            borderTopRightRadius: 30
          }}
        >
          <p style={{ color: 'white', fontSize: 20, marginLeft: 24, marginTop: 0 }}>
            <b>Website booking room meeting</b>
          </p>
        </Header> */}
        <Content
          style={{
            margin: 16,
            padding: 24,
            minHeight: 670,
            background: 'white',
            borderBottomRightRadius: 30,
            borderTopRightRadius: 30
            // opacity: '0.8'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutApp;