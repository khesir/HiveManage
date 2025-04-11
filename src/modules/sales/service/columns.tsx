import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {Service} from '@/components/validation/service';
import {Badge} from '@/components/ui/badge';
import {AvatarCircles} from '@/components/ui/avatarcircles';

export const columns: ColumnDef<Service>[] = [
	{
		accessorKey: 'uuid',
		header: 'ID',
	},
	{
		accessorKey: 'service_status',
		header: 'Status',
	},
	{
		header: 'Type',
		cell: ({row}) => {
			return <Badge>{row.original.service_type?.name}</Badge>;
		},
	},
	{
		accessorKey: '',
		header: 'Assigned',
		cell: ({row}) => {
			const avatar = (row.original.assigned ?? []).map((row) => ({
				name:
					row.employee?.firstname ??
					'' +
						' ' +
						row.employee?.middlename +
						'' +
						' ' +
						row.employee?.lastname,
				link:
					typeof row.employee?.profile_link === 'string'
						? row.employee.profile_link
						: '',
			}));
			const totalAvatar = avatar.length;
			const numPeople = totalAvatar > 5 ? totalAvatar - 5 : 0;
			return <AvatarCircles numPeople={numPeople} avatar={avatar} />;
		},
	},
	{
		accessorKey: 'total_cost_price',
		header: 'Total Cost',
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
