import {ColumnDef} from '@tanstack/react-table';
import {ProductWithRelatedTables} from '../_components/validation/product';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {useNavigate, useLocation} from 'react-router-dom';
export const columns: ColumnDef<ProductWithRelatedTables>[] = [
	{
		accessorKey: 'img_url',
		header: 'IMAGE',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[80px]">
					<img
						src={
							row.original.img_url
								? row.original.img_url
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
		header: 'NAME',
	},
	{
		id: 'category',
		header: 'CATEGORY',
		cell: ({row}) => {
			return (
				<div className="flex flex-wrap gap-2">
					{row.original.product_categories &&
						row.original.product_categories.map((category) => (
							<Badge key={category.category_id}>{category.category.name}</Badge>
						))}
				</div>
			);
		},
	},
	{
		id: 'product_price',
		header: 'PRICE',
		cell: ({row}) =>
			row.original.price_history ? row.original.price_history[0]?.price : 'N/A',
	},
	{
		accessorKey: 'description',
		header: 'DESCRIPTION',
	},
	{
		id: 'action',
		cell: ({row}: {row: {original: ProductWithRelatedTables}}) => (
			<ActionsCell {...row.original} />
		),
	},
];

const ActionsCell = (data: ProductWithRelatedTables) => {
	const navigate = useNavigate();
	const location = useLocation();
	const handleClick = (service_id: number) => {
		const id = Number(service_id);
		if (location.pathname.startsWith('/sales')) {
			navigate(`/sales/inventor/products/view/${id}`);
		} else if (location.pathname.startsWith('/admin')) {
			navigate(`/admin/inventory/products/view/${id}`);
		} else if (location.pathname.startsWith('/tech')) {
			navigate(`/tech/inventory/products/view/${id}`);
		}
	};

	return <Button onClick={() => handleClick(data.product_id)}>View</Button>;
};
