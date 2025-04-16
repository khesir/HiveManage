import {PaginationResponse, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {EmployeeWithRelatedDetails} from '@/modules/ems/_components/validation/employee';
import {useEffect, useState} from 'react';
import useEmployeeStore from './use-employee-list-hook';
export function SearchEmployee() {
	const [employees, setEmployees] = useState<EmployeeWithRelatedDetails[]>([]);
	const [selectedEmployee, setSelectedEmployee] =
		useState<EmployeeWithRelatedDetails>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const {selectedEmployees, appendEmployee} = useEmployeeStore();

	// Function to handle customer search
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch all customers from the backend
				const response = await request<
					PaginationResponse<EmployeeWithRelatedDetails>
				>('GET', `/api/v1/ems/employees?no_pagination=true`);
				setEmployees(response.data);
			} catch (error) {
				console.error('Error fetching customer:', error);
				setEmployees([]);
			}
		};
		fetchData();
	}, []);
	useEffect(() => {
		const filtered = employees.filter(
			(employee) =>
				!selectedEmployees.some(
					(selected) =>
						selected.employee.employee_id === employee.employee.employee_id,
				),
		);
		setEmployees(filtered);
	}, [selectedEmployees]);
	const handleAppendEmployee = (employee: EmployeeWithRelatedDetails) => {
		appendEmployee(employee);
		setEmployees((prevEmployees) =>
			prevEmployees.filter(
				(e) => e.employee.employee_id !== employee.employee.employee_id,
			),
		);
	};

	return (
		<div className="flex flex-col gap-2">
			<h1 className="font-semibold">Add Employee</h1>
			{/* ShadCN Command Component for displaying search results */}
			<Command>
				<CommandInput placeholder="Search for a customer..." />
				<CommandList className="max-h-[350px]">
					{employees.length > 0 ? (
						<CommandGroup heading="Customers">
							{employees.map((employee) => (
								<CommandItem
									key={employee.employee.employee_id}
									onSelect={() => {
										setSelectedEmployee(employee);
										setIsModalOpen(true);
									}}
								>
									<div className="flex items-center gap-3">
										<div className="flex-1">
											<p className="font-semibold">{`${employee.employee.firstname} ${employee.employee.middlename} ${employee.employee.lastname}`}</p>
											<p className="text-sm text-gray-500">
												{employee.employee.email}
											</p>
										</div>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					) : (
						<p className="p-3 text-sm text-gray-500">No customers found.</p>
					)}
				</CommandList>
			</Command>
			{isModalOpen && (
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle> Selected employee</DialogTitle>
							<DialogDescription>
								<Card className="p-4">
									<p className="font-semibold">{`${selectedEmployee?.employee.firstname} ${selectedEmployee?.employee.middlename} ${selectedEmployee?.employee.lastname}`}</p>
									<p className="text-sm text-gray-500">
										{selectedEmployee?.employee.email}
									</p>
								</Card>
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
							<Button
								onClick={() => {
									setIsModalOpen(false);
									handleAppendEmployee(selectedEmployee!);
								}}
							>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
