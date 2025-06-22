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
import EmployeeList from './employee-selection-list';

export function AddEmployeeSelection() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleSubmit = () => {
		setFormModal(false);
	};
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					<Plus className="w-4 h-4" />
					Assign
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-[100vh]">
				<DialogTitle>Select Employee</DialogTitle>
				<DialogDescription></DialogDescription>
				<EmployeeList onSubmit={handleSubmit} />
			</DialogContent>
		</Dialog>
	);
}
