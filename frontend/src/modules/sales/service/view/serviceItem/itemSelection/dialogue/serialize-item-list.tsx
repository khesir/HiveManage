import {PaginationResponse, request} from '@/api/axios';
import {SerializeItem} from '@/components/validation/serialize-items';
import {useEffect, useState} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {SerialiItemTable} from './serialize-item-table';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';
import {Checkbox} from '@/components/ui/checkbox';
import useService from '@/modules/sales/_components/hooks/use-service';

export const columns: ColumnDef<SerializeItem>[] = [
	{
		id: 'select',
		header: ({table}) => (
			<Checkbox
				checked={table.getIsAllRowsSelected()}
				onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({row}) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'serial_id',
		header: 'ID',
	},
	{
		accessorKey: 'supplier',
		header: 'Supplier',
		cell: ({row}) => {
			return (
				<div className="flex gap-3 items-center">
					<span>{row.original.supplier?.name ?? 'Not set'}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'serial_code',
		header: 'Serial',
		cell: ({row}) =>
			row.original.serial_code !== null ? row.original.serial_code : 'Not set',
	},
	{
		accessorKey: 'warranty_date',
		header: 'Warranty Date',
		cell: ({row}) => dateParser(row?.original?.warranty_date ?? ''),
	},
	{
		accessorKey: 'condition',
		header: 'Condition',
	},
	{
		accessorKey: 'status',
		header: 'Status',
	},
];
interface Props {
	product_id: number;
	limit: number;
	onSubmit: () => void;
}
export default function SerializeItemRecord({
	product_id,
	limit,
	onSubmit,
}: Props) {
	const [serials, setSerials] = useState<SerializeItem[]>([]);

	const {isTriggered} = useEventTrigger();
	const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
	const {data} = useService();

	useEffect(() => {
		const fetchProducts = async () => {
			const serialItems = await request<PaginationResponse<SerializeItem>>(
				'GET',
				`/api/v1/ims/product/${product_id}/serializeRecord?no_pagination=true&status=Available` +
					(data?.service_type?.name === 'Rent'
						? `&purpose=Rent`
						: '&purpose=Service'),
			);
			setSerials(serialItems.data);
		};
		fetchProducts();
	}, [isTriggered]);

	return (
		<SerialiItemTable
			columns={columns}
			data={serials}
			selectedRowIds={selectedRows}
			onRowSelectionChange={setSelectedRows}
			limit={limit}
			onSubmit={onSubmit}
		/>
	);
}
