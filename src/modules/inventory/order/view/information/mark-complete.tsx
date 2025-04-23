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
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {toast} from 'sonner';

export function MarkComplete() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const {selectedOrder, pushToInventory} = useOrderStore();
	const {toggleTrigger} = useEventTrigger();
	const {user} = useEmployeeRoleDetailsStore();

	const handleDelete = async () => {
		if (!user?.employee.employee_id) {
			toast.error('You need to be logged in to proceed');
			return;
		}
		await pushToInventory(
			selectedOrder.order_id!,
			selectedOrder,
			user?.employee.employee_id,
		);
		setFormModal(false);
		toggleTrigger();
	};

	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="bg-green-400 hover:bg-green-600">
					Push to Inventory
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>Confirm Order</DialogTitle>
				<DialogDescription>
					This will mark the order fullfiled if there are no more ordered
					quantity.
				</DialogDescription>
				<DialogFooter>
					<Button variant="outline" onClick={() => setFormModal(false)}>
						Cancel
					</Button>
					<Button
						className="bg-green-400 hover:bg-green-600"
						onClick={handleDelete}
					>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
