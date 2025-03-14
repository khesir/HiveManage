import {AvatarCircles} from '@/components/ui/avatarcircles';
import {ProductSupplier} from '@/modules/inventory/_components/validation/product-supplier';
import {ColumnDef} from '@tanstack/react-table';
import {AxiosError} from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

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
];

export function SupplierForm() {
	const [productSupplier, setProductSupplier] = useState();
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const {id} = useParams();

	useEffect(() => {
		try {
			setLoading(true);
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
	// TODO: Fetch all
	// TODO: List all Item
	// TODO: Add update and remove function (auto)

	return <div>test</div>;
}
