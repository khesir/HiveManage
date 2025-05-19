import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {toast} from 'sonner';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import {useState} from 'react';
import {request} from '@/api/axios';
import {Skeleton} from '@/components/ui/skeleton';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {
	SerializeItem,
	serializeItemSchema,
} from '@/components/validation/serialize-items';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Input} from '@/components/ui/input';
import useEventTrigger from '@/modules/inventory/_components/hooks/use-event-trigger';

interface Props {
	onSubmit?: () => void;
	serializeItem: SerializeItem;
}

export function UpdateInventorySerialRecord({serializeItem, onSubmit}: Props) {
	const [loading, setLoading] = useState(false);
	const {id} = useParams();
	const form = useForm<SerializeItem>({
		resolver: zodResolver(serializeItemSchema),
		defaultValues: {
			serial_id: serializeItem.serial_id,
			product_id: Number(id),
			supplier_id: serializeItem.supplier_id,
			condition: serializeItem.condition,
			status: serializeItem.status,
			purpose: serializeItem.purpose,
		},
		mode: 'onSubmit',
	});
	const {toggleTrigger} = useEventTrigger();
	const processForm = async (data: SerializeItem) => {
		try {
			setLoading(true);
			console.log(data);
			await request(
				'PUT',
				`/api/v1/ims/product/${id}/serializeRecord/${serializeItem.serial_id}`,
				data,
			);
			toast.success('Record Updated');
			if (onSubmit) {
				onSubmit();
			}
			toggleTrigger();
		} catch (error) {
			let errorMessage = 'An unexpected error occurred';
			if (axios.isAxiosError(error)) {
				errorMessage =
					error.response?.data?.message || // Use the `message` field if available
					error.response?.data?.errors?.[0]?.message || // If `errors` array exists, use the first error's message
					'Failed to process request';
			}
			console.log(error);
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const status = [
		'Sold',
		'Available',
		'Pending Payment',
		'On Order',
		'In Service',
		'Awaiting Service',
		'Return Requested',
	];
	const condtion = ['New', 'Secondhand', 'Broken'];
	const purpose = ['Rent', 'Service', 'Sales'];

	if (loading) {
		return <Skeleton className="flex h-[600px]" />;
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-3"
			>
				{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
				<div className="flex gap-3 items-center border p-2 rounded-sm cursor-default">
					<AvatarCircles
						avatar={[
							{
								link:
									typeof serializeItem.supplier?.profile_link === 'string'
										? serializeItem.supplier?.profile_link
										: '',
								name: serializeItem.supplier?.name ?? '',
							},
						]}
					/>
					<span>{serializeItem.supplier?.name}</span>
				</div>
				<FormField
					control={form.control}
					name="serial_code"
					render={({field}) => (
						<FormItem>
							<FormLabel>Serial Code</FormLabel>
							<FormControl>
								<Input
									disabled={loading}
									placeholder="Serial #####-#####"
									{...field}
								/>
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="warranty_date"
					render={({field}) => (
						<FormItem>
							<FormLabel>Warranty Date</FormLabel>
							<FormControl>
								<Input
									type="date"
									disabled={loading}
									className="text-gray-400"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="condition"
					render={({field}) => (
						<FormItem>
							<FormLabel>Condition</FormLabel>
							<Select
								disabled={loading}
								onValueChange={(value) => field.onChange(value)}
								value={field.value}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											defaultValue={field.value}
											placeholder="Select Status"
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{condtion.map((x, key) => (
										<SelectItem key={key} value={x}>
											{x}
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
					name="status"
					render={({field}) => (
						<FormItem>
							<FormLabel>Status</FormLabel>
							<Select
								disabled={loading}
								onValueChange={(value) => field.onChange(value)}
								value={field.value}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											defaultValue={field.value}
											placeholder="Select Status"
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{status.map((x, key) => (
										<SelectItem key={key} value={x}>
											{x}
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
					name="purpose"
					render={({field}) => (
						<FormItem>
							<FormLabel>Purpose</FormLabel>
							<Select
								disabled={loading}
								onValueChange={(value) => field.onChange(value)}
								value={field.value}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											defaultValue={field.value}
											placeholder="Select Item Purpose"
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{purpose.map((x, key) => (
										<SelectItem key={key} value={x}>
											{x}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end">
					<div className="space-x-2">
						<Button type="submit">Save</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
