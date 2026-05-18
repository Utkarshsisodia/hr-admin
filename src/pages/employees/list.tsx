import { useTable } from "@refinedev/antd";
import { Table } from "antd";

export const EmployeeList = () => {
  // 1. useTable magically talks to Supabase and gets your data
  const { tableProps } = useTable({
    resource: "employees", // This must match your Supabase table name!
  });

  // 2. We pass tableProps directly to the Ant Design Table
  return (
    <Table {...tableProps} rowKey="id">
      <Table.Column dataIndex="first_name" title="First Name" />
      <Table.Column dataIndex="last_name" title="Last Name" />
      <Table.Column dataIndex="department" title="Department" />
      <Table.Column dataIndex="role" title="Role" />
    </Table>
  );
};