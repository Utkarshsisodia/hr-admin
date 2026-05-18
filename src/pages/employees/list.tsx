import { useTable, EditButton, List } from "@refinedev/antd";
import { Table, Space } from "antd";

export const EmployeeList = () => {
  // 1. useTable magically talks to Supabase and gets your data
  const { tableProps } = useTable({
    resource: "employees", // This must match your Supabase table name!
  });

  // 2. We pass tableProps directly to the Ant Design Table
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="first_name" title="First Name" />
        <Table.Column dataIndex="last_name" title="Last Name" />
        <Table.Column dataIndex="department" title="Department" />
        <Table.Column dataIndex="role" title="Role" />
      </Table>

      <Table.Column
        title="Actions"
        dataIndex="actions"
        render={(_, record) => (
          <Space>
            <EditButton hideText size="small" recordItemId={record.id} />
          </Space>
        )}
      ></Table.Column>
    </List>
  );
};
