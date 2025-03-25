import {DataTable} from '@/components/table/data-table';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Separator} from '@/components/ui/separator';
import {ColumnDef} from '@tanstack/react-table';
import {useParams} from 'react-router-dom';
import {X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import useOrderStore from '@/api/order';
import {OrderProduct} from '@/components/validation/inventory/order-product';
import clsx from 'clsx';
import {Badge} from '@/components/ui/badge';

const ActionCell = ({pid}: {pid: number}) => {
	const {removeOrderItem, getOrderById} = useOrderStore();

	const handleDelete = async () => {
		removeOrderItem(selectedOrder.order_id!, pid);
		getOrderById(selectedOrder.order_id!);
	};
	return (
		<Button variant={'destructive'} onClick={handleDelete}>
			<X />
		</Button>
	);
};

export const columns: ColumnDef<OrderProduct>[] = [
	{
		accessorKey: 'product.img_url',
		header: 'Img',
		cell: ({row}) => {
			return (
				<AvatarCircles
					avatar={[
						{
							link:
								typeof row.original?.product?.img_url === 'string'
									? row.original.product?.img_url
									: '',
							name: row.original.product?.name ?? '',
						},
					]}
				/>
			);
		},
	},
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
					{row.original.product?.is_serialize ? 'True' : 'False'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'product.name',
		header: 'Name',
	},
	{
		accessorKey: 'quantity',
		header: 'Qty',
	},
	{
		accessorKey: 'unit_price',
		header: 'Unit Price',
	},
	{
		header: 'Total Value',
		cell: ({row}) => {
			const totalValue =
				Number(row.original.quantity) * Number(row.original.unit_price);
			return <span>{totalValue.toFixed(2)}</span>;
		},
	},
	{
		header: 'Action',
		cell: ({row}) => <ActionCell pid={row.original.order_product_id!} />,
	},
];

export function OrderProducts() {
	const {selectedOrder, loading} = useOrderStore();
	console.log(selectedOrder.order_products);
	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-medium">Ordered Products</h3>
					{/* <p className="text-sm text-muted-foreground">
						Once finalized
					</p> */}
				</div>
				{!loading && <Button>Test</Button>}
			</div>
			<Separator />
			{loading ? (
				'Fetching data'
			) : (
				<>
					<DataTable
						columns={columns}
						data={selectedOrder.order_products ?? []}
					>
						No selected Products for order
					</DataTable>
				</>
			)}
		</div>
	);
}
