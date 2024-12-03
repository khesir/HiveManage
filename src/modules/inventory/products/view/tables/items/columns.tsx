import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Item} from '@/modules/inventory/_components/validation/item';
export const columns: ColumnDef<Item>[] = [
	{
		accessorKey: 'img_url',
		header: 'Image',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[70px]">
					<img
						src={
							row.original.variant?.img_url
								? typeof row.original.variant?.img_url === 'string'
									? row.original.variant?.img_url
									: URL.createObjectURL(row.original.variant?.img_url)
								: '/img/placeholder.jpg'
						}
						alt={`${row.original.variant?.variant_name} `}
						className="rounded-lg"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'variant.variant_name',
		header: 'Name',
	},
	{
		accessorKey: 'item_type',
		header: 'Type',
	},
	{
		accessorKey: 'item_status',
		header: 'Status',
	},
	{
		accessorKey: 'quantity',
		header: 'QTY',
	},
	{
		accessorKey: 'ordered_qty',
		header: 'Ordered Qty',
	},
	{
		accessorKey: 'reserve_qty',
		header: 'Reserved Qty',
	},
	{
		accessorKey: 'item_record.supplier.name',
		header: 'Provided By',
		cell: ({row}) => {
			const data = {
				link: row.original.item_record?.supplier?.profile_link || '',
				name: row.original.item_record?.supplier?.name || '',
			};
			return <AvatarCircles avatar={[data]} />;
		},
	},
	{
		id: 'action',
		cell: () => {
			const navigate = useNavigate();
			return (
				<Button size={'sm'} onClick={() => navigate('record')}>
					View Details
				</Button>
			);
		},
	},
];
