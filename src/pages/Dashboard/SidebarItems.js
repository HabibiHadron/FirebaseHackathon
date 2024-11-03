import { HomeOutlined, TeamOutlined, UserOutlined, SettingOutlined, SecurityScanOutlined, UnorderedListOutlined, PlusOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"

export const items = [
    { key: "home", icon: <HomeOutlined />, label: <Link to="/dashboard">Home</Link> },
    { key: "users", icon: <TeamOutlined />, label: <Link to="/dashboard/users">Users</Link> },
    {
        key: "todos", icon: <UnorderedListOutlined />, label: "Todos",
        children: [
            { key: "todos-add", icon: <PlusOutlined />, label: <Link to="/dashboard/todos/add">Add</Link> },
            { key: "todos-all", icon: <UnorderedListOutlined />, label: <Link to="/dashboard/todos/all">All</Link> },
        ]
    },
    {
        key: "settings", icon: <SettingOutlined />, label: "Settings",
        children: [
            { key: "settings-account", icon: <SecurityScanOutlined />, label: <Link to="/dashboard/settings/account">Account</Link> },
            { key: "settings-profile", icon: <UserOutlined />, label: <Link to="/dashboard/settings/profile">Profile</Link> },
        ]
    },
]