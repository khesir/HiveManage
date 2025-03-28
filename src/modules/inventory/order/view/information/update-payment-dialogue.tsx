import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useCallback, useState} from 'react';
import {UpdatePaymentForm} from './update-payment-form';

export function UpdatePaymentDialogue() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button size={'sm'}>Update Payment</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Update Payment</DialogTitle>
				<DialogDescription></DialogDescription>
				<UpdatePaymentForm onSubmit={handleFormSubmit} />
			</DialogContent>
		</Dialog>
	);
}
