import {ColumnDef, Row} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import clsx from 'clsx';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {Product} from '@/components/validation/product';
import useServiceItem from '../../../_components/hooks/use-serviceItem-hook';
import {Button} from '@/components/ui/button';

const ActionCell = (data: Product) => {
	const {setProduct} = useServiceItem();
	return (
		<div className="flex gap-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<Button onClick={() => setProduct(data)}>Select</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Add</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

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
		header: 'Quantity',
		cell: ({row}) => row.original.service_quantity,
	},
	// {
	// 	accessorKey: 'status',
	// 	header: 'Status',
	// 	cell: ({row}) => {
	// 		return (
	// 			<Badge
	// 				className={clsx(
	// 					'text-white hover:none',
	// 					row.original.status === 'Available' ? 'bg-green-500' : 'bg-red-500',
	// 				)}
	// 			>
	// 				{row.original.status}
	// 			</Badge>
	// 		);
	// 	},
	// },
	{
		accessorKey: 'is_serialize',
		header: 'Serialized',
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
		header: 'Action',
		cell: ({row}: {row: Row<Product>}) => <ActionCell {...row.original} />,
	},
];
