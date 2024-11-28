import {ApiRequest, request} from '@/api/axios';
import {DataTable} from '@/components/table/data-table';
import {Button} from '@/components/ui/button';
import {BatchItem} from '@/modules/inventory/_components/validation/batch-items';
import {Item} from '@/modules/inventory/_components/validation/item';
import {ColumnDef} from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

const columns: ColumnDef<BatchItem>[] = [
	{
		accessorKey: 'batch_number',
		header: 'Batch Number',
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
		accessorKey: 'quantity',
		header: 'Qty',
	},
	{
		accessorKey: 'reserved_quantity',
		header: 'Reserved Qty',
	},
	{
		accessorKey: 'pending_quantity',
		header: 'Pending Qty',
	},
	{
		accessorKey: 'unit_price',
		header: 'Unit Price',
	},
	{
		accessorKey: 'selling_price',
		header: 'Selling Price',
	},
	{
		accessorKey: 'production_date',
		header: 'Production Date',
	},
	{
		accessorKey: 'expiration_date',
		header: 'Expiration_date',
	},
];

interface BatchRecordProps {
	data: Item;
}
export function BatchRecords({data}: BatchRecordProps) {
	const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
	const {id, item_record_id} = useParams();

	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<BatchItem>>(
				'GET',
				`/api/v1/ims/product/${id}/item-record/${item_record_id}/item/${data.item_id}/batch`,
			);
			setBatchItems(res.data as BatchItem[]);
		};
		fetchData();
	}, []);
	return (
		<div className="w-full space-y-2">
			<div className="flex justify-end">
				<Button>Add New Batch</Button>
			</div>
			<DataTable columns={columns} data={batchItems}>
				Start Tracking order items by clicking add track
			</DataTable>
		</div>
	);
}
