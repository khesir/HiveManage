import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {DataTable} from '@/components/table/data-table';
import {Button} from '@/components/ui/button';
import {SerializeItem} from '@/components/validation/inventory/serialize-items';
import {ColumnDef} from '@tanstack/react-table';
import {toast} from 'sonner';
import useItemStore from '../_components/hooks/use-custom-item';

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
		accessorKey: 'selling_price',
		header: 'Selling Price',
	},
	{
		accessorKey: 'warranty_expiry_date',
		header: 'Warranty Expiry',
	},
	{
		id: 'action',
		cell: ({row}) => {
			const {salesHookData, setSaleHookData} = useSalesHook();
			// For extra data for product
			const {selectedItem} = useItemStore();
			const handleAddproduct = (serialData: SerializeItem) => {
				if (!salesHookData['service']) {
					alert('Create service First!');
				}

				const existingProducts = salesHookData['sales'] || [];
				const existingproduct = existingProducts.find(
					(exisitingData) =>
						exisitingData.record.record_number === serialData.serial_number &&
						exisitingData.record.type === 'Sales',
				);
				if (existingproduct) {
					toast(`Item ${serialData.serial_number} is already in the cart`);
				} else {
					// Add the product to the cart
					const newData = {
						record: {
							record_number: serialData.serial_number,
							type: 'Sales',
							price: serialData.selling_price,
							total_price: serialData.selling_price,
							item_id: serialData.item_id,
							quantity: 1,
							sales_item_type: 'Sales',
						},
						variantRecord: {
							...(selectedItem?.variant || {}),
						},
					};
					setSaleHookData('sales_product', [newData], 'append');
					toast(`Added ${serialData.serial_number} qty: ${1} to the cart`);

					const updateService = {
						service: {
							...salesHookData['service'][0].service,
							has_sales_item: true,
						},
					};
					setSaleHookData('service', [updateService], 'clear');
				}
			};
			return (
				<Button onClick={() => handleAddproduct(row.original)}>Submit</Button>
			);
		},
	},
];

interface SerialRecordProps {
	data: SerializeItem[];
}
export function SerializeRecord({data}: SerialRecordProps) {
	return (
		<div className="w-full space-y-2">
			<DataTable columns={columns} data={data}>
				Serialized Items
			</DataTable>
		</div>
	);
}
