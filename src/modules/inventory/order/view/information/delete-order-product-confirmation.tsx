import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {X} from 'lucide-react';
import {useState} from 'react';

import useOrderStore from '@/api/order';

interface Props {
	product_order_id: number;
}
export function DeleteOrderProductConfirmation({product_order_id}: Props) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const {selectedOrder, removeOrderItem, getOrderById} = useOrderStore();

	const handleDelete = async () => {
		await removeOrderItem(selectedOrder.order_id!, product_order_id);
		await getOrderById(selectedOrder.order_id!);
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="sm">
					<X />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>Remove Product</DialogTitle>
				<DialogDescription>
					Are you sure you want to remove this product from the order?
				</DialogDescription>
				<DialogFooter>
					<Button variant="outline" onClick={() => setFormModal(false)}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={handleDelete}>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
