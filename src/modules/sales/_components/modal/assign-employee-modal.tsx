import {PaginationResponse, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee-zod-schema';
import {DoubleArrowLeftIcon, DoubleArrowRightIcon} from '@radix-ui/react-icons';
import {ChevronLeftIcon, ChevronRightIcon, UserCircle} from 'lucide-react';
import {useState, useEffect} from 'react';
import {useSearchParams, useNavigate, useParams} from 'react-router-dom';
import {Badge} from '@/components/ui/badge';
import {ScrollArea} from '@/components/ui/scroll-area';
import {toast} from 'sonner';
import {AssignEmployeeWithDetails} from '@/lib/sales-zod-schema';
import {ProcessAssignEmployee} from '../api/process-assign-employee';
import {useEmployeeStore} from '../../sales/view/hooks/use-employee-list';

interface AssignEmployeeProps {
	joborder_id: number | null;
	assignEmployee: AssignEmployeeWithDetails[];
	prevEmployees: EmployeeBasicInformation[];
	isService?: boolean;
}

export function AssignEmployeeModal({
	joborder_id,
	assignEmployee,
	prevEmployees,
	isService = true,
}: AssignEmployeeProps) {
	const [searchParams] = useSearchParams();
	const {id} = useParams();
	const navigate = useNavigate();
	const {selectedEmployee, addEmployee, removeEmployee, setSelectedEmployee} =
		useEmployeeStore();
	const [employee, setEmployee] = useState<EmployeeBasicInformation[]>([]);

	const [pageCount, setPageCount] = useState<number>(0);
	const [pageLimit, setPageLimit] = useState<number>(
		Number(searchParams.get('limit')) || 10,
	);

	const page = Number(searchParams.get('page')) || 1;
	const offset = (page - 1) * pageLimit;
	const sort = searchParams.get('sort') || null;
	const currentPage = offset / pageLimit + 1;
	const pageSizeOptions = [10, 20, 30, 50, 100];
	useEffect(() => {
		if (prevEmployees) {
			setSelectedEmployee(prevEmployees);
		} else {
			setSelectedEmployee([]);
		}
	}, [prevEmployees]);
	useEffect(() => {
		const fetchItems = async () => {
			const res = await request<PaginationResponse<EmployeeBasicInformation>>(
				'GET',
				`/api/v1/ems/employees?limit=${pageLimit}&offset=${offset}` +
					(sort ? `&sort=${sort}` : ''),
			);
			setEmployee(res.data);
			setPageCount(Math.ceil(res.total_data / pageLimit));
		};
		fetchItems();
	}, [offset, pageLimit]);

	const handlePaginationChange = (newPage: number) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('page', String(newPage));
		newParams.set('limit', String(pageLimit));
		navigate({search: newParams.toString()});
	};
	const handlePageLimitChange = (newLimit: number) => {
		setPageLimit(newLimit);
	};
	const handleSelect = (data: EmployeeBasicInformation) => {
		setEmployee((prevEmployees) =>
			prevEmployees.filter((emp) => emp.employee_id !== data.employee_id),
		);
		addEmployee(data);
	};
	const handleDelete = (data: EmployeeBasicInformation) => {
		if (!employee.some((emp) => emp.employee_id === data.employee_id)) {
			setEmployee((prevEmployees) => [data, ...prevEmployees]);
		}
		removeEmployee(data.employee_id!);
	};

	const processData = async () => {
		try {
			if (id && joborder_id && assignEmployee) {
				await ProcessAssignEmployee(
					selectedEmployee,
					assignEmployee,
					joborder_id,
					id,
				);
				closeModal();
				return true;
			}
			toast('Failed Processing Data');
		} catch (error) {
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
			console.log(error);
		}
	};
	const [isModalOpen, setIsModalOpen] = useState(false);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	console.log(selectedEmployee);
	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogTrigger asChild>
				{isService ? (
					<Button variant="secondary" className="group relative w-[200px]">
						<div className="group-hover:hidden  space-x-3 flex">
							<span>{`${selectedEmployee.length} : Employee Assigned`}</span>
							<UserCircle />
						</div>
						<span className="hidden group-hover:inline">Add employee</span>
					</Button>
				) : (
					<Button size="sm" variant="default" className="h-8 gap-1">
						<UserCircle className="h-3.5 w-3.5" />
						<p className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
							Manage Employees
						</p>
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-5xl">
				<DialogHeader className="font-semibold text-lg">
					Assign Employee
				</DialogHeader>
				<DialogDescription className="text-muted-foreground text-md">
					Assign or remove an employee here in the list
				</DialogDescription>
				<div className="flex justify-between">
					<div className="flex flex-1 flex-col gap-8">
						<div className="w-full">
							<span className="text-lg font-semibold">{`${selectedEmployee.length} : Employee Selected`}</span>
						</div>
						<ScrollArea className="h-[calc(80vh-210px)] px-2">
							<div className="flex flex-col gap-3">
								{selectedEmployee.map((employee) => (
									<Card
										className="relative w-full h-[100px] overflow-hidden"
										key={employee.employee_id}
									>
										<div className="flex justify-start">
											<CardHeader className="flex flex-col justify-start">
												<CardTitle className="font-semibold text-sm  hover:underline">
													{`${employee.lastname}, ${employee.firstname} ${employee.middlename}`}
												</CardTitle>
												<CardDescription>
													<div className="space-x-1">
														<Badge>Role</Badge>
													</div>
												</CardDescription>
											</CardHeader>
										</div>
										<div className="absolute bottom-1 right-3 gap-2 flex items-center justify-end">
											<Button
												variant={'destructive'}
												onClick={() => handleDelete(employee)}
											>
												Remove
											</Button>
										</div>
									</Card>
								))}
							</div>
						</ScrollArea>
						<Button className="mx-5" onClick={processData}>
							Process Data
						</Button>
					</div>
					<div className="flex flex-1 flex-col gap-5">
						<div className="w-full">
							<Input placeholder="Search Something" className="w-full" />
						</div>
						<ScrollArea className="h-[calc(80vh-210px)] px-2">
							<div className="flex flex-col gap-3">
								{employee.map((employee) => (
									<Card
										className="relative w-full h-[100px] overflow-hidden"
										key={employee.employee_id}
									>
										<div className="flex justify-start">
											<CardHeader className="flex flex-col justify-start">
												<CardTitle className="font-semibold text-sm  hover:underline">
													{`${employee.lastname}, ${employee.firstname} ${employee.middlename}`}
												</CardTitle>
												<CardDescription>
													<div className="space-x-1">
														<Badge>Role</Badge>
													</div>
												</CardDescription>
											</CardHeader>
										</div>
										<div className="absolute bottom-1 right-3 gap-2 flex items-center justify-end">
											<Button
												className="bg-green-400 hover:bg-green-200"
												onClick={() => handleSelect(employee)}
											>
												Add
											</Button>
										</div>
									</Card>
								))}
							</div>
						</ScrollArea>
						<div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
							<div className="flex w-full items-center justify-between">
								<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
									<div className="flex items-center space-x-2">
										<p className="whitespace-nowrap text-sm font-medium">
											Rows per page
										</p>
										<Select
											value={pageLimit.toString()}
											onValueChange={(value: string) =>
												handlePageLimitChange(Number(value))
											}
										>
											<SelectTrigger className="h-8 w-[70px]">
												<SelectValue placeholder={pageLimit.toString()} />
											</SelectTrigger>
											<SelectContent side="top">
												{pageSizeOptions.map((size) => (
													<SelectItem key={size} value={`${size}`}>
														{size}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
							<div className="flex w-[200px] items-center justify-center text-sm font-medium">
								Page {currentPage} of {pageCount}
							</div>
							<div className="flex items-center space-x-2">
								<Button
									aria-label="Go to first page"
									variant="outline"
									className="hidden h-8 w-8 p-0 lg:flex"
									onClick={() => handlePaginationChange(1)}
									disabled={currentPage === 1}
								>
									<DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
								</Button>
								<Button
									aria-label="Go to previous page"
									variant="outline"
									className="h-8 w-8 p-0"
									onClick={() => handlePaginationChange(currentPage - 1)}
									disabled={currentPage === 1}
								>
									<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
								</Button>
								<Button
									aria-label="Go to next page"
									variant="outline"
									className="h-8 w-8 p-0"
									onClick={() => handlePaginationChange(currentPage + 1)}
									disabled={currentPage === pageCount}
								>
									<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
								</Button>
								<Button
									aria-label="Go to last page"
									variant="outline"
									className="hidden h-8 w-8 p-0 lg:flex"
									onClick={() => handlePaginationChange(pageCount)}
									disabled={currentPage === pageCount}
								>
									<DoubleArrowRightIcon
										className="h-4 w-4"
										aria-hidden="true"
									/>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
