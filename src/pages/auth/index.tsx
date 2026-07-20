import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title="HR Admin Portal"
      formProps={{
        initialValues: {
          email: "admin@test.com",
          password: "password", // Make sure this matches what you set!
        },
      }}
    />
  );
};