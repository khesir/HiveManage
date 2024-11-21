import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {toast} from 'sonner';
import {AxiosError} from 'axios';
import {OrderTrackingItemWithDetails} from '../../_components/validation/order';
import {request} from '@/api/axios';
import {useState} from 'react';
import useTrackReferesh from '../../_components/hooks/uset-track-refresh';

interface OrderTrackingProps {
	data: OrderTrackingItemWithDetails;
}
export function DeleteConfirmModal({data}: OrderTrackingProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const {track, setTrack} = useTrackReferesh();

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	const handleClick = async () => {
		try {
			if (data.product) {
				await request(
					'DELETE',
					`api/v1/ims/order/${data.order?.order_id}/order-items/${data.orderItem_id}/tracking/${data.tracking_id}`,
				);
				toast.success('Tracking Data deleted');
				handleModal();
				setTrack(track + 1);
			} else {
				toast.error('Product data is missing');
			}
		} catch (error) {
			console.log(error);
			toast.error((error as AxiosError).response?.data as string);
		}
	};
	return (
		<Dialog open={isModalOpen} onOpenChange={handleModal}>
			<DialogTrigger className="w-full">
				<Button variant={'destructive'} className="w-full">
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete Item</DialogTitle>
					<DialogDescription>
						Mark sure you double check all items are all added to inventory.
					</DialogDescription>
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
