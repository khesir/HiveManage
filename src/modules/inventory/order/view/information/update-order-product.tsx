import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {OrderProduct} from '@/components/validation/inventory/order-product';
import {PenBox} from 'lucide-react';
import {useCallback, useState} from 'react';
import {UpdateOrderProductForm} from './update-order-product-form';

interface Props {
	orderProduct: OrderProduct;
}
export function UpdateOrderProductDialogue({orderProduct}: Props) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					<PenBox className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Update Order</DialogTitle>
				<DialogDescription></DialogDescription>
				<UpdateOrderProductForm
					orderProduct={orderProduct}
					onSubmit={handleFormSubmit}
				/>
			</DialogContent>
		</Dialog>
	);
}
