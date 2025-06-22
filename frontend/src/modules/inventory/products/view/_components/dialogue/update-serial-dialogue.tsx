import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState, useCallback} from 'react';
import {FilePen} from 'lucide-react';
import {UpdateInventorySerialRecord} from '../form/update-serial';
import {SerializeItem} from '@/components/validation/serialize-items';
export interface Props {
	serializedItem: SerializeItem;
}
export function UpdateSerialDialogueForm({serializedItem}: Props) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					<FilePen className="w-4 h-4" /> Edit
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[2000px]">
				<DialogTitle>Serial record</DialogTitle>
				<DialogDescription></DialogDescription>
				<UpdateInventorySerialRecord
					serializeItem={serializedItem}
					onSubmit={handleFormSubmit}
				/>
			</DialogContent>
		</Dialog>
	);
}
