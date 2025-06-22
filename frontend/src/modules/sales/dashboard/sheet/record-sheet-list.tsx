import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from '@/components/ui/sheet';
import {Product} from '@/components/validation/product';
import {InformationCard} from '@/modules/inventory/products/view/information/information-card';
import {Plus} from 'lucide-react';
import {useEffect, useState} from 'react';
import {AddSerializeSelection} from '../_components/dialogue/sales-serialize-selection';
import {useSelectedItemsStore} from '../_components/hooks/use-serialize-selection';
import {toast} from 'sonner';
interface Props {
	product: Product;
}
export function RecordSheetList({product}: Props) {
	const [sheet, setSheet] = useState<boolean>();
	const {trigger, addProduct, getSalesItemByProductId} = useSalesHook();

	useEffect(() => {
		setSheet(false);
	}, [trigger]);

	const data = getSalesItemByProductId(product.product_id!);
	const [quantity, setQuantity] = useState<number>(
		data !== null ? data.quantity : 0,
	);
	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		setQuantity(value);
	};
	const {selectedItems, clearSelectedItems} = useSelectedItemsStore();
	useEffect(() => {
		clearSelectedItems();
	}, []);
	const handleSubmit = () => {
		if (product.is_serialize) {
			if (quantity < selectedItems.length) {
				toast.error('Please add reference for the given quantity');
			}
			addProduct(product, quantity, true, selectedItems);
			toast.success('Added items to cart');
		} else {
			if (quantity <= 0) {
				toast.error('Cannot accept 0 quantity');
			}
			addProduct(product, quantity, false, []);
			toast.success('Added items to cart');
		}
	};
	return (
		<Sheet open={sheet} onOpenChange={setSheet}>
			<SheetTrigger asChild>
				<Button>
					<Plus className="w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="max-w-none w-[900px]">
				<ScrollArea className="h-full">
					<div className="px-5">
						<SheetHeader className="pb-5">
							<div className="flex gap-5">
								<div className="relative h-[250px] overflow-hidden rounded-md w-[300px]">
									<img
										src={
											typeof product.img_url === 'string'
												? product.img_url
												: `/img/placeholder.jpg`
										}
										alt="Selected profile"
										className="object-cover max-h-[250px] w-full"
									/>
								</div>
								<InformationCard data={product} />
							</div>
						</SheetHeader>
						<div className="flex gap-5">
							<div className="flex-1 h-[50vh] flex justify-center">
								<div className="w-[50vh] flex-col">
									<p className="mb-3">Quantity</p>
									<Input
										type="number"
										value={quantity}
										onChange={handleQuantityChange}
										placeholder="Enter quantity"
									/>
									<Button className="w-full mt-5" onClick={handleSubmit}>
										Submit
									</Button>
								</div>
							</div>
							{product.is_serialize && (
								<div className="flex-1 flex flex-col gap-5">
									<Card className="p-3 max-h-[10vh] flex justify-between items-center">
										<p>
											Select ( <span>{quantity}</span> ) Serialize Items
										</p>
										<AddSerializeSelection
											product_id={product.product_id!}
											limit={quantity}
										/>
									</Card>
									<div className="px-3">
										<p className="font-semibold mb-2">Selected items</p>
										{selectedItems.map((data, index) => (
											<div key={index}>{data.product?.name}</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
