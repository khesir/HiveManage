import {ApiRequest, request} from '@/api/axios';
import useServiceFormStore from '@/components/hooks/use-service-store';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {generateCustomUUID} from '@/lib/util/utils';
import {zodResolver} from '@hookform/resolvers/zod';
import {MoreVertical} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';

import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {
	AssignEmployeeWithDetails,
	Joborder,
	joborderSchema,
	JobOrderType,
	JobOrderWithDetails,
} from '@/modules/sales/_components/validation/joborder';
import {AssignEmployeeModal} from '@/modules/sales/_components/modal/assign-employee-modal';
import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee';
import {
	CreateJoborder,
	DeleteJobOrder,
	UpdateJobOrder,
} from '@/modules/sales/_components/api/submit-joborder';
import {JoborderSetting} from '@/modules/_configSettings/config';

export function JobOrderCard() {
	const {id} = useParams();
	const {data} = useServiceFormStore();
	const [res, setRes] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [joborder, setJoborder] = useState<JobOrderWithDetails | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const fee = 100;
	const generatedUUID = generateCustomUUID();
	const [joborderType, setJoborderType] = useState<JobOrderType[] | null>(null);
	const [employee, setEmployee] = useState<EmployeeBasicInformation[]>([]);
	const [assignEmployee, setAssignEmployees] = useState<
		AssignEmployeeWithDetails[]
	>([]);
	const [status, setStatus] = useState<string[]>();
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [joborderRes, joborderTypeRes] = await Promise.all([
					request<ApiRequest<JobOrderWithDetails[]>>(
						'GET',
						`api/v1/sms/service/${data?.service_id}/joborder`,
					),

					request<ApiRequest<JobOrderType[]>>(
						'GET',
						`api/v1/sms/joborder-types`,
					),
				]);
				const joborderData =
					(joborderRes.data[0] as JobOrderWithDetails) || null;
				if (joborderData) {
					const assignedEmployees = await request<
						ApiRequest<AssignEmployeeWithDetails[]>
					>(
						'GET',
						`/api/v1/sms/service/${id}/joborder/${joborderData.joborder_id}/assigned-employee`,
					).then((data) => data.data as AssignEmployeeWithDetails[]);

					const employeeData = assignedEmployees.map(
						(assignEmp) => assignEmp.employee,
					);

					setAssignEmployees(assignedEmployees);
					setEmployee(employeeData);
					setJoborder(joborderData);
				}
				setJoborderType((joborderTypeRes.data as JobOrderType[]) || null);
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
		fetchData();
		setStatus(JoborderSetting.getInstance().getJoborderStatus());
	}, [data]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = async () => {
		await handleDelete();
		setIsModalOpen(false);
	};

	const handleDelete = async () => {
		try {
			setSubmitLoading(true);
			if (joborder?.joborder_id !== undefined) {
				await DeleteJobOrder(joborder.joborder_id);
				setJoborder(null);
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
	// Form
	const form = useForm<Joborder>({
		resolver: zodResolver(joborderSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
		if (joborder) {
			form.reset({
				joborder_type_id: Number(joborder.joborder_type?.joborder_type_id),
				uuid: joborder?.uuid,
				fee: joborder?.fee,
				joborder_status: joborder?.joborder_status as
					| 'Pending'
					| 'In Progress'
					| 'Completed'
					| 'On Hold'
					| 'Cancelled'
					| 'Awaiting Approval'
					| 'Approved'
					| 'Rejected'
					| 'Closed',
			});
		} else {
			form.reset({
				joborder_type_id: undefined,
				uuid: generatedUUID,
				fee: fee,
				joborder_status: undefined,
			});
		}
	};

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
	const processForm = async (formData: Joborder) => {
		try {
			setSubmitLoading(true);
			if (joborder) {
				// Update endpoint
				const res = await UpdateJobOrder(formData, id!, joborder.joborder_id!);
				setJoborder(res);
				toast('Joborder Successfully Updated!');
			} else {
				// Create endpoint
				const res = await CreateJoborder(formData, id!);
				setJoborder(res);
				toast('Joborder Successfully Created!');
			}
		} catch (error) {
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
			console.log(error);
		} finally {
			setSubmitLoading(false);
			handleEdit();
		}
	};

	// TODO: Implement Job order type
	// const [joborderType, setJobOrderType] = useState<JobOrderType>();
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const response = await request
	// 		setJobOrderType()
	// 	}
	// 	fetchData();
	// },[])
	if (!joborder || !status) {
		return (
			<Card>
				<p>Joborder does not exist or something went wrong with form data</p>
			</Card>
		);
	}
	return (
		<Accordion
			type="single"
			collapsible
			className="w-full"
			defaultValue='item-1"'
		>
			<AccordionItem value="item-1">
				<AccordionTrigger
					value="item-1"
					className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
				>
					<p className="font-semibold text-lg">Joborder Service</p>
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
										name="uuid"
										render={({field}) => (
											<FormItem>
												<FormLabel>Joborder UUID</FormLabel>
												<FormControl>
													<Input
														{...field}
														disabled={true}
														placeholder="Auto Generated"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="fee"
										render={({field}) => (
											<FormItem>
												<FormLabel>Joborder Fee</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="Fee"
														disabled={submitLoading}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="joborder_type_id"
										render={({field}) => (
											<FormItem>
												<FormLabel>Joborder Type</FormLabel>
												<Select
													disabled={submitLoading}
													onValueChange={(value) =>
														field.onChange(Number(value))
													}
													value={field.value ? field.value.toString() : ''}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																defaultValue={field.value}
																placeholder="Select a type"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{joborderType?.map(
															(jo) =>
																jo.joborder_type_id !== undefined && (
																	<SelectItem
																		key={jo.joborder_type_id}
																		value={jo.joborder_type_id.toString()}
																	>
																		{jo.name}
																	</SelectItem>
																),
														)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="joborder_status"
										render={({field}) => (
											<FormItem>
												<FormLabel>Joborder Status</FormLabel>
												<Select
													disabled={submitLoading}
													onValueChange={field.onChange}
													value={field.value ? field.value.toString() : ''}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																defaultValue={field.value}
																placeholder="Select a status"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{status?.map((data, index) => (
															<SelectItem key={index} value={data}>
																{data}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
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
					) : joborder === undefined || joborder == null ? (
						<div className="flex justify-center">
							<Button
								onClick={() => {
									handleEdit();
								}}
							>
								Add Joborder
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							<div className="flex justify-between">
								{joborder?.joborder_id !== undefined && (
									<ActionsCell id={joborder.joborder_id} />
								)}
								<AssignEmployeeModal
									assignEmployee={assignEmployee}
									joborder_id={joborder.joborder_id ?? null}
									prevEmployees={employee}
								/>
							</div>
							<Card
								x-chunk="dashboard-05-chunk-3"
								className="gap-8 p-4 md:grid"
							>
								<ul className="grid gap-3">
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">UUID</span>
										<span>{joborder?.uuid}</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">Fee</span>
										<span>{joborder?.fee}</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">Type</span>
										<span>{joborder?.joborder_type?.name}</span>
									</li>
									<li className="flex items-center justify-between">
										<span className="text-muted-foreground">Status</span>
										<span>{joborder?.joborder_status}</span>
									</li>
								</ul>
							</Card>
						</div>
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
const ActionsCell = ({id}: {id: number}) => {
	const navigate = useNavigate();
	const location = useLocation();

	const handleClick = (id: number) => {
		if (location.pathname.includes('/sales')) {
			navigate(`/sales/services/joborders/view/${id}`);
		} else if (location.pathname.includes('/admin')) {
			navigate(`/admin/sales/services/joborders/view/${id}`);
		} else if (location.pathname.includes('/tech')) {
			navigate(`/tech/services/joborders/view/${id}`);
		}
	};
	return (
		<Button onClick={() => handleClick(id)} variant={'outline'}>
			View Full details
		</Button>
	);
};
