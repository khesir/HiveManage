import {useSalesHook} from '@/components/hooks/use-sales-hook';
import {Button} from '@/components/ui/button';
import {Card, CardFooter} from '@/components/ui/card';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
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
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';

import {JoborderSetting} from '@/modules/_configSettings/config';
import {
	Joborder,
	joborderSchema,
	JobOrderType,
} from '@/modules/joborder/_components/validation/joborder';
import {PaginationResponse, request} from '@/api/axios';
import {toast} from 'sonner';

interface JoborderProps {
	handleIsEditing: (value: string, fee: number | undefined) => void;
	fee: number;
}

export function JoborderForm({handleIsEditing, fee}: JoborderProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [status, setStatus] = useState<string[]>([]);
	useEffect(() => {
		const statusJO = new JoborderSetting();
		setStatus(statusJO.getJoborderStatus());
	}, []);

	const [joborderTypes, setJoborderTypes] = useState<JobOrderType[]>([]);
	useEffect(() => {
		const fetchData = async () => {
			const response = await request<PaginationResponse<JobOrderType>>(
				'GET',
				'/api/v1/sms/joborder-types',
			);
			setJoborderTypes(response.data);
		};
		fetchData();
	}, []);

	const form = useForm<Joborder>({
		resolver: zodResolver(joborderSchema),
		defaultValues: {
			joborder_type_id: undefined,
			uuid: generateCustomUUID(),
			fee: fee,
			joborder_status: undefined,
		},
	});

	const {salesHookData, setSaleHookData} = useSalesHook();

	const processForm = (formData: Joborder) => {
		// Process data here
		setLoading(true);
		try {
			if (!salesHookData['service']) {
				toast.error('Create service First!');
			}
			const existingJoborders = salesHookData['sales_product'] || [];
			const existingJoborder = existingJoborders.find(
				(exisitingData) =>
					exisitingData.record.record_number === formData.joborder_type_id &&
					exisitingData.record.type === 'Joborder',
			);

			if (existingJoborder) {
				toast.error('Can only hold 1 joborder per transaction');
				return;
			}
			const typeData = joborderTypes.find(
				(row) =>
					row.joborder_type_id!.toString() ===
					formData.joborder_type_id?.toString(),
			);
			const serviceData = {
				record: {
					record_number: formData.joborder_type_id,
					uuid: formData.uuid,
					total_price: formData.fee,
					price: formData.fee,
					joborder_type: typeData?.name,
					type: 'Joborder',

					joborder_type_id: formData.joborder_type_id,
					fee: formData.fee,
					total_price_cost: formData.fee,
					joborder_status: formData.joborder_status,
				},
			};
			setSaleHookData('sales_product', [serviceData], 'append');

			const updateService = {
				service: {
					...salesHookData['service'][0].service,
					has_job_order: true,
				},
			};
			console.log(updateService);
			setSaleHookData('service', [updateService], 'clear');
			setLoading(false);
			handleIsEditing('', undefined);
		} catch (e) {
			console.log(e);
			toast.error('Unexpected Error on submission');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-8"
			>
				<Button onClick={() => handleIsEditing('', undefined)}>Back</Button>
				{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
				<Card className="flex flex-col">
					<div className="flex flex-col gap-3 pl-5 pt-5">
						<h1 className="font-semibold text-lg">Job order</h1>
						<p className="text-muted-foreground text-md">
							Setup joborder, to add for listing
						</p>
					</div>
					<div className="gap-8 md:grid md:grid-cols-3 p-5">
						<FormField
							control={form.control}
							name="uuid"
							render={({field}) => (
								<FormItem>
									<FormLabel>UUID</FormLabel>
									<FormControl>
										<Input disabled={true} {...field} />
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
									<FormLabel>Fee</FormLabel>
									<FormControl>
										<Input disabled={loading} {...field} />
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
									<FormLabel>Type</FormLabel>
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
											{joborderTypes.map((jo) => (
												<SelectItem
													key={jo.joborder_type_id}
													value={jo.joborder_type_id!.toString()}
												>
													{jo.name}
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
							name="joborder_status"
							render={({field}) => (
								<FormItem>
									<FormLabel>Status</FormLabel>
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

					<CardFooter className="flex justify-end">
						<Button type="submit">Submit</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
