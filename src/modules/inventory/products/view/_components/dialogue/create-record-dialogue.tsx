import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogTrigger} from '@/components/ui/dialog';
import {useState, useCallback} from 'react';
import {Plus} from 'lucide-react';
export function CreateRecordDialogueForm() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					<Plus className="w-4 h-4" /> Add Record
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[2000px]">
				<div>Ppp</div>
			</DialogContent>
		</Dialog>
	);
}
