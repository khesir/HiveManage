import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState} from 'react';
import {UpgradeForm} from './upgradeFormDialog';

export function UpgradeDialog() {
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
				<DialogTitle>Upgrade Details Form</DialogTitle>
				<DialogDescription></DialogDescription>
				<UpgradeForm onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	);
}
