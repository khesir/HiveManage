import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Plus} from 'lucide-react';
import {useCallback, useState} from 'react';
import {AddOrderProductForm} from './add-order-product-form';

export function AddOrderProductDialogue() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					<Plus className="w-4 h-4" />
					Add Product
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Add Product</DialogTitle>
				<DialogDescription></DialogDescription>
				<AddOrderProductForm onSubmit={handleFormSubmit} />
			</DialogContent>
		</Dialog>
	);
}
