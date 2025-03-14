import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Supplier} from '../_components/validation/supplier';

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
		id: 'category',
		header: 'Category',
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
								{category.category?.name}
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
