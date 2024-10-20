import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
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
import {X} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {ItemLisitingModal} from '../modal/item-listing-modal';
import {useItemWithDetailsStore} from '@/components/hooks/use-selected-item';

interface ReservationFormProps {
	handleIsEditing: (value: string, fee: number | undefined) => void;
}

export function ReservationForm({handleIsEditing}: ReservationFormProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const {
		selectedItemWithDetails,
		setSelectedItemWithDetails,
		removeItemWithDetails,
	} = useItemWithDetailsStore();

	useEffect(() => {
		setSelectedItemWithDetails([]);
	}, []);

	const form = useForm<Reservation>({
		resolver: zodResolver(reservationSchema),
		defaultValues: {
			reserve_status: undefined,
		},
	});

	const processForm = (data: Reservation) => {
		setLoading(true);
		console.log(data);
		setLoading(false);
	};
	const status = ['Pending', 'Reserved', 'Confirmed', 'Cancelled', 'Completed'];
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-8"
			>
				<Button onClick={() => handleIsEditing('', undefined)}>Back</Button>

				<Card className="flex flex-col">
					<div className="flex items-center justify-between pr-5">
						<div className="flex flex-col gap-3 pl-5 pt-5">
							<h1 className="font-semibold text-lg">Reserve</h1>
							<p className="text-muted-foreground text-md">
								Setup Reserve, to add for listing
							</p>
						</div>
						<Button>Add to cart</Button>
					</div>
					<div className="gap-8 md:grid md:grid-cols-3 p-5">
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
					</div>
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
											onClick={() => removeItemWithDetails(item.item_id)}
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
			</form>
		</Form>
	);
}
