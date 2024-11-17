import {ColumnDef} from '@tanstack/react-table';
import {SupplierWithRelatedData} from '../_components/validation/supplier';
import {Badge} from '@/components/ui/badge';

export const columns: ColumnDef<SupplierWithRelatedData>[] = [
	{
		accessorKey: 'profile_link',
		header: 'IMAGE',
		cell: ({row}) => {
			return (
				<div className="aspect-square relative w-[80px]">
					<img
						src={
							row.original.profile_link
								? row.original.profile_link
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
		header: 'NAME',
	},
	{
		id: 'category',
		header: 'CATEGORY',
		cell: ({row}) => {
			return (
				<div className="flex flex-wrap gap-2">
					{row.original.categories &&
						row.original.categories.map((category, index) => (
							<Badge
								key={index}
								variant={'secondary'}
								className="rounded-sm px-1 font-normal"
							>
								{category.category.name}
							</Badge>
						))}
				</div>
			);
		},
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
		header: 'REMARK',
	},
];
