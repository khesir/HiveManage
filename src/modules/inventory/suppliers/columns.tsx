import {ColumnDef} from '@tanstack/react-table';
import {Supplier} from '../../../components/validation/inventory/supplier';
import {dateParser} from '@/lib/util/utils';

export const columns: ColumnDef<Supplier>[] = [
	{
		accessorKey: 'profile_link',
		header: 'Img',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[80px]">
					<img
						src={
							typeof row.original.profile_link === 'string'
								? row.original.profile_link
								: row.original.profile_link
									? URL.createObjectURL(row.original.profile_link)
									: '/img/placeholder.jpg'
						}
						alt={`Suppplier ID ${row.original.supplier_id} - ${row.original.name}`}
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
		accessorKey: 'relationship',
		header: 'Relationship',
		cell: ({row}) => {
			const titleCase = (text: string) =>
				text
					.toLowerCase()
					.split(' ')
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ');

			return <span>{titleCase(row.original.relationship)}</span>;
		},
	},
	{
		accessorKey: 'remarks',
		header: 'Remarks',
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
];
