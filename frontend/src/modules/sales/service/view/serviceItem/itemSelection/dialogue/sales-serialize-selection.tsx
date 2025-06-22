import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
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
					{`Select (${limit}) Serialize Items`}
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
