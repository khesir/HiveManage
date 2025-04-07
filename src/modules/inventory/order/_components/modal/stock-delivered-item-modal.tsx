import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {toast} from 'sonner';
import axios from 'axios';
import {OrderTrackingItemWithDetails} from '../../../../../components/validation/order';
import {request} from '@/api/axios';
import {useState} from 'react';
import {Card} from '@/components/ui/card';
import useTrackReferesh from '../../../_components/hooks/uset-track-refresh';

interface OrderTrackingProps {
	data: OrderTrackingItemWithDetails;
}
export function StockDeliveredItemModal({data}: OrderTrackingProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const {track, setTrack} = useTrackReferesh();
	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	const handleClick = async () => {
		try {
			if (data.product) {
				const newData = {
					supplier_id: data.order?.supplier_id,
					product_id: data.product.product_id,
					stock: data.quantity,
					condition: data.condition,
				};
				console.log(newData);
				await request(
					'POST',
					`api/v1/ims/order/${data.order?.order_id}/order-items/${data.orderItem_id}/tracking/${data.tracking_id}/stock-in`,
					newData,
				);
				toast.success('Tracking Data Updated');
				setTrack(track + 1);
				handleModal();
			} else {
				toast.error('Product data is missing');
			}
		} catch (error) {
			console.log(error);
			let errorMessage = 'An unexpected error occurred';
			if (axios.isAxiosError(error)) {
				errorMessage =
					error.response?.data?.message || // Use the `message` field if available
					error.response?.data?.errors?.[0]?.message || // If `errors` array exists, use the first error's message
					'Failed to process request';
			}

			toast.error(errorMessage);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleModal}>
			<DialogTrigger className="w-full">
				<Button variant={'ghost'} className="w-full">
					Add Inventory
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Move To Inventory</DialogTitle>
					<Card className="p-4">
						<div className="font-semibold">Information</div>
						<ul className="grid gap-2">
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Product</span>
								<span>{data.product?.name}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Quantity</span>
								<span>{data.quantity}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Supplier</span>
								<span>{data.order?.supplier_id}</span>
							</li>
						</ul>
					</Card>
				</DialogHeader>
				<DialogFooter>
					<Button onClick={() => handleModal()}>Cancel</Button>
					<Button variant="destructive" onClick={() => handleClick()}>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
