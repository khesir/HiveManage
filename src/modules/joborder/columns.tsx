import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {EmployeeAvatarCircles} from '@/components/ui/avatarcircles';
import {Badge} from '@/components/ui/badge';
import {useLocation, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {JobOrderWithDetails} from './_components/validation/joborder';
import {useJoborderStore} from '../sales/_components/hooks/use-joborder-store';

export const getColumns = (
	showAction: boolean,
): ColumnDef<JobOrderWithDetails>[] => [
	{
		accessorKey: 'uuid',
		header: 'UUID',
	},
	{
		id: 'joborder_status',
		header: 'Status',
		cell: ({row}) => {
			const data = row.original;
			const statusClass =
				data.joborder_status === 'Cancelled'
					? 'bg-red-400'
					: data.joborder_status === 'Completed'
						? 'bg-green-400'
						: data.joborder_status === 'On Hold'
							? 'bg-orange-400'
							: data.joborder_status === 'Approved'
								? 'bg-green-400'
								: '';

			return (
				<Badge className={`w-full justify-center ${statusClass}`}>
					{data.joborder_status}
				</Badge>
			);
		},
	},
	{
		id: 'joborder_type',
		header: 'Type',
		cell: ({row}) => (
			<div className="grid grid-cols-1 gap-2 w-[200px]">
				{row.original.joborder_type.map((type) => (
					<Badge
						key={type.joborder_service_id}
						className="w-full justify-center"
					>
						{type.joborder_type.name}
					</Badge>
				))}
			</div>
		),
	},
	{
		id: 'joborder_assign',
		header: 'Assigned',
		cell: ({row}) => (
			<EmployeeAvatarCircles
				employees={row.original.joborder_assign.map((data) => data.employee)}
				isTable={true}
			/>
		),
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
	...(showAction
		? [
				{
					id: 'action',
					cell: ({row}: {row: {original: JobOrderWithDetails}}) => (
						<ActionsCell {...row.original} />
					),
				},
			]
		: []),
];

const ActionsCell = (data: JobOrderWithDetails) => {
	const {setJoborderData} = useJoborderStore();
	const navigate = useNavigate();
	const location = useLocation();
	const handleClick = (service_id: number) => {
		const id = Number(service_id);
		if (location.pathname.startsWith('/sales')) {
			navigate(`/sales/services/view/${id}`);
		} else if (location.pathname.startsWith('/admin')) {
			navigate(`/admin/sales/services/view/${id}`);
		} else if (location.pathname.startsWith('/tech')) {
			navigate(`/tech/services/view/${id}`);
		}
		setJoborderData(data);
	};

	return <Button onClick={() => handleClick(data.joborder_id)}>View</Button>;
};
