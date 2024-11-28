import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {useNavigate, useLocation} from 'react-router-dom';
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
		accessorKey: 'product_id',
		header: 'ID',
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
						row.original.product_categories.map((category) => (
							<Badge key={category.category_id}>
								{category.category?.name}
							</Badge>
						))}
				</div>
			);
		},
	},
	{
		accessorKey: 'description',
		header: 'Description',
	},
	{
		id: 'action',
		cell: ({row}: {row: {original: Product}}) => (
			<ActionsCell {...row.original} />
		),
	},
];

const ActionsCell = (data: Product) => {
	const navigate = useNavigate();
	const location = useLocation();
	const handleClick = (service_id: number) => {
		const id = Number(service_id);
		if (location.pathname.startsWith('/sales')) {
			navigate(`/sales/inventory/products/view/${id}`);
		} else if (location.pathname.startsWith('/admin')) {
			navigate(`/admin/inventory/products/view/${id}`);
		} else if (location.pathname.startsWith('/tech')) {
			navigate(`/tech/inventory/products/view/${id}`);
		}
	};

	return <Button onClick={() => handleClick(data.product_id!)}>View</Button>;
};
