import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Plus} from 'lucide-react';
import {useState} from 'react';
import SerializeItemRecord from './serialize-item-list';

interface Props {
	product_id: number;
	limit: number;
}
export function AddSerializeSelection({product_id, limit}: Props) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleSubmit = () => {
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					<Plus className="w-4 h-4" />
					Add
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[100vh]">
				<DialogTitle>Select Items</DialogTitle>
				<DialogDescription></DialogDescription>
				<SerializeItemRecord
					product_id={product_id}
					limit={limit}
					onSubmit={handleSubmit}
				/>
			</DialogContent>
		</Dialog>
	);
}
