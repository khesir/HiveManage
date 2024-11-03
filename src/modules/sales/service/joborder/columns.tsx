import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {JobOrderWithDetails} from '../../_components/validation/joborder';
import {EmployeeAvatarCircles} from '@/components/ui/avatarcircles';

export const columns: ColumnDef<JobOrderWithDetails>[] = [
	{
		accessorKey: 'uuid',
		header: 'UUID',
	},
	{
		accessorKey: 'joborder_type.name',
		header: 'Joborder Type',
	},
	{
		accessorKey: 'joborder_status',
		header: 'Status',
	},
	{
		id: 'joborder_assign',
		header: 'Assigned',
		cell: ({row}) => {
			return (
				<EmployeeAvatarCircles
					employees={row.original.joborder_assign.map((data) => data.employee)}
					isTable={true}
				/>
			);
		},
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
