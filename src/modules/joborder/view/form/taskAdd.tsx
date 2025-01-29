import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import {TicketsSettings} from '@/modules/_configSettings/config';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Button} from '@/components/ui/button';
import {Card, CardFooter} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {ApiRequest, request} from '@/api/axios';
import {Textarea} from '@/components/ui/textarea';
import {ItemLisitingModal} from '@/modules/sales/_components/modal/item-listing-modal';
import {X} from 'lucide-react';
import {useProductWithRelatedDataStore} from '@/modules/sales/_components/hooks/use-selected-item';
import {toast} from 'sonner';
import {useJoborderStore} from '@/modules/sales/_components/hooks/use-joborder-store';
import {SubmitTicket} from '@/modules/sales/_components/api/submit-ticket';
import useAddFormStatus from '@/modules/sales/_components/hooks/use-ticket-form';
import {Task, TaskType, taskSchema} from '../../_components/validation/task';

export function TaskAdd() {
	const {joborderData} = useJoborderStore();
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState<string[]>([]);
	const [taskType, setTaskType] = useState<TaskType[]>([]);
	const {setAddStatus} = useAddFormStatus();
	const {
		selectedProductWithRelatedData,
		setSelectedProductWithRelatedData,
		removeProductWithRelatedData,
	} = useProductWithRelatedDataStore();
	useEffect(() => {
		const setSettings = () => {
			const settings_status = TicketsSettings.getInstance();
			setStatus(settings_status.getRemarkTicketStatus());
		};
		const fetchData = async () => {
			const res = await request<ApiRequest<TaskType>>(
				'GET',
				'/api/v1/sms/remark-type',
			);
			setTaskType(res.data as TaskType[]);
		};
		setSettings();
		fetchData();
		setSelectedProductWithRelatedData([]);
	}, []);

	const form = useForm<Task>({
		resolver: zodResolver(taskSchema),
		mode: 'onChange',
	});
	const processForm = async (formdata: Task) => {
		try {
			setLoading(true);
			await SubmitTicket(formdata, selectedProductWithRelatedData);
			toast('Ticket Created');
			setAddStatus('main');
		} catch (error) {
			console.log(error);
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		}
		setLoading(false);
	};
	if (!taskType || !joborderData) {
		return <Card>Unable to fetch data for the form</Card>;
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
						<p className="p-5 text-xl font-semibold">Create Ticket</p>
						<div className="flex flex-col gap-3  p-5 pt-0">
							<FormField
								control={form.control}
								name="title"
								render={({field}) => (
									<FormItem>
										<FormControl>
											<Input
												type="text"
												placeholder="Ticket Title"
												disabled={loading}
												onChange={field.onChange}
												value={field.value}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({field}) => (
									<FormItem>
										<FormControl>
											<Input
												type="text"
												placeholder="Item Description"
												disabled={loading}
												onChange={field.onChange}
												value={field.value}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						{/* Required Fields */}
						<div className="gap-8 md:grid md:grid-cols-3 p-5">
							<FormField
								control={form.control}
								name="remark_type_id"
								render={({field}) => (
									<FormItem>
										<FormLabel>Remark Type</FormLabel>
										<Select
											disabled={loading}
											onValueChange={(value) => field.onChange(Number(value))}
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
												{taskType.map((data) => (
													<SelectItem
														key={data.remark_type_id}
														value={data.remark_type_id!.toString()}
													>
														{data.name}
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
								name="remarkticket_status"
								render={({field}) => (
									<FormItem>
										<FormLabel>Remark Status</FormLabel>
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
							<FormField
								control={form.control}
								name="deadline"
								render={({field}) => (
									<FormItem>
										<FormLabel>Deadline</FormLabel>
										<FormControl>
											<Input
												type="date"
												disabled={loading}
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="col-span-3">
								<FormField
									control={form.control}
									name="content"
									render={({field}) => (
										<FormItem>
											<FormLabel>Content</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Instructions and all, write here this is a markdown : TODO: Implement Markdown"
													{...field}
													onChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Card className="flex flex-col gap-3 p-5 mt-5">
									<div className="flex justify-between gap-3 items-center">
										<h1 className="text-lg font-semibold">Attach product</h1>
										<ItemLisitingModal title="Add to remark" />
									</div>
									<div className="w-full flex flex-col gap-3">
										{selectedProductWithRelatedData.map((product) => (
											<>
												<div className="flex justify-start gap-3 items-center">
													<X
														className="w-5 h-5 hover:bg-red-600 rounded-sm cursor-pointer "
														onClick={() =>
															removeProductWithRelatedData(product.product_id)
														}
													/>
													<p className="hover:underline">
														{product.product_id}- {product.name}
													</p>
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
