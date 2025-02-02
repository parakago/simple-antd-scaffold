import { AppApi, AppUtil, IRole } from '@apis';
import { Card, Table, TableProps, Tag, Input, Space, Button, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import type { GetProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

type SearchProps = GetProps<typeof Input.Search>;

const TAG_KIND_COLOR_MAP: {[key: string]: string} = {
	system: 'red',
	custom: 'geekblue'
}

const TAG_COLORS = ['magenta', 'purple', 'lime', 'gold', 'volcano', 'green', 'orange', 'cyan'];

export const RolePage: React.FC = () => {
	const [roles, setRoles] = useState<IRole[]>([]);

	const columns: TableProps<IRole>['columns'] = [
		{ dataIndex: 'name', title: 'Name' },
		{ dataIndex: 'tags', title: 'Tags', render: (_, { tags }) => (
			<>
				{(tags ?? []).map((tag, idx) => {
					let color: string = TAG_KIND_COLOR_MAP[tag];
					if (color === undefined) {
						color = TAG_COLORS[idx % TAG_COLORS.length];
					}
					return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
				})}
			</>
		)},
		{ dataIndex: 'description', title: 'Description' }
	];

	const handleOnSearch: SearchProps['onSearch'] = async (value) => {
		const roles = (await AppApi.getRoles()).filter(role => 
			AppUtil.isEmpty(value) || AppUtil.contains(role.name, value) || AppUtil.contains(role.description?? '', value)
		);
		setRoles(roles);
	}

	useEffect(() => {
		handleOnSearch('');
	}, []);

	return (
		<Card className='w-full'>
			<Space className='w-full' direction='vertical'>
				<Space>
					<Button type="primary" icon={<PlusOutlined />}>Add New Role</Button>
					<Input.Search style={{width: '448px'}} placeholder='Search Role' allowClear onSearch={handleOnSearch} />
				</Space>
				<Table<IRole> rowKey='id' columns={columns} dataSource={roles} />
			</Space>
		</Card>
	);
}