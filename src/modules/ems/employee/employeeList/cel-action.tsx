'use client';
import {AlertDialog} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {EmployeeBasicInformation} from '@/lib/employee-zod-schema';
import {Edit, MoreHorizontal, Trash} from 'lucide-react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

interface CellActionProps {
	data: EmployeeBasicInformation;
}

export const CellAction: React.FC<CellActionProps> = ({data}) => {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const onConfirm = async () => {};

	return (
		<>
			<AlertDialog open={open} onOpenChange={setOpen} />
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					<DropdownMenuItem
						onClick={() => navigate(`/dashboard/user/${data.id}`)}
					>
						<Edit className="mr-2 h-4 w-4" /> Update
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="mr-2 h-4 w-4" /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
