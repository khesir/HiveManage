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

import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {toast} from 'sonner';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';
import {useParams} from 'react-router-dom';
import {request} from '@/api/axios';

export function FinalizeOrder() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const {user} = useEmployeeRoleDetailsStore();
	const {id} = useParams();
	const {toggleTrigger} = useEventTrigger();
	const handleDelete = async () => {
		if (!user?.employee.employee_id) {
			toast.error('You need to be logged in to proceed');
			return;
		}
		const res = await request(
			'POST',
			`/api/v1/ims/order/${id}/finalize?user_id=${user.employee.employee_id}`,
		);
		console.log(res);
		setFormModal(false);
		toggleTrigger();
	};

	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="bg-green-400 hover:bg-green-600">Finalize</Button>
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
