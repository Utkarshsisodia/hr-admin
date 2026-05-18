import { useTable, EditButton, DeleteButton, List } from "@refinedev/antd";
import { Table, Space } from "antd";

export const EmployeeList = () => {
  const { tableProps } = useTable({
    resource: "employees",
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="first_name" title="First Name" />
        <Table.Column dataIndex="last_name" title="Last Name" />
        <Table.Column dataIndex="department" title="Department" />
        <Table.Column dataIndex="role" title="Role" />
        
        {/* THIS IS THE NEW COLUMN TO ADD */}
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              {/* Refine knows automatically to link this to your edit page */}
              <EditButton hideText size="small" recordItemId={record.id} />
              
              {/* Refine handles the delete API call automatically */}
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};