import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState} from 'react';
import ServiceProductList from './service-product-list';

export function ServiceItemDialog() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleSubmit = () => {
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">Add Service Items</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[100vh]">
				<DialogTitle className="flex gap-2 items-center">
					Service Item
				</DialogTitle>
				<DialogDescription></DialogDescription>
				<ServiceProductList onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	);
}
