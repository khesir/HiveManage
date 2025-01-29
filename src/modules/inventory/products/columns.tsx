import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Product} from '../_components/validation/product';
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
		accessorKey: 'description',
		header: 'Description',
	},
];
