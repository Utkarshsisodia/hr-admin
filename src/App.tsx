import { Refine } from "@refinedev/core";

import { useNotificationProvider, AuthPage } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { liveProvider } from "@refinedev/supabase";
import { App as AntdApp, ConfigProvider, theme as antdTheme } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";
import React, { useState, createContext, useMemo } from "react";

export const ThemeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

import authProvider from "./providers/auth";
import { dataProvider } from "./providers/data";
import { supabaseClient } from "./providers/supabase-client";
import { EmployeeList } from "./pages/employees/list";
import { ThemedLayout } from "@refinedev/antd";
import { Outlet } from "react-router";
import { Header } from "./components/header";
import { EmployeeCreate } from "./pages/employees/create";
import { EmployeeEdit } from "./pages/employees/edit";
import { Authenticated } from "@refinedev/core";
import { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import { Login } from "./pages/auth";
import { AccessControlProvider } from "@refinedev/core";
import { LeaveList } from "./pages/leaves/list";
import { LeaveCreate } from "./pages/leaves/create";
import { Dashboard } from "./pages/dashboard";
import { DashboardOutlined } from "@ant-design/icons";

const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    // 1. Get the cached role (which we optimized in the last step!)
    const role = await authProvider.getPermissions?.();

    // 2. Protect the Employees resource
    if (resource === "employees") {
      if (["create", "edit", "delete"].includes(action)) {
        return {
          can: role === "admin",
          reason: "Only HR Administrators can modify employee records.",
        };
      }
    }

    // 3. NEW: Protect the Leave Requests resource
    if (resource === "leave_requests") {
      // Only admins can approve, reject, or delete leaves
      if (["approve_reject", "delete"].includes(action)) {
        return {
          can: role === "admin",
          reason: "Only HR Administrators can approve or reject leaves.",
        };
      }
    }

    // 4. Allow 'list', 'show', and 'create' for everyone (so employees can request leaves!)
    return { can: true };
  },
};

function App() {
  const [mode, setMode] = useState("light");
  const toggleMode = () => setMode(m => m === "light" ? "dark" : "light");
  const { defaultAlgorithm, darkAlgorithm } = antdTheme;

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ mode, toggleMode }}>
        <ConfigProvider theme={{ algorithm: mode === "light" ? defaultAlgorithm : darkAlgorithm }}>
          <AntdApp>
        <Refine
          dataProvider={dataProvider}
          liveProvider={liveProvider(supabaseClient)}
          authProvider={authProvider}
          routerProvider={routerProvider}
          accessControlProvider={accessControlProvider}
          resources={[
            {
              name: "dashboard",
              list: "/",
              meta: {
                label: "Dashboard",
                icon: <DashboardOutlined />, // Import this from @ant-design/icons!
              },
            },
            {
              name: "employees",
              list: "/employees",
              create: "/employees/create",
              edit: "/employees/edit/:id",
            },
            {
              name: "leave_requests",
              list: "/leaves",
              create: "/leaves/create",
              meta: { label: "Leave Management" },
            },
          ]}
          notificationProvider={useNotificationProvider}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            projectId: "ooxMh1-0BQBLt-A6BpBM",
          }}
        >
          <Routes>
            {/* 1. UNAUTHENTICATED ROUTES */}
            <Route
              element={
                <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route path="/login" element={<Login />} />
            </Route>

            <Route
              path="/register"
              element={<AuthPage type="register" title="HR Admin Portal" />}
            />

            {/* 2. AUTHENTICATED (PROTECTED) ROUTES */}
            <Route
              element={
                <Authenticated
                  key="authenticated-inner"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <ThemedLayout Header={() => <Header sticky />}>
                    <Outlet />
                  </ThemedLayout>
                </Authenticated>
              }
            >
              {/* Default route redirects to employees */}
              <Route index element={<Dashboard />} />

              <Route path="/employees">
                <Route index element={<EmployeeList />} />
                <Route path="create" element={<EmployeeCreate />} />
                <Route path="edit/:id" element={<EmployeeEdit />} />
              </Route>

              <Route path="/leaves">
                <Route index element={<LeaveList />} />
                <Route path="create" element={<LeaveCreate />} />
              </Route>
            </Route>
          </Routes>
        </Refine>
      </AntdApp>
      </ConfigProvider>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
