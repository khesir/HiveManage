import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Product} from '../_components/validation/product';
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
		accessorKey: 'is_serialize',
		header: 'Serialized Item',
		cell: ({row}) => {
			return (
				<Badge
					className={clsx(
						'text-white hover:none',
						row.original.is_serialize ? 'bg-green-500' : 'bg-red-500',
					)}
				>
					{row.original.is_serialize ? 'True' : 'False'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
