import { CloseSquareFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import { AppApi, AppUtil } from "@apis";
import { App } from "@contexts";
import { Alert, Button, Card, Checkbox, Flex, Form, Input, Typography } from "antd";
import React from "react";
import { translate as t } from "react-i18nify";
import { useLocation } from "react-router-dom";

export const Login: React.FC = () => {
	const [loginErrMessage, setLoginErrMessage] = React.useState<string>();
	const [form] = Form.useForm();

	let redirectPath = AppUtil.nvl(useLocation().state?.redirectPath); // only from handleError in AppErrorBoundary.tsx
	if (redirectPath === '') {
		redirectPath = AppApi.DEFAULT_WEB_PATH;
	}

	const handleOnFinish = async (values: any) => {
		const result = await AppApi.login({uid: values.uid, pwd: values.pwd})
		
		if (result.result !== 0) {
			setLoginErrMessage("Incorrect username or password.");
			return;
		}
		
		App.navigate(redirectPath, { state: undefined, replace: true });
	};

	const handleOnAlertClose = () => {
		setLoginErrMessage(undefined);
		form.resetFields();
	}

	return (
		<Flex className="h-full" gap="small" justify="center" align="center" vertical>
			<Typography.Title level={3} className="text-center font-bold" >
				{t("app.title")}
			</Typography.Title>
			{loginErrMessage !== undefined && (
				<Alert type="error" className="w-80" afterClose={handleOnAlertClose}
					message={loginErrMessage}
					closable={{ 'aria-label': 'close', closeIcon: <CloseSquareFilled /> }}
				/>
			)}
			<Card className="w-80">
				<Form name="login" layout="vertical" form={form} onFinish={handleOnFinish} initialValues={{uid: "gdhong", pwd: "gdhong"}}>
					<Form.Item name="uid"
						label={t("com.uid")} 
						rules={[{ required: true, message: t("page.login.requireUid") }]}
					>
						<Input prefix={<UserOutlined />} autoFocus />
					</Form.Item>
					<Form.Item name="pwd" 
						label={t("com.pwd")}
						rules={[{ required: true, message: t("page.login.requirePwd") }]}
					>
						<Input.Password prefix={<LockOutlined />} type="password" />
					</Form.Item>
					<Form.Item name="rememberUid" valuePropName="checked">
						<Checkbox>{t("page.login.rememberUid")}</Checkbox>
					</Form.Item>
					<Form.Item>
						<Button block type="primary" htmlType="submit">{t("com.login")}</Button>
					</Form.Item>
				</Form>
			</Card>
		</Flex>
	);
}