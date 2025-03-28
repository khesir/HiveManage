import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState} from 'react';

import useOrderStore from '@/api/order';
import {useNavigate} from 'react-router-dom';

export function DeleteOrder() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const {selectedOrder, deleteOrder, getOrderById} = useOrderStore();
	const navigate = useNavigate();
	const handleDelete = async () => {
		await deleteOrder(selectedOrder.order_id!);
		await getOrderById(selectedOrder.order_id!);
		setFormModal(false);
		navigate(-1);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button variant={'destructive'}>Delete Order</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>Delete Order</DialogTitle>
				<DialogDescription>
					Are you sure you want to delete this draft order?
				</DialogDescription>
				<DialogFooter>
					<Button variant="outline" onClick={() => setFormModal(false)}>
						Cancel
					</Button>
					<Button variant={'destructive'} onClick={handleDelete}>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
