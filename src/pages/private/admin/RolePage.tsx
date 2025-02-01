import { AppApi, IRole } from '@apis';
import { Card, Table, TableProps, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

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

	useEffect(() => {
		(async () => {
			setRoles(await AppApi.roles());
		})();
	}, []);
	
	return (
		<Card className='w-full'>
			<Table<IRole> rowKey='id' columns={columns} dataSource={roles} />
		</Card>
	);
}