import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {DataTable} from '@/components/table/data-table';
import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {BatchItem} from '@/components/validation/batch-items';
import {ColumnDef} from '@tanstack/react-table';
import {useState} from 'react';
import {toast} from 'sonner';
import useItemStore from '../_components/hooks/use-custom-item';

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
		accessorKey: 'selling_price',
		header: 'Selling Price',
	},
	{
		id: 'action',
		cell: ({row}) => {
			const {salesHookData, setSaleHookData} = useSalesHook();
			const [quantity, setQuantity] = useState<number>(0);
			// For extra data for product
			const {selectedItem} = useItemStore();
			const handleAddproduct = (batchData: BatchItem) => {
				console.log(batchData.quantity);

				if (!salesHookData['service']) {
					alert('Create service First!');
				}
				if (
					quantity <= 0 ||
					quantity > batchData.quantity - (batchData.reserved_quantity ?? 0)
				) {
					toast.error('Please enter a valid quantity.');
					return;
				}
				const existingProducts = salesHookData['sales_product'] || [];
				const existingproduct = existingProducts.find(
					(exisitingData) =>
						exisitingData.record.record_number === batchData.batch_number &&
						exisitingData.record.type === 'Sales',
				);
				if (existingproduct) {
					// If the product exists, calculate the new total quantity
					const newQuantity = existingproduct.record.quantity + quantity;
					// Check if the new product exceeds the available stock
					if (
						newQuantity <= 0 ||
						newQuantity >
							batchData.quantity - (batchData.reserved_quantity ?? 0)
					) {
						toast.error('Not enough Products available.');
						return;
					}
					// Update the existing product with the new quantity and total price
					const updatedData = {
						...existingproduct,
						record: {
							...existingproduct.record,
							quantity: newQuantity,
							total_price: newQuantity * batchData.selling_price,
							price: batchData.selling_price,
						},
					};
					// Replace the existing product in the sales_product array
					const updatedProducts = existingProducts.map((exisitingData) =>
						exisitingData.record.record_number === batchData.batch_number
							? updatedData
							: exisitingData,
					);
					// Update the state
					setSaleHookData('sales_product', updatedProducts, 'clear');
					toast(
						`Updated ${batchData.batch_number} qty: ${newQuantity} in the cart`,
					);
					console.log(salesHookData['service'][0].service);
					const updateService = {
						service: {
							...salesHookData['service'][0].service,
							has_sales_item: true,
						},
					};
					console.log(updateService);
					setSaleHookData('service', [updateService], 'clear');
				} else {
					// If the product does not exist, check if there's enough stock
					if (quantity > batchData.quantity) {
						// Assume product.quantity is the available stock
						toast.error('Not enough Products available.');
						return;
					}
					// Add the product to the cart
					const newData = {
						record: {
							record_number: batchData.batch_number,
							type: 'Sales',
							total_price: quantity * batchData.selling_price,
							price: batchData.selling_price,

							item_id: batchData.item_id,
							quantity: quantity,
							sales_item_type: 'Sales',
						},
						variantRecord: {
							...(selectedItem?.variant || {}),
						},
					};
					setSaleHookData('sales_product', [newData], 'append');
					toast(`Added ${batchData.batch_number} qty: ${quantity} to the cart`);
					console.log(salesHookData['service'][0].service);
					const updateService = {
						service: {
							...salesHookData['service'][0].service,
							has_sales_item: true,
						},
					};
					console.log(updateService);
					setSaleHookData('service', [updateService], 'clear');
				}
			};
			return (
				<Dialog>
					<DialogTrigger>
						<Button>Add to Cart</Button>
					</DialogTrigger>
					<DialogContent>
						something more that to expect
						<Input
							className="w-[100px]"
							placeholder="0"
							type="number"
							value={quantity}
							onChange={(e) => setQuantity(Number(e.target.value))}
						/>
						<DialogFooter>
							<Button onClick={() => handleAddproduct(row.original)}>
								Submit
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			);
		},
	},
];

interface BatchRecordProps {
	data: BatchItem[];
}
export function BatchRecords({data}: BatchRecordProps) {
	return (
		<div className="w-full space-y-2">
			<DataTable columns={columns} data={data} />
		</div>
	);
}
