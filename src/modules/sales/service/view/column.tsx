import {ColumnDef, Row} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {Ticket} from '@/components/validation/tickets';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Badge} from '@/components/ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {TicketSheetList} from './sheet/ticket-sheet';

const ActionCell = (data: Ticket) => {
	return (
		<div className="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<TicketSheetList ticket={data} />
					</TooltipTrigger>
					<TooltipContent>
						<p>View Ticket</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
export const columns: ColumnDef<Ticket>[] = [
	{
		accessorKey: 'ticket_id',
		header: 'ID',
	},
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		header: 'Status',
		cell: ({row}) => {
			return <Badge>{row.original?.ticket_status ?? 'N/A'}</Badge>;
		},
	},
	{
		header: 'Type',
		cell: ({row}) => {
			return <p>{row.original?.ticket_type?.name ?? 'N/A'}</p>;
		},
	},
	{
		accessorKey: 'deadline',
		header: 'Deadline',
		cell: ({row}) => new Date(row.original.deadline ?? '').toLocaleDateString(),
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
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
	{
		header: 'Action',
		cell: ({row}: {row: Row<Ticket>}) => <ActionCell {...row.original} />,
	},
];
