import { useList } from "@refinedev/core";
import { Row, Col, Card, Statistic, List as AntdList, Typography, Tag } from "antd";
import { TeamOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";

export interface IEmployee {
  id: string;
  first_name: string;
  last_name: string;
  department?: string;
  role?: string;
  created_at?: string;
}

export interface ILeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at?: string;
}

const { Title, Text } = Typography;

// Colors for our charts
const PIE_COLORS = ["#1890ff", "#52c41a", "#faad14", "#eb2f96", "#722ed1"];
const BAR_COLOR = "#1890ff";

export const Dashboard = () => {
  // 1. Fetch ALL data for aggregation by turning pagination off
  const { query: allEmployeesQuery } = useList<IEmployee>({
    resource: "employees",
    pagination: { mode: "off" }, 
  });

  const { query: allLeavesQuery } = useList<ILeaveRequest>({
    resource: "leave_requests",
    pagination: { mode: "off" },
  });

  const { query: recentLeavesQuery } = useList<ILeaveRequest>({
    resource: "leave_requests",
    sorters: [{ field: "created_at", order: "desc" }],
  });

  const employees = allEmployeesQuery?.data?.data || [];
  const leaves = allLeavesQuery?.data?.data || [];
  const recentLeaves = recentLeavesQuery?.data?.data || [];

  // 2. Data Aggregation for Pie Chart: Count Employees by Department
  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((emp) => {
      const dept = emp.department || "Unassigned";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [employees]);

  // 3. Data Aggregation for Bar Chart: Count Leaves by Type
  const leaveTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    leaves.forEach((leave) => {
      // Capitalize the first letter for the chart labels
      const type = leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1);
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [leaves]);

  // Calculate pending leaves for the top statistic card
  const pendingLeavesCount = leaves.filter((l) => l.status === "pending").length;

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>HR Dashboard</Title>

      {/* --- STATISTIC CARDS --- */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Employees"
              value={employees.length}
              loading={allEmployeesQuery.isLoading}
              prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false}>
            <Statistic
              title="Pending Leave Requests"
              value={pendingLeavesCount}
              loading={allLeavesQuery.isLoading}
              valueStyle={{ color: "#faad14" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card bordered={false}>
            <Statistic
              title="System Status"
              value="All Systems Operational"
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ fontSize: "18px", color: "#52c41a", marginTop: "8px" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        
        {/* Pie Chart: Employees by Department */}
        <Col xs={24} md={12}>
          <Card title="Employees by Department" bordered={false}>
            {allEmployeesQuery.isLoading ? (
              <p>Loading chart...</p>
            ) : (
              // FIX: Wrapped in a div with a strict 300px height
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {departmentData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>

        {/* Bar Chart: Leave Requests by Type */}
        <Col xs={24} md={12}>
          <Card title="Leave Requests by Type" bordered={false}>
            {allLeavesQuery.isLoading ? (
              <p>Loading chart...</p>
            ) : (
              // FIX: Wrapped in a div with a strict 300px height
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveTypeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" fill={BAR_COLOR} radius={[4, 4, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* --- RECENT ACTIVITY SECTION --- */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24}>
          <Card title="Recent Leave Requests" bordered={false}>
            <AntdList
              loading={recentLeavesQuery.isLoading}
              dataSource={recentLeaves}
              renderItem={(item: ILeaveRequest) => (
                <AntdList.Item>
                  <AntdList.Item.Meta
                    title={<Text strong>{item.leave_type?.toUpperCase()} LEAVE</Text>}
                    description={`From ${item.start_date} to ${item.end_date}`}
                  />
                  <div>
                    {item.status === "pending" && <Tag color="orange">PENDING</Tag>}
                    {item.status === "approved" && <Tag color="green">APPROVED</Tag>}
                    {item.status === "rejected" && <Tag color="red">REJECTED</Tag>}
                  </div>
                </AntdList.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};