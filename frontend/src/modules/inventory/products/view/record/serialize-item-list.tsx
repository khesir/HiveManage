import {PaginationResponse, request} from '@/api/axios';
import {SerializeItem} from '@/components/validation/serialize-items';
import {useEffect, useState} from 'react';
import {ColumnDef, Row} from '@tanstack/react-table';
import {dateParser} from '@/lib/util/utils';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {SerialiItemTable} from './serialize-item-table';
import {useParams, useSearchParams} from 'react-router-dom';
import {UpdateSerialDialogueForm} from '../_components/dialogue/update-serial-dialogue';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';

export const columns: ColumnDef<SerializeItem>[] = [
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
	{
		accessorKey: 'purpose',
		header: 'Purpose',
	},
	{
		accessorKey: 'created_at',
		header: 'Created At',
		cell: ({row}) => dateParser(row?.original?.created_at ?? ''),
	},
	{
		header: 'Actions',
		cell: ({row}: {row: Row<SerializeItem>}) => (
			<UpdateSerialDialogueForm serializedItem={row.original} />
		),
	},
];

export default function SerializeItemRecord() {
	const [searchParams] = useSearchParams();
	const {id} = useParams();
	const [pageCount, setPageCount] = useState<number>(0);
	const [serials, setSerials] = useState<SerializeItem[]>([]);

	const page = Number(searchParams.get('page')) || 1;
	const pageLimit = Number(searchParams.get('limit')) || 10;
	const sort = searchParams.get('sort') || null;
	const offset = (page - 1) * pageLimit;

	const supplier_name = searchParams.get('supplier_name') || undefined;
	const {isTriggered} = useEventTrigger();

	useEffect(() => {
		const fetchProducts = async () => {
			const serialItems = await request<PaginationResponse<SerializeItem>>(
				'GET',
				`/api/v1/ims/product/${id}/serializeRecord?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : '') +
					(supplier_name ? `&supplier_name=${supplier_name}` : ''),
			);
			setSerials(serialItems.data);
			setPageCount(Math.ceil(serialItems.total_data / pageLimit));
		};
		fetchProducts();
	}, [offset, pageLimit, sort, supplier_name, isTriggered]);

	return (
		<SerialiItemTable
			columns={columns}
			data={serials}
			searchKey={'supplier'}
			pageCount={pageCount}
		/>
	);
}
