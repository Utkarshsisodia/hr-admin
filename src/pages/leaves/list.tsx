import {
  useTable,
  List,
  DeleteButton,
  DateField,
  TagField,
} from "@refinedev/antd";
import { useMany, useUpdate, CanAccess } from "@refinedev/core";
import { Table, Space, Button } from "antd";

// 1. Define strict TypeScript interfaces (No more 'any' hacks)
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

export const LeaveList = () => {
  // 2. Pass the interface to useTable so it knows what data the table holds
  const { tableProps } = useTable<ILeaveRequest>({
    resource: "leave_requests",
  });

  const { mutate } = useUpdate();

  // Extract unique employee IDs safely
  const employeeIds =
    tableProps?.dataSource?.map((item) => item.employee_id).filter(Boolean) ??
    [];

  // 3. Pass the interface to useMany. This completely fixes the 'data'/'isLoading' TS errors
  const { query } = useMany<IEmployee>({
    resource: "employees",
    ids: employeeIds,
    queryOptions: {
      enabled: employeeIds.length > 0,
    },
  });
  const employeesData = query.data;
  const employeesLoading = query.isLoading;

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="employee_id"
          title="Employee"
          render={(value: string) => {
            if (employeesLoading) return "Loading...";

            // 4. Strongly type 'item' in the find method
            const employee = employeesData?.data?.find(
              (item: IEmployee) => item.id === value,
            );
            return employee
              ? `${employee.first_name} ${employee.last_name}`
              : "Unknown";
          }}
        />

        <Table.Column
          dataIndex="leave_type"
          title="Type"
          render={(value: string) => (
            <span style={{ textTransform: "capitalize" }}>{value}</span>
          )}
        />

        <Table.Column
          dataIndex="status"
          title="Status"
          render={(status: string) => {
            let color = "orange";
            if (status === "approved") color = "green";
            if (status === "rejected") color = "red";
            return <TagField color={color} value={status?.toUpperCase()} />;
          }}
        />

        <Table.Column
          dataIndex="start_date"
          title="Start Date"
          render={(value: string) => (
            <DateField value={value} format="MMM DD, YYYY" />
          )}
        />

        <Table.Column
          dataIndex="end_date"
          title="End Date"
          render={(value: string) => (
            <DateField value={value} format="MMM DD, YYYY" />
          )}
        />

        <Table.Column
          title="Actions"
          render={(_, record: ILeaveRequest) => (
            <Space>
              
              {/* Only show these if the user passes the "approve_reject" check in App.tsx */}
              <CanAccess
                resource="leave_requests"
                action="approve_reject"
                fallback={null} // If they aren't an admin, render nothing here
              >
                {record.status === "pending" && (
                  <>
                    <Button 
                      size="small" 
                      type="primary" 
                      style={{ backgroundColor: "#52c41a" }}
                      onClick={() => mutate({
                        resource: "leave_requests",
                        id: record.id,
                        values: { status: "approved" },
                      })}
                    >
                      Approve
                    </Button>
                    <Button 
                      size="small" 
                      danger 
                      onClick={() => mutate({
                        resource: "leave_requests",
                        id: record.id,
                        values: { status: "rejected" },
                      })}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </CanAccess>

              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
