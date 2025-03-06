import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState, useCallback} from 'react';
import {Plus} from 'lucide-react';
import {CreateInventorySerialRecord} from '../form/create-serial';
export function CreateSerialDialogueForm() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					<Plus className="w-4 h-4" /> Add Serial Record
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[2000px]">
				<DialogTitle>Serial record</DialogTitle>
				<DialogDescription>Each Item has a unique identifier</DialogDescription>
				<CreateInventorySerialRecord onSubmit={handleFormSubmit} />
			</DialogContent>
		</Dialog>
	);
}
