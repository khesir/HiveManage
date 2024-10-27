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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Reservation, reservationSchema} from '@/lib/sales-zod-schema';
import {zodResolver} from '@hookform/resolvers/zod';
import {MoreVertical, X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {DeleteReservation} from '../api/delete-reservation';
import {useItemWithDetailsStore} from '@/components/hooks/use-selected-item';
import {ItemLisitingModal} from '@/modules/sales/dashboard/salesOverview/modal/item-listing-modal';
import {useSalesItemWithDetailsStore} from '../hooks/use-sales-item-store';

export function ReservationCard() {
	const {data} = useServiceFormStore();
	const [res, setRes] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [reservation, setReservation] = useState<Reservation>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const {
		selectedItemWithDetails,
		setSelectedItemWithDetails,
		removeItemWithDetails,
	} = useItemWithDetailsStore();
	const {selectedSalesItemWithDetails} = useSalesItemWithDetailsStore();
	useEffect(() => {
		const filterData = () => {
			const filterData = selectedSalesItemWithDetails.filter(
				(entry) => entry.sales_item_type === 'Reservation',
			);
			return filterData;
		};
		filterData();
	}, []);
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await request<ApiRequest<Reservation[]>>(
					'GET',
					`api/v1/sms/service/${data?.service_id}/reserve`,
				);
				const _data = response.data as Reservation[];
				console.log(_data);
				if (_data.length > 0) {
					setReservation(_data[0]);
				} else {
					setReservation(undefined);
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
	const form = useForm<Reservation>({
		resolver: zodResolver(reservationSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setSelectedItemWithDetails([]);
		setIsEditing((prev) => !prev);
		if (reservation) {
			form.reset({
				reserve_status: reservation.reserve_status,
			});
		}
	};

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);

	const handleDelete = async () => {
		try {
			setSubmitLoading(true);
			if (reservation?.reservation_id !== undefined) {
				await DeleteReservation(reservation.reservation_id);
				setReservation(undefined);
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

	const processForm = async (formData: Reservation) => {
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
	const status = ['Reserved', 'Confirmed', 'Cancelled', 'Pending', 'Completed'];

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
										name="reserve_status"
										render={({field}) => (
											<FormItem>
												<FormLabel>Reservation Status</FormLabel>
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
														{status.map((data, index) => (
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
									<Card className="flex flex-col gap-3 p-5 m-5 mt-0">
										<div className="flex justify-between gap-3 items-center">
											<h1 className="text-lg font-semibold">Selected Items</h1>
											<ItemLisitingModal title="Reservation" />
										</div>
										<div className="w-full flex flex-col gap-3">
											{selectedItemWithDetails.map((item) => (
												<>
													<div className="flex justify-start gap-3 items-center">
														<X
															className="w-5 h-5 hover:bg-red-600 rounded-sm cursor-pointer"
															onClick={() =>
																removeItemWithDetails(item.item_id)
															}
														/>
														<p className="hover:underline">
															{item.product.name} - {item.product.supplier.name}
														</p>
													</div>
												</>
											))}
										</div>
									</Card>
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
					) : reservation === undefined ? (
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
									<span className="text-muted-foreground">Reserved Date</span>
									<span>{reservation?.created_at}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Status</span>
									<span>{reservation?.reserve_status}</span>
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
							<Button variant="destructive" onClick={handleDelete}>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</Accordion>
	);
}
