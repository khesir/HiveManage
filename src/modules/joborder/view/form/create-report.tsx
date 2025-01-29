import {Button} from '@/components/ui/button';
import {Card, CardFooter} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';

import {Textarea} from '@/components/ui/textarea';
import useAddFormStatus from '@/modules/sales/_components/hooks/use-ticket-form';
import {JobOrderWithDetails} from '@/modules/sales/_components/validation/joborder';
import {
	Reports,
	reportsSchema,
} from '@/modules/sales/_components/validation/reports';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {zodResolver} from '@hookform/resolvers/zod';
import useTicketArrayStore from '@/modules/sales/_components/hooks/use-ticket-array-store';
import {X} from 'lucide-react';
import {TaskListingModal} from '@/modules/sales/_components/modal/ticket-listing-modal';

interface CreateReportProps {
	data: JobOrderWithDetails | null;
}

export function CreateReport({data}: CreateReportProps) {
	const {setAddStatus} = useAddFormStatus();
	const [loading, setLoading] = useState(false);
	const {
		seledtedTickets,
		removeTicketStoreWithDetails,
		setTicketStoreWithDetails,
	} = useTicketArrayStore();

	useEffect(() => {
		setTicketStoreWithDetails([]);
	}, []);
	const form = useForm<Reports>({
		resolver: zodResolver(reportsSchema),
	});

	const processForm = async (formdata: Reports) => {
		try {
			setLoading(true);
			// TODO: Implement API for processing Report data
			console.log(formdata);
			toast('Error updating employment information:');
		} catch (error) {
			console.log(error);
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		}
		setLoading(false);
	};

	if (!data) {
		return <Card> Somethings wrong with joborder data</Card>;
	}
	return (
		<>
			<div>
				<Button onClick={() => setAddStatus('main')} variant={'destructive'}>
					Back
				</Button>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(processForm)}>
					<Card className="flex flex-col">
						<p className="p-5 text-xl font-semibold">Create Reports</p>

						<div className="flex flex-col gap-3  p-5 pt-0">
							<FormField
								control={form.control}
								name="reports_title"
								render={({field}) => (
									<FormItem>
										<FormControl>
											<Input
												type="text"
												placeholder="Report Title"
												disabled={loading}
												value={field.value}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="col-span-3">
								<FormField
									control={form.control}
									name="remarks"
									render={({field}) => (
										<FormItem>
											<FormLabel>Remarks</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Write your report here"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Card className="flex flex-col gap-3 p-5 mt-5">
									<div className="flex justify-between gap-3 items-center">
										<h1 className="text-lg font-semibold">Attach Items</h1>
										<TaskListingModal title="Add to Report" joborder={data} />
									</div>
									<div className="w-full flex flex-col gap-3">
										{seledtedTickets.map((ticket) => (
											<>
												<div className="flex justify-start gap-3 items-center">
													<X
														className="w-5 h-5 hover:bg-red-600 rounded-sm cursor-pointer "
														onClick={() =>
															removeTicketStoreWithDetails(ticket.remark_id)
														}
													/>
													<p className="hover:underline">{ticket.title}</p>
												</div>
											</>
										))}
									</div>
								</Card>
							</div>
						</div>
						{/* Ticket */}
						<CardFooter className="flex justify-end">
							<Button type="submit">Submit</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</>
	);
}
