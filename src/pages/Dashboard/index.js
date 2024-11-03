import React, { useState } from "react";
import Routes from "./Routes";
import { Layout, Menu } from "antd";
import { items } from "./SidebarItems";
import { useAuthContext } from "contexts/AuthContext";
import { Button } from "antd";

const { Content, Sider } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const { handleLogout } = useAuthContext();

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
        <Button type="primary" danger onClick={handleLogout}>
          Logout
        </Button>
      </Sider>
      <Layout>
        <Content className="p-3">
          <Routes />
        </Content>
      </Layout>
    </Layout>
  );
}
