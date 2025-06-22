import {PaginationResponse, request} from '@/api/axios';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {dateParser} from '@/lib/util/utils';
import {ProductSupplier} from '@/components/validation/product-supplier';
import {ColumnDef} from '@tanstack/react-table';
import {AxiosError} from 'axios';
import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import {ProductSupplierTable} from './supplier-table';
import {toast} from 'sonner';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {Button} from '@/components/ui/button';
import {X} from 'lucide-react';
import useEventTrigger from '../../../../_components/hooks/use-event-trigger';

const ActionCell = ({pid}: {pid: number}) => {
	const {id} = useParams();
	const {user} = useEmployeeRoleDetailsStore();
	const {toggleTrigger} = useEventTrigger();

	const handleDelete = async () => {
		try {
			await request<PaginationResponse<ProductSupplier>>(
				'DELETE',
				`/api/v1/ims/product/${id}/productSupplier/${pid}?user=${user?.employee.employee_id}`,
			);
			toast.success('Deleted Supplier');
			toggleTrigger();
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An Unknown error occured');
			}
		}
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
	const {id} = useParams();
	const [searchParams] = useSearchParams();
	const [pageCount, setPageCount] = useState<number>(0);
	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const offset = (page - 1) * pageLimit;
	const {isTriggered} = useEventTrigger();
	useEffect(() => {
		try {
			const fetchProducts = async () => {
				const response = await request<PaginationResponse<ProductSupplier>>(
					'GET',
					`/api/v1/ims/product/${id}/productSupplier?&limit=${pageLimit}&offest=${offset}`,
				);
				setProductSupplier(response.data);
				setPageCount(Math.ceil(response.total_data / pageLimit));
			};
			fetchProducts();
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An Unknown error occured');
			}
		}
	}, [offset, pageLimit, isTriggered]);
	return (
		<ProductSupplierTable
			columns={columns}
			data={productSupplier}
			pageCount={pageCount}
		/>
	);
}
