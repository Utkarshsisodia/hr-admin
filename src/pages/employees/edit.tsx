import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const EmployeeEdit = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Department" name="department">
          <Input />
        </Form.Item>
        <Form.Item label="Role" name="role">
          <Select
            options={[
              { label: "Employee", value: "employee" },
              { label: "Manager", value: "manager" },
              { label: "Admin", value: "admin" },
            ]}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};