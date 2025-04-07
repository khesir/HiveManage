import {PaginationResponse, request} from '@/api/axios';
import {DataTable} from '@/components/table/data-table';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Separator} from '@/components/ui/separator';
import {dateParser} from '@/lib/util/utils';
import {ProductSupplier} from '@/components/validation/product-supplier';
import {ColumnDef} from '@tanstack/react-table';
import {AxiosError} from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {X} from 'lucide-react';
import {Button} from '@/components/ui/button';

const ActionCell = ({pid}: {pid: number}) => {
	const {id} = useParams();
	const handleDelete = async () => {
		await request<PaginationResponse<ProductSupplier>>(
			'DELETE',
			`/api/v1/ims/product/${id}/productSupplier/${pid}`,
		);
	};
	return (
		<Button variant={'destructive'} onClick={handleDelete}>
			<X />
		</Button>
	);
};

export const columns: ColumnDef<ProductSupplier>[] = [
	{
		accessorKey: 'supplier',
		header: 'Supplier',
		cell: ({row}) => {
			return (
				<AvatarCircles
					avatar={[
						{
							link:
								typeof row.original.supplier?.profile_link === 'string'
									? row.original.supplier?.profile_link
									: '',
							name: row.original.supplier?.name ?? '',
						},
					]}
				/>
			);
		},
	},
	{
		accessorKey: 'supplier.name',
		header: 'Name',
	},
	{
		accessorKey: 'supplier.relationship',
		header: 'Relationship',
		cell: ({row}) => {
			const titleCase = (text: string) =>
				text
					.toLowerCase()
					.split(' ')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ');

			return (
				<span>{titleCase(row.original.supplier?.relationship ?? '')}</span>
			);
		},
	},
	{
		accessorKey: 'supplier.remarks',
		header: 'Remarks',
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
	{
		header: 'Action',
		cell: ({row}) => <ActionCell pid={row.original.product_supplier_id!} />,
	},
];

export function SupplierForm() {
	const [productSupplier, setProductSupplier] = useState<ProductSupplier[]>([]);
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const {id} = useParams();

	useEffect(() => {
		try {
			setLoading(true);
			const fetchProducts = async () => {
				const response = await request<PaginationResponse<ProductSupplier>>(
					'GET',
					`/api/v1/ims/product/${id}/productSupplier?no_pagination=true`,
				);
				setProductSupplier(response.data);
			};
			fetchProducts();
		} catch (e) {
			if (e instanceof Error) {
				setRes(e.toString());
			} else if (e instanceof AxiosError) {
				setRes(e.response?.data as string);
			} else {
				setRes('An Unknown error occured');
			}
		} finally {
			setLoading(false);
		}
	}, []);
	if (res) {
		return <div>{res}</div>;
	}
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-medium">Suppliers</h3>
					<p className="text-sm text-muted-foreground">
						Available product supplier
					</p>
				</div>
			</div>
			<Separator />
			{loading ? (
				'Fetching data'
			) : (
				<>
					<DataTable columns={columns} data={productSupplier}>
						No Available supplier
					</DataTable>
				</>
			)}
		</div>
	);
}
