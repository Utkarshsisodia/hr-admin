import { Create, useForm , useSelect} from "@refinedev/antd";
import { Form, Select, DatePicker, Input } from "antd";

export const LeaveCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  // 🪄 Magic happening here: Fetch employees to populate the dropdown
  const { selectProps: employeeSelectProps } = useSelect({
    resource: "employees",
    optionLabel: "first_name", // What the user sees in the dropdown
    optionValue: "id",         // What gets saved to the database (employee_id uuid)
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        
        <Form.Item 
          label="Employee" 
          name="employee_id" 
          rules={[{ required: true, message: "Please select an employee" }]}
        >
          {/* Inject the fetched data directly into Ant Design's Select */}
          <Select {...employeeSelectProps} placeholder="Select an employee" />
        </Form.Item>

        <Form.Item 
          label="Leave Type" 
          name="leave_type" 
          rules={[{ required: true, message: "Please select a leave type" }]}
        >
          <Select
            options={[
              { label: "Vacation", value: "vacation" },
              { label: "Sick Leave", value: "sick" },
              { label: "Personal", value: "personal" },
            ]}
          />
        </Form.Item>

        <Form.Item 
          label="Start Date" 
          name="start_date" 
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item 
          label="End Date" 
          name="end_date" 
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        {/* Hidden field to set default status to pending */}
        <Form.Item name="status" initialValue="pending" hidden>
          <Input />
        </Form.Item>
        
      </Form>
    </Create>
  );
};