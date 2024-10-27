import {ColumnDef} from '@tanstack/react-table';
import {RemarkTicketWithDetails} from '@/lib/sales-zod-schema';
import useServiceFormStore from '@/components/hooks/use-service-store';
import {Button} from '@/components/ui/button';
import {useNavigate, useLocation} from 'react-router-dom';

const ActionsCell = (data: RemarkTicketWithDetails) => {
	const {setServiceFormData} = useServiceFormStore();
	const navigate = useNavigate();
	const location = useLocation();
	const handleClick = (service_id: number) => {
		const id = Number(service_id);
		if (location.pathname.includes('/sales')) {
			navigate(`/sales/services/view/${id}`);
		} else if (location.pathname.includes('/admin')) {
			navigate(`/admin/sales/services/view/${id}`);
		} else if (location.pathname.includes('/tech')) {
			navigate(`/tech/services/view/${id}`);
		}
		setServiceFormData(data);
	};

	return <Button onClick={() => handleClick(data.remark_id!)}>View</Button>;
};

export const columns: ColumnDef<RemarkTicketWithDetails>[] = [
	{
		accessorKey: 'remark_id',
		header: 'ID',
	},
	{
		accessorKey: 'title',
		header: 'Title',
	},
	{
		accessorKey: 'remark_type.name',
		header: 'Type',
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		accessorKey: 'remarktickets_status',
		header: 'Status',
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({row}) => <ActionsCell {...row.original} />,
	},
];
