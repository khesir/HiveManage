import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {EmployeeRolesWithDetails} from '../_components/validation/employeeRoles';
import {Badge} from '@/components/ui/badge';

export const columns: ColumnDef<EmployeeRolesWithDetails>[] = [
	{
		// Custom accessor to combine first_name, middle_name, last_name
		id: 'fullname',
		header: 'Name',
		accessorFn: (row) =>
			`${row.employee.firstname} ${row.employee.middlename ? row.employee.middlename + ' ' : ''}${row.employee.lastname}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({row}) => (
			<Badge
				className={
					row.original.status === 'Online'
						? `bg-green-400 hover:bg-green-400`
						: 'bg-gray-400 hover:bg-gray-400'
				}
			>
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: 'employee.position.name',
		header: 'Position',
	},
	{
		accessorKey: 'role.name',
		header: 'Role',
	},
	{
		accessorKey: 'created_at',
		header: 'Joined',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
