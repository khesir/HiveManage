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
import {
	FinancialInformation,
	financialInformationSchema,
} from '@/lib/employee-zod-schema';
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
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';

export function EmployeeFinancialInformationCard() {
	const {selectedEmployee} = useEmployeeStore();
	const [res, setRes] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [financialInfo, setFinancialInfo] = useState<FinancialInformation>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (!selectedEmployee || !selectedEmployee.employee_id) return; // Guard clause

		const fetchsalaryInfo = async () => {
			setLoading(true);
			try {
				const response = await request<ApiRequest<FinancialInformation[]>>(
					'GET',
					`api/v1/ems/employees/${selectedEmployee.employee_id}/financialInformation`,
				);
				const data = response.data as FinancialInformation[];
				console.log(data);
				if (data.length > 0) {
					setFinancialInfo(data[0]);
				} else {
					setFinancialInfo(undefined);
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
	const form = useForm<FinancialInformation>({
		resolver: zodResolver(financialInformationSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
		if (financialInfo) {
			form.reset({
				pag_ibig_id: financialInfo.pag_ibig_id,
				sss_id: financialInfo.sss_id,
				philhealth_id: financialInfo.philhealth_id,
				tin: financialInfo.tin,
				bank_account_number: financialInfo.bank_account_number,
			});
		}
	};

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);

	const processForm = async (formData: FinancialInformation) => {
		try {
			setSubmitLoading(true);
			if (!selectedEmployee) {
				throw new Error('No Employee is selected');
			}
			if (financialInfo) {
				// Update Employment Information
				console.log(financialInfo.financial_id);
				await request(
					'PUT',
					`/api/v1/ems/employees/${selectedEmployee.employee_id}/financialInformation/${financialInfo.financial_id}`,
					formData,
				);
			} else {
				// Create Employment Information
				await request(
					'POST',
					`/api/v1/ems/employees/${selectedEmployee.employee_id}/financialInformation`,
					formData,
				);
			}
			const response = await request<ApiRequest<FinancialInformation[]>>(
				'GET',
				`api/v1/ems/employees/${selectedEmployee.employee_id}/financialInformation`,
			);
			const data = response.data as FinancialInformation[];

			if (data.length > 0) {
				setFinancialInfo(data[0]);
			} else {
				setFinancialInfo(undefined);
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
					<p className="font-semibold text-lg">Financial Information</p>
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
										name="pag_ibig_id"
										render={({field}) => (
											<FormItem>
												<FormLabel>Pag Ibig ID</FormLabel>
												<FormControl>
													<Input
														disabled={submitLoading}
														placeholder="1234"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sss_id"
										render={({field}) => (
											<FormItem>
												<FormLabel>SSS ID</FormLabel>
												<FormControl>
													<Input
														disabled={submitLoading}
														placeholder="1234"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="philhealth_id"
										render={({field}) => (
											<FormItem>
												<FormLabel>Philhealth</FormLabel>
												<FormControl>
													<Input
														disabled={submitLoading}
														placeholder="1234"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="tin"
										render={({field}) => (
											<FormItem>
												<FormLabel>TIN ID</FormLabel>
												<FormControl>
													<Input
														disabled={submitLoading}
														placeholder="1234"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="bank_account_number"
										render={({field}) => (
											<FormItem>
												<FormLabel>Bank Account Number</FormLabel>
												<FormControl>
													<Input
														disabled={submitLoading}
														placeholder="1234
                          "
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
					) : financialInfo === undefined ? (
						<div className="flex justify-center">
							<Button
								onClick={() => {
									handleEdit();
								}}
							>
								Add Financial Info Data
							</Button>
						</div>
					) : (
						<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Pag Ibig</span>
									<span>{financialInfo.pag_ibig_id}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Philhealth</span>
									<span>{financialInfo.philhealth_id}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">SSS</span>
									<span>{financialInfo.sss_id}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">TIN</span>
									<span>{financialInfo.tin}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">
										Bank Account Number
									</span>
									<span>{financialInfo.bank_account_number}</span>
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
