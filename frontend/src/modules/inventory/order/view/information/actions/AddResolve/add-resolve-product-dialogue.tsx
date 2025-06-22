import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {OrderProduct} from '@/components/validation/order-product';
import {CircleAlert} from 'lucide-react';
import {useCallback, useState} from 'react';
import {AddResolveProductForm} from './add-resolve-product-form';

interface Props {
	orderProduct: OrderProduct;
}
export function AddResolveProductDialogue({orderProduct}: Props) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button size={'sm'} className="flex items-center gap-1">
					<CircleAlert className="h-4 w-4" />
					<div>Add Resolve</div>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Resolve Quantity</DialogTitle>
				<DialogDescription></DialogDescription>
				<AddResolveProductForm
					onSubmit={handleFormSubmit}
					orderProduct={orderProduct}
				/>
			</DialogContent>
		</Dialog>
	);
}
