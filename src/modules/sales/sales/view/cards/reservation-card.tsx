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
import {Borrow, borrowItemSchema} from '@/lib/sales-zod-schema';
import {zodResolver} from '@hookform/resolvers/zod';
import {MoreVertical} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';

export function ReservationCard() {
	const {data} = useServiceFormStore();
	const [res, setRes] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [borrow, setBorrow] = useState<Borrow>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await request<ApiRequest<Borrow[]>>(
					'GET',
					`api/v1/sms/service/${data?.service_id}/borrow`,
				);
				const _data = response.data as Borrow[];
				console.log(_data);
				if (_data.length > 0) {
					setBorrow(_data[0]);
				} else {
					setBorrow(undefined);
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
		fetchData();
	}, [data]);

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	// Form
	const form = useForm<Borrow>({
		resolver: zodResolver(borrowItemSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
		if (borrow) {
			form.reset({
				borrow_date: borrow.borrow_date,
				return_date: borrow.return_date,
				fee: borrow.fee,
				status: borrow.status,
			});
		}
	};

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
	const gender = [
		{id: 1, name: 'Male'},
		{id: 2, name: 'Female'},
		{id: 3, name: 'Others'},
	];

	const processForm = async (formData: Borrow) => {
		try {
			setSubmitLoading(true);
			console.log(formData);
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
	const borrow_status = [
		'Requested',
		'Approved',
		'Borrowed',
		'Returned',
		'Overdue',
		'Rejected',
		'Cancelled',
		'Lost',
		'Damaged',
	];
	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger
					value="item-1"
					className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
				>
					<p className="font-semibold text-lg">Reservation Service</p>
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
										name="fee"
										render={({field}) => (
											<FormItem>
												<FormLabel>Joborder Fee</FormLabel>
												<FormControl>
													<Input disabled={true} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="borrow_date"
										render={({field}) => (
											<FormItem>
												<FormLabel>Start</FormLabel>
												<FormControl>
													<Input type="date" disabled={loading} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="return_date"
										render={({field}) => (
											<FormItem>
												<FormLabel>End</FormLabel>
												<FormControl>
													<Input type="date" disabled={loading} {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="status"
										render={({field}) => (
											<FormItem>
												<FormLabel>Borrow Status</FormLabel>
												<Select
													disabled={loading}
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
														{borrow_status.map((data, index) => (
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
					) : borrow === undefined ? (
						<div className="flex justify-center">
							<Button
								onClick={() => {
									handleEdit();
								}}
							>
								Add Personal Info Data
							</Button>
						</div>
					) : (
						<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Borrow Date</span>
									<span>{borrow?.borrow_date}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Reture Date</span>
									<span>{borrow?.return_date}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Fee</span>
									<span>{borrow?.fee}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Status</span>
									<span>{borrow?.status}</span>
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
