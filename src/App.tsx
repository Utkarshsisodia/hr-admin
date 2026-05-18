import { GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { liveProvider } from "@refinedev/supabase";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";
import { ColorModeContextProvider } from "./contexts/color-mode";
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

function App() {
  const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    // 1. Get the role
    const role = await authProvider.getPermissions?.();
    
    // DEBUGGING TOOL: Look in your browser console (F12) to see this print out!
    console.log(`Action: ${action}, Resource: ${resource}, User Role: ${role}`);

    // 2. Protect the Employees resource
    if (resource === "employees") {
      // If the action is create, edit, or delete...
      if (["create", "edit", "delete"].includes(action)) {
        return {
          can: role === "admin", // ...only allow if role is EXACTLY 'admin'
          reason: "Only HR Administrators can modify employee records.",
        };
      }
    }

    // 3. Allow 'list' and 'show' for everyone
    return { can: true };
  },
};

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider}
                liveProvider={liveProvider(supabaseClient)}
                authProvider={authProvider}
                routerProvider={routerProvider}
                accessControlProvider={accessControlProvider}
                resources={[
                  {
                    name: "employees",
                    list: "/employees",
                    create: "/employees/create",
                    edit: "/employees/edit/:id",
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
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>

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
                    <Route
                      index
                      element={<NavigateToResource resource="employees" />}
                    />

                    <Route path="/employees">
                      <Route index element={<EmployeeList />} />
                      <Route path="create" element={<EmployeeCreate />} />
                      <Route path="edit/:id" element={<EmployeeEdit />} />
                    </Route>
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
