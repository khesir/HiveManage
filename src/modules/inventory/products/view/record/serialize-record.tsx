import {ApiRequest, request} from '@/api/axios';
import {DataTable} from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import {Item} from '@/modules/inventory/_components/validation/item';
import {SerializeItem} from '@/modules/inventory/_components/validation/serialize-items';
import {ColumnDef} from '@tanstack/react-table';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

const columns: ColumnDef<SerializeItem>[] = [
	{
		accessorKey: 'serial_number',
		header: 'Serial Number',
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
		accessorKey: 'unit_price',
		header: 'Unit Price',
	},
	{
		accessorKey: 'selling_price',
		header: 'Selling Price',
	},
	{
		accessorKey: 'warranty_expiry_date',
		header: 'Warranty Expiry',
	},
];

interface BatchRecordProps {
	data: Item;
}
export function SerializeRecord({data}: BatchRecordProps) {
	const [SerializeItems, setSerializeItems] = useState<SerializeItem[]>([]);
	const {id, item_record_id} = useParams();
  console.log(data.item_id);
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<SerializeItem>>(
				'GET',
				`/api/v1/ims/product/${id}/item-record/${item_record_id}/item/${data.item_id}/serialized`,
			);
			setSerializeItems(res.data as SerializeItem[]);
		};
		fetchData();
	}, []);
	return (
		<div className="w-full space-y-2">
			<div className="flex justify-end">
				<Button>Add Serialize Item</Button>
			</div>
			<DataTable columns={columns} data={SerializeItems}>
				Serialized Items
			</DataTable>
		</div>
	);
}
