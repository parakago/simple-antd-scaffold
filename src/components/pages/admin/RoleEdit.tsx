import { Form, Input, Button } from "antd";

export const RoleEdit: React.FC = () => {
	const [form] = Form.useForm();

	return (
		<Form form={form}>
			<Form.Item label="Field A">
				<Input placeholder="input placeholder" />
			</Form.Item>
			<Form.Item label="Field B">
				<Input placeholder="input placeholder" />
			</Form.Item>
			<Form.Item>
				<Button type="primary">Submit</Button>
			</Form.Item>
		</Form>
	);
}