import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState} from 'react';
import {ReplacementForm} from './replacementFormDialog';

export function ReplacementDialog() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleSubmit = () => {
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">Create Details</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[100vh]">
				<DialogTitle>Replacement Details Form</DialogTitle>
				<DialogDescription></DialogDescription>
				<ReplacementForm onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	);
}
