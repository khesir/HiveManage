import {ApiRequest, request} from '@/api/axios';
import {useEmployeeStore} from '@/components/hooks/use-employee-story';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {SalaryInformation, salaryInformationSchema} from '@/lib/zod-schema';
import {MoreVertical} from 'lucide-react';
import {useEffect, useState} from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';

export function EmployeeSalaryInformationCard() {
	const {selectedEmployee} = useEmployeeStore();
	const [res, setRes] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [salaryInfo, setSalaryInfo] = useState<SalaryInformation>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (!selectedEmployee || !selectedEmployee.employee_id) return; // Guard clause

		const fetchsalaryInfo = async () => {
			setLoading(true);
			try {
				const response = await request<ApiRequest<SalaryInformation[]>>(
					'GET',
					`api/v1/ems/employees/${selectedEmployee.employee_id}/salaryInformation`,
				);
				const data = response.data as SalaryInformation[];

				if (data.length > 0) {
					setSalaryInfo(data[0]);
				} else {
					setSalaryInfo(undefined);
				}
			} catch (error) {
				if (error instanceof Error) {
					setRes(error.message);
				} else {
					setRes('Unknown Error has occurred');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchsalaryInfo();
	}, [selectedEmployee]); // Only depend on selectedEmployee

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	// Form
	const form = useForm<SalaryInformation>({
		resolver: zodResolver(salaryInformationSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
		if (salaryInfo) {
			form.reset({
				payroll_frequency: salaryInfo.payroll_frequency as
					| 'Daily'
					| 'Weekly'
					| 'Bi Weekly'
					| 'Semi Monthly'
					| 'Monthly',
				base_salary: salaryInfo.base_salary,
			});
		}
	};

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
	const payroll_frequency = [
		{id: 1, name: 'Daily'},
		{id: 2, name: 'Weekly'},
		{id: 3, name: 'Bi Weekly'},
		{id: 4, name: 'Semi Monthly'},
		{id: 5, name: 'Monthly'},
	];

	const processForm = async (formData: SalaryInformation) => {
		try {
			setSubmitLoading(true);
			if (!selectedEmployee) {
				throw new Error('No Employee is selected');
			}
			if (salaryInfo) {
				// Update Employment Information
				await request(
					'PUT',
					`/api/v1/ems/employees/${selectedEmployee.employee_id}/salaryInformation/${salaryInfo.salary_information_id}`,
					{
						payroll_frequency: formData.payroll_frequency,
						base_salary: Number(formData.base_salary),
					},
				);
			} else {
				// Create Employment Information
				await request(
					'POST',
					`/api/v1/ems/employees/${selectedEmployee.employee_id}/salaryInformation`,
					{
						payroll_frequency: formData.payroll_frequency,
						base_salary: Number(formData.base_salary),
					},
				);
			}
			const response = await request<ApiRequest<SalaryInformation[]>>(
				'GET',
				`api/v1/ems/employees/${selectedEmployee.employee_id}/salaryInformation`,
			);
			const data = response.data as SalaryInformation[];

			if (data.length > 0) {
				setSalaryInfo(data[0]);
			} else {
				setSalaryInfo(undefined);
			}
		} catch (error) {
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		} finally {
			setSubmitLoading(false);
			handleEdit();
		}
	};
	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger
					value="item-1"
					className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
				>
					<p className="font-semibold text-lg">Salary Information</p>
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
					{loading ? (
						<div>Loading...</div>
					) : res ? (
						<div>Error: {res}</div>
					) : isEditing ? (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(processForm)}
								className="w-full space-y-2"
							>
								<Card className="gap-8 md:grid md:grid-cols-3 p-5">
									<FormField
										control={form.control}
										name="payroll_frequency"
										render={({field}) => (
											<FormItem>
												<FormLabel>Payroll Frequency</FormLabel>
												<Select
													disabled={submitLoading}
													onValueChange={field.onChange}
													value={field.value}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																defaultValue={field.value}
																placeholder="Select a Frequency"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{payroll_frequency.map((payroll_frequency) => (
															<SelectItem
																key={payroll_frequency.id}
																value={payroll_frequency.name}
															>
																{payroll_frequency.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="base_salary"
										render={({field}) => (
											<FormItem>
												<FormLabel>Base Salary</FormLabel>
												<FormControl>
													<Input
														disabled={submitLoading}
														placeholder="Base salary"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</Card>
								<div className="flex justify-end">
									<div className="space-x-2">
										<Button type="submit">Save</Button>
										<Button
											type="button"
											variant={'destructive'}
											onClick={handleEdit}
										>
											Cancel
										</Button>
									</div>
								</div>
							</form>
						</Form>
					) : salaryInfo === undefined ? (
						<div className="flex justify-center">
							<Button
								onClick={() => {
									handleEdit();
								}}
							>
								Add Salara Info Data
							</Button>
						</div>
					) : (
						<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">
										Payroll Frequency
									</span>
									<span>{salaryInfo.payroll_frequency}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Base Salary</span>
									<span>{salaryInfo.base_salary}</span>
								</li>
							</ul>
						</Card>
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
