import { CloseSquareFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import { GatewayApi } from "@apis";
import { Alert, Button, Card, Checkbox, Flex, Form, Input, Typography } from "antd";
import React from "react";

export const Login: React.FC = () => {
	const [loginErrMessage, setLoginErrMessage] = React.useState<string>();

	const [form] = Form.useForm();

	const handleOnFinish = async (values: any) => {
		const result = await GatewayApi.login({uid: values.uid, pwd: values.pwd})
		
		if (result.result !== 0) {
			setLoginErrMessage("Incorrect username or password.");
			return;
		}
		
		// TODO: redirect
	};

	const handleAlertClose = () => {
		setLoginErrMessage(undefined);
		form.resetFields();
	}

	return (
		<Flex className="h-full" gap="small" justify="center" align="center" vertical>
			<Typography.Title level={3} className="text-center font-bold" >Log in to HELO</Typography.Title>
			{loginErrMessage !== undefined && (
				<Alert type="error" className="w-80" afterClose={handleAlertClose}
					message={loginErrMessage}
					closable={{ 'aria-label': 'close', closeIcon: <CloseSquareFilled /> }}
				/>
			)}
			<Card className="w-80">
				<Form name="login" layout="vertical" form={form} onFinish={handleOnFinish}>
					<Form.Item name="uid" label="Username" rules={[{ required: true, message: "Please input your username!" }]}>
						<Input prefix={<UserOutlined />} autoFocus />
					</Form.Item>
					<Form.Item name="pwd" label="Password" rules={[{ required: true, message: "Please input your password!" }]}>
						<Input.Password prefix={<LockOutlined />} type="password" />
					</Form.Item>
					<Form.Item name="remember" valuePropName="checked">
						<Checkbox>Remember Username</Checkbox>
					</Form.Item>
					<Form.Item>
						<Button block type="primary" htmlType="submit">Log in</Button>
					</Form.Item>
				</Form>
			</Card>
		</Flex>
	);
}