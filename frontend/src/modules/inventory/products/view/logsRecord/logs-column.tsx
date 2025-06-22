import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {ProductLogs} from '@/components/interface/logs';
import {AvatarCircles} from '@/components/ui/avatarcircles';
export const columns: ColumnDef<ProductLogs>[] = [
	{
		header: 'Handled By',
		cell: ({row}) => {
			return (
				<div className="flex gap-3 items-center">
					<AvatarCircles
						avatar={[
							{
								link:
									typeof row.original.performed_by?.profile_link === 'string'
										? row.original.performed_by?.profile_link
										: '',
								name: row.original.performed_by?.firstname ?? '',
							},
						]}
					/>
					<span>{`${row.original.performed_by.firstname} ${row.original.performed_by.lastname}`}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'action',
		header: 'Action',
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? '', true),
	},
];
