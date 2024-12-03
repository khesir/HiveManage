import {ServiceWithDetails} from '@/lib/sales-zod-schema';
import {dateParser} from '@/lib/util/utils';
import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {useLocation, useNavigate} from 'react-router-dom';
import useServiceFormStore from '@/components/hooks/use-service-store';
import {Badge} from '@/components/ui/badge';

const ActionsCell = (data: ServiceWithDetails) => {
	const {setServiceFormData} = useServiceFormStore();
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
		setServiceFormData(data);
	};

	return <Button onClick={() => handleClick(data.service_id)}>View</Button>;
};

export const columns: ColumnDef<ServiceWithDetails>[] = [
	{
		accessorKey: 'service_id',
		header: 'ID',
	},
	{
		id: 'Fullname',
		header: 'Customer Name',
		accessorFn: (row) =>
			`${row.customer.firstname} ${row.customer.middlename ? row.customer.middlename + ' ' : ''}${row.customer.lastname}`,
		cell: (info) => info.getValue(),
		filterFn: 'includesString',
	},
	{
		accessorKey: 'service_status',
		header: 'Status',
		cell: ({row}) => {
			return (
				<Badge
					className={`${row.original.service_status === 'Active' ? 'bg-green-400 font-semibold hover:bg-green-400' : 'bg-gray-400 font-semibold hover:bg-gray-400'}`}
				>
					{row.original.service_status ? 'Active' : 'Inactive'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'last_updated',
		header: 'Last Updated',
		cell: ({row}) => dateParser(row?.original?.last_updated ?? ''),
	},
	{
		id: 'has_sales_item',
		header: 'Sales',
		cell: ({row}) => {
			return (
				<Badge
					className={`${row.original.has_sales_item ? 'bg-green-400 hover:bg-green-400' : 'bg-gray-400 hover:bg-gray-400'}`}
				>
					{row.original.has_sales_item ? 'Active' : 'Inactive'}
				</Badge>
			);
		},
	},
	{
		id: 'has_job_order',
		header: 'Joborder',
		cell: ({row}) => {
			return (
				<Badge
					className={`${row.original.has_job_order ? 'bg-green-400 hover:bg-green-400' : 'bg-gray-400 hover:bg-gray-400'}`}
				>
					{row.original.has_job_order ? 'Active' : 'Inactive'}
				</Badge>
			);
		},
	},
	{
		id: 'has_reservation',
		header: 'Reservation',
		cell: ({row}) => {
			return (
				<Badge
					className={`${row.original.has_reservation ? 'bg-green-400 hover:bg-green-400' : 'bg-gray-400 hover:bg-gray-400'}`}
				>
					{row.original.has_reservation ? 'Active' : 'Inactive'}
				</Badge>
			);
		},
	},
	{
		id: 'has_borrow',
		header: 'Borrow',
		cell: ({row}) => {
			return (
				<Badge
					className={`${row.original.has_borrow ? 'bg-green-400 hover:bg-green-400' : 'bg-gray-400 hover:bg-gray-400'}`}
				>
					{row.original.has_borrow ? 'Active' : 'Inactive'}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({row}) => <ActionsCell {...row.original} />,
	},
];
