import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';
import {ProductVariantSupplier} from '@/modules/inventory/_components/validation/variant-supplier';
export const columns: ColumnDef<ProductVariantSupplier>[] = [
	{
		accessorKey: 'variant.img_url',
		header: 'Image',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[70px]">
					<img
						src={
							row.original.supplier?.profile_link
								? typeof row.original.supplier.profile_link === 'string'
									? row.original.supplier.profile_link
									: URL.createObjectURL(row.original.supplier.profile_link)
								: '/img/placeholder.jpg'
						}
						alt={`product ID ${row.original.supplier?.supplier_id} - ${row.original.supplier?.name}`}
						className="rounded-lg"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'variant.variant_name',
		header: 'Name',
	},
	{
		accessorKey: 'supplier.name',
		header: 'Provided By',
	},
	{
		id: 'action',
		cell: () => {
			const navigate = useNavigate();
			return (
				<Button size={'sm'} onClick={() => navigate('record')}>
					View Details
				</Button>
			);
		},
	},
];
