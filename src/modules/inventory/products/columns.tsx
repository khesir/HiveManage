import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Product} from '../../../components/validation/product';
import {dateParser} from '@/lib/util/utils';
import clsx from 'clsx';

export const columns: ColumnDef<Product>[] = [
	{
		accessorKey: 'img_url',
		header: 'Img',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[80px]">
					<img
						src={
							typeof row.original.img_url === 'string'
								? row.original.img_url
								: row.original.img_url
									? URL.createObjectURL(row.original.img_url)
									: '/img/placeholder.jpg'
						}
						alt={`product ID ${row.original.product_id} - ${row.original.name}`}
						className="rounded-lg"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		id: 'category',
		header: 'Category',
		cell: ({row}) => {
			return (
				<div className="flex flex-wrap gap-2">
					{row.original.product_categories &&
						row.original.product_categories.map((category, index) => (
							<Badge key={index}>{category.category?.name}</Badge>
						))}
				</div>
			);
		},
	},
	{
		accessorKey: 'available_quantity',
		header: 'Available Quantity',
		cell: ({row}) => {
			const flag =
				(row.original.re_order_level ?? 0) >=
				(row.original.available_quantity ?? 0);
			return (
				<div className={clsx('text-white flex gap-2', flag && 'text-red-500')}>
					{row.original.available_quantity}
					{flag && <Badge className="bg-red-500"> Low Inventory</Badge>}
				</div>
			);
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({row}) => {
			return (
				<Badge
					className={clsx(
						'text-white hover:none',
						row.original.status === 'Available' ? 'bg-green-500' : 'bg-red-500',
					)}
				>
					{row.original.status}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? '', true),
	},
];
