import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const EmployeeCreate = () => {
  // useForm handles the state, validation, and submission to Supabase automatically!
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[
            {
              required: true,
              message: "Please enter the employee's first name.",
            },
            { whitespace: true, message: "First name cannot be empty." },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[
            { required: true,message:"Please enter the employee's last name." },
            { whitespace: true, message: "Last name cannot be empty." },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Department" name="department">
          <Input />
        </Form.Item>
        <Form.Item label="Role" name="role" initialValue="employee">
          <Select
            options={[
              { label: "Employee", value: "employee" },
              { label: "Manager", value: "manager" },
              { label: "Admin", value: "admin" },
            ]}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
