'use client';
import {Checkbox} from '@/components/ui/checkbox';
import {ColumnDef} from '@tanstack/react-table';
import {CellAction} from './cel-action';
import {dateParser} from '@/lib/util/utils';
import {EmployeeBasicInformation} from '@/lib/employee-zod-schema';

export const columns: ColumnDef<EmployeeBasicInformation>[] = [
	{
		id: 'select',
		header: ({table}) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({row}) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		// Custom accessor to combine first_name, middle_name, last_name
		id: 'fullname',
		header: 'NAME',
		accessorFn: (row) =>
			`${row.firstname} ${row.middlename ? row.middlename + ' ' : ''}${row.lastname}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
	{
		accessorKey: 'uuid',
		header: 'UUID',
	},
	{
		accessorKey: 'created_at',
		header: 'Joined',
		cell: ({row}) => dateParser(row.original.created_at),
	},
	{
		id: 'actions',
		cell: ({row}) => <CellAction data={row.original} />,
	},
];
