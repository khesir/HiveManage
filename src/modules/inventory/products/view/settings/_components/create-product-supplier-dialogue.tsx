import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState, useCallback} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {CreateProductSupplierForm} from './create-product-supplier-form';
import {ProductSupplier} from '@/modules/inventory/_components/validation/product-supplier';
interface Props {
	productSuppliers: ProductSupplier[];
}
export function CreateProductSupplierDialogue({productSuppliers}: Props) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);

	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					<Plus className="w-4 h-4" /> Add Supplier
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[2000px]">
				<DialogTitle>Add Product Supplier</DialogTitle>
				<DialogDescription></DialogDescription>
				<CreateProductSupplierForm
					onSubmit={handleFormSubmit}
					productSuppliers={productSuppliers}
				/>
			</DialogContent>
		</Dialog>
	);
}
