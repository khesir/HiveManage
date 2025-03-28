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

export function MarkComplete() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const {selectedOrder, pushToInventory} = useOrderStore();

	const handleDelete = async () => {
		await pushToInventory(selectedOrder.order_id!, selectedOrder);
		setFormModal(false);
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
					You cannot further edit this record after finalizing.
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
