import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {OrderProduct} from '@/components/validation/order-product';
import {Upload} from 'lucide-react';
import {useCallback, useState} from 'react';
import {AddDeliveredProductForm} from './add-delivered-product-form';

interface Props {
	orderProduct: OrderProduct;
}
export function AddDeliveredProductDialogue({orderProduct}: Props) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button size={'sm'} className="flex items-center gap-1">
					<Upload className="h-4 w-4" />
					<div>Add Delivery</div>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Delivered Quantity</DialogTitle>
				<DialogDescription></DialogDescription>
				<AddDeliveredProductForm
					onSubmit={handleFormSubmit}
					orderProduct={orderProduct}
				/>
			</DialogContent>
		</Dialog>
	);
}
