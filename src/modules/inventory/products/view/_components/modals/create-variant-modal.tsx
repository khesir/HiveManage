import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Shirt} from 'lucide-react';
import {useState} from 'react';
import {CreateVariantForm} from '../form/create-variant-form';

export function CreateVariantModal() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	return (
		<Dialog open={isModalOpen} onOpenChange={handleModal}>
			<DialogTrigger className="w-full" asChild>
				<Button>
					<Shirt className="mr-2 h-5 w-5" /> Create Variant
				</Button>
			</DialogTrigger>
			{/* className="max-w-none w-[120vh] h-[85vh] flex flex-col" */}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Purchase Order Product</DialogTitle>
					<DialogDescription>
						Buttons can be located way at the bottom
					</DialogDescription>
					<CreateVariantForm handleModal={handleModal} />
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
