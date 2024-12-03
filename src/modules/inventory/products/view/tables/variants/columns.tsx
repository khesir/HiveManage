import {ColumnDef} from '@tanstack/react-table';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';
import {ProductVariant} from '@/modules/inventory/_components/validation/variants';
import {AvatarCircles} from '@/components/ui/avatarcircles';
export const columns: ColumnDef<ProductVariant>[] = [
	{
		accessorKey: 'img_url',
		header: 'Image',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[70px]">
					<img
						src={
							row.original.img_url
								? typeof row.original.img_url === 'string'
									? row.original.img_url
									: URL.createObjectURL(row.original.img_url)
								: '/img/placeholder.jpg'
						}
						alt={`${row.original.variant_name} `}
						className="rounded-lg"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'variant_name',
		header: 'Name',
	},
	{
		accessorKey: 'supplier.name',
		header: 'Provided By',
		cell: ({row}) => {
			const data =
				row.original.prdvariantsupp?.map((varSupp) => ({
					link: varSupp.supplier?.profile_link || '',
					name: varSupp.supplier?.name || '',
				})) || [];
			return <AvatarCircles avatar={data} />;
		},
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
