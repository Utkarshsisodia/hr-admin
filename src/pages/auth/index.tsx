import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title="HR Admin Portal"
      formProps={{
        initialValues: {
          email: "admin@demo.com",
          password: "password", // You can remove these later, just helpful for testing!
        },
      }}
    />
  );
};