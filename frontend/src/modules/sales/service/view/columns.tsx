import {ColumnDef, Row} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {Service} from '@/components/validation/service';
import {Badge} from '@/components/ui/badge';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {useNavigate} from 'react-router-dom';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';
const ActionCell = (data: Service) => {
	const navigate = useNavigate();
	return (
		<div className="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button onClick={() => navigate(`services/${data.service_id}`)}>
							View
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>View Service</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
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
	{
		header: 'Action',
		cell: ({row}: {row: Row<Service>}) => <ActionCell {...row.original} />,
	},
];
