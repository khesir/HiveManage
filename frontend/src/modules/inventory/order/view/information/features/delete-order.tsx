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

import useOrderStore from '@/api/order-state';
import {useNavigate} from 'react-router-dom';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {toast} from 'sonner';

export function DeleteOrder() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const {selectedOrder, deleteOrder, getOrderById} = useOrderStore();
	const navigate = useNavigate();
	const {user} = useEmployeeRoleDetailsStore();
	const handleDelete = async () => {
		if (!user?.employee.employee_id) {
			toast.error('You need to be logged in to proceed');
			return;
		}
		await deleteOrder(selectedOrder.order_id!, user?.employee.employee_id);
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
