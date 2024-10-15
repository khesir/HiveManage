import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {MoreVertical} from 'lucide-react';
import {useState} from 'react';
import {BenefitsList} from './benefits-list';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {BenefitAdd} from './benefits-add';
import {BenefitsEdit} from './benefits-edit';

export function BenefitsInformationCard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isAdding, setIsAdding] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
	};

	const handleAdd = () => {
		setIsAdding((prev) => !prev);
	};

	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger
					value="item-1"
					className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
				>
					<p className="font-semibold text-lg">Benefits Information</p>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								variant="outline"
								className="absolute right-8"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									handleAdd();
								}}
							>
								Add
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									handleEdit();
								}}
							>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									openModal();
								}}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</AccordionTrigger>
				<AccordionContent>
					{isAdding ? (
						<BenefitAdd onEditToggle={handleAdd} />
					) : isEditing ? (
						<BenefitsEdit onEditToggle={handleEdit} />
					) : (
						<BenefitsList />
					)}
				</AccordionContent>
			</AccordionItem>
			{isModalOpen && (
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Delete Item</DialogTitle>
							<DialogDescription>
								Are you sure you want to delete this item? This action cannot be
								undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={closeModal}>Cancel</Button>
							<Button variant="destructive" onClick={closeModal}>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</Accordion>
	);
}
