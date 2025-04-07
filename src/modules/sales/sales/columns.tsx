import {dateParser} from '@/lib/util/utils';
import {ColumnDef, Row} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Sales} from '@/components/validation/sales';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';
import {File} from 'lucide-react';

const ActionCell = (data: Sales) => {
	const navigate = useNavigate();
	return (
		<div className="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button onClick={() => navigate(`view/${data.sales_id}`)}>
							<File />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>View More</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};
export const columns: ColumnDef<Sales>[] = [
	{
		accessorKey: 'sales_id',
		header: 'ID',
	},
	{
		id: 'Fullname',
		cell: ({row}) => {
			return (
				<>
					{row.original.customer &&
					Object.keys(row.original.customer).length !== 0
						? `${row.original.customer?.firstname} ${row.original.customer?.middlename} ${row.original.customer?.lastname}`
						: 'No Selected Customer'}
				</>
			);
		},
	},
	{
		accessorKey: 'service_status',
		header: 'Status',
		cell: ({row}) => {
			return <Badge>{row.original.status}</Badge>;
		},
	},
	{
		accessorKey: 'product_sold',
		header: 'Product Sold',
	},
	{
		accessorKey: 'total_price',
		header: 'Total Price',
	},
	{
		accessorKey: 'handled_by',
		header: 'Handled by',
		cell: ({row}) => {
			return (
				<AvatarCircles
					avatar={[
						{
							link:
								typeof row.original.employee?.profile_link === 'string'
									? row.original.employee?.profile_link
									: '',
							name: row.original.employee?.firstname ?? '',
						},
					]}
				/>
			);
		},
	},
	{
		accessorKey: 'Created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.last_updated ?? ''),
	},
	{
		header: 'Action',
		cell: ({row}: {row: Row<Sales>}) => {
			return (
				<>
					<ActionCell {...row.original} />
				</>
			);
		},
	},
];
