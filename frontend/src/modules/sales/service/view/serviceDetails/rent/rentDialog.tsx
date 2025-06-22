import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState} from 'react';
import {RentForm} from './rentFormDialog';

export function RentDialog() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleSubmit = () => {
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button
					variant={'outline'}
					size={'xs'}
					className="flex items-center gap-1"
				>
					Update Details
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[100vh]">
				<DialogTitle>Replacement Details Form</DialogTitle>
				<DialogDescription></DialogDescription>
				<RentForm onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	);
}
