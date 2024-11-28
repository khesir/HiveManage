import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {ItemRecords} from '../../_components/validation/item-record';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';
export const columns: ColumnDef<ItemRecords>[] = [
	{
		accessorKey: 'supplier.profile_link',
		header: 'Image',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[70px]">
					<img
						src={
							row.original.supplier?.profile_link
								? typeof row.original.supplier.profile_link === 'string'
									? row.original.supplier.profile_link
									: URL.createObjectURL(row.original.supplier.profile_link)
								: '/img/placeholder.jpg'
						}
						alt={`product ID ${row.original.supplier?.supplier_id} - ${row.original.supplier?.name}`}
						className="rounded-lg"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'supplier.name',
		header: 'Name',
	},
	{
		id: 'category',
		header: 'Category',
		cell: ({row}) => {
			return (
				<div className="flex flex-wrap gap-2">
					{row.original.supplier?.categories &&
						row.original.supplier.categories.map((category, index) => (
							<Badge
								key={index}
								variant={'secondary'}
								className="rounded-sm px-1 font-normal"
							>
								{category.category?.name}
							</Badge>
						))}
				</div>
			);
		},
	},
	{
		id: 'stock',
		header: 'Total Stock',
		cell: ({row}) => (row.original.total_stock ? row.original.total_stock : 0),
	},
	{
		accessorKey: 'ordered_qty',
		header: 'Pending Stocks',
	},
	{
		id: 'action',
		cell: ({row}) => {
			const navigate = useNavigate();
			return (
				<Button
					size={'sm'}
					onClick={() => navigate(`record/${row.original.item_record_id}`)}
				>
					View Record
				</Button>
			);
		},
	},
];
