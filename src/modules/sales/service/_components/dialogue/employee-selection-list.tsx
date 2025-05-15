import {PaginationResponse, request} from '@/api/axios';
import {useEffect, useState} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {SerialiItemTable} from './employee-selection-table';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';
import {Checkbox} from '@/components/ui/checkbox';
import {EmployeeWithRelatedDetails} from '@/modules/ems/_components/validation/employee';

export const columns: ColumnDef<EmployeeWithRelatedDetails>[] = [
	{
		id: 'select',
		header: ({table}) => (
			<Checkbox
				checked={table.getIsAllRowsSelected()}
				onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
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
		accessorKey: 'employee.employee_id',
		header: 'ID',
	},
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
		cell: ({row}) => dateParser(row?.original?.employee.created_at ?? ''),
	},
];
interface Props {
	onSubmit: () => void;
}
export default function EmployeeList({onSubmit}: Props) {
	const [employees, setEmployees] = useState<EmployeeWithRelatedDetails[]>([]);

	const {isTriggered} = useEventTrigger();
	const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

	useEffect(() => {
		const fetchEmployees = async () => {
			const employeeData = await request<
				PaginationResponse<EmployeeWithRelatedDetails>
			>('GET', `/api/v1/ems/employeeRoles?no_pagination=true`);
			setEmployees(employeeData.data);
		};
		fetchEmployees();
	}, [isTriggered]);

	return (
		<SerialiItemTable
			columns={columns}
			data={employees}
			selectedRowIds={selectedRows}
			onRowSelectionChange={setSelectedRows}
			onSubmit={onSubmit}
		/>
	);
}
