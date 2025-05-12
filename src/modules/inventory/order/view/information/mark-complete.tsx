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

import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {toast} from 'sonner';
import {request} from '@/api/axios';
import {useParams} from 'react-router-dom';
import axios from 'axios';

export function MarkComplete() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const {toggleTrigger} = useEventTrigger();
	const {user} = useEmployeeRoleDetailsStore();
	const {id} = useParams();

	const handleComplete = async () => {
		try {
			if (!user?.employee.employee_id) {
				toast.error('You need to be logged in to proceed');
				return;
			}
			await request(
				'POST',
				`/api/v1/ims/order/${id}/pushToInventory?user_id=${user.employee.employee_id}`,
			);
			setFormModal(false);
			toggleTrigger();
		} catch (error) {
			console.log(error);
			let errorMessage = 'An unexpected error occurred';
			if (axios.isAxiosError(error)) {
				errorMessage =
					error.response?.data?.message ||
					error.response?.data?.errors?.[0]?.message ||
					'Failed to process request';
			}
			toast.error(errorMessage);
		}
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
						onClick={handleComplete}
					>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
