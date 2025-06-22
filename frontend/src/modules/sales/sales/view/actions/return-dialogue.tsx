import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Upload} from 'lucide-react';
import {useCallback, useState} from 'react';
import {SalesItem} from '@/components/validation/sales_item';
import {ReturnForm} from './return-form';

interface Props {
	salesItem: SalesItem;
}
export function ReturnDialogue({salesItem}: Props) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button
					size={'sm'}
					className="flex items-center gap-1"
					disabled={salesItem.warranty_used}
				>
					<Upload className="h-4 w-4" />
					<div>Return Form</div>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle></DialogTitle>
				<DialogDescription></DialogDescription>
				<ReturnForm onSubmit={handleFormSubmit} salesItem={salesItem} />
			</DialogContent>
		</Dialog>
	);
}
