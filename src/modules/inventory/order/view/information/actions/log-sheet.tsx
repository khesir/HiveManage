import {Button} from '@/components/ui/button';
import {List} from 'lucide-react';
import {useEffect, useState} from 'react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from '@/components/ui/sheet';
import {Badge} from '@/components/ui/badge';
import {Card} from '@/components/ui/card';
import {OrderProduct} from '@/components/validation/order-product';
import {LogTable} from './log-table';
import {AddDeliveredProductDialogue} from './AddDelivery/add-delivered-product-dialogue';
import {AddResolveProductDialogue} from './AddResolve/add-resolve-product-dialogue';

interface Props {
	orderProduct: OrderProduct;
}
export function LogSheet({orderProduct}: Props) {
	const [sheet, setSheet] = useState<boolean>();
	useEffect(() => {
		setSheet(false);
	}, []);
	return (
		<Sheet open={sheet} onOpenChange={setSheet}>
			<SheetTrigger asChild>
				<Button>
					<List className="w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="max-w-none w-[900px]">
				<SheetHeader className="pb-5">
					<div className="flex gap-5">
						<div className="relative max-h-[300px] overflow-hidden rounded-md w-[300px] flex">
							<img
								src={
									typeof orderProduct?.product?.img_url === 'string'
										? orderProduct.product.img_url
										: `/img/placeholder.jpg`
								}
								alt="Selected profile"
								className="object-cover h-full w-full"
							/>
						</div>
						<div className="grid grid-cols-2 gap-5 w-full">
							<div className="col-span-2 text-2xl flex-col">
								<div>{orderProduct?.product?.name ?? 'N/A'}</div>
								{orderProduct && <Badge>{orderProduct.status}</Badge>}
							</div>
							<Card className="flex flex-col justify-between p-2">
								<div>Total Quantity</div>
								<div className="pb-3">
									{orderProduct?.total_quantity ?? 'N/A'}
								</div>
							</Card>
							<Card className="flex flex-col p-2">
								<div>Ordered Quantity</div>
								<div className="pb-3">
									{orderProduct?.ordered_quantity ?? 'N/A'}
								</div>
							</Card>
							<Card className="flex flex-col justify-between p-2">
								<div>Delivered Quantity</div>
								<div className="pb-3">
									{orderProduct?.delivered_quantity ?? 'N/A'}
								</div>
							</Card>
							<Card className="flex flex-col justify-between p-2">
								<div>Resolved Quantity</div>
								<div className="pb-3">
									{orderProduct?.resolved_quantity ?? 'N/A'}
								</div>
							</Card>
						</div>
					</div>
				</SheetHeader>
				<div className="space-x-3 pb-5 flex">
					<AddDeliveredProductDialogue orderProduct={orderProduct} />
					<AddResolveProductDialogue orderProduct={orderProduct} />
				</div>
				<LogTable orderProduct={orderProduct} />
			</SheetContent>
		</Sheet>
	);
}
