import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {toast} from 'sonner';
import axios, {AxiosError} from 'axios';
import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {ApiRequest, request} from '@/api/axios';
import {Skeleton} from '@/components/ui/skeleton';

import {Supplier} from '@/modules/inventory/_components/validation/supplier';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
	SerializeItem,
	serializeItemSchema,
} from '@/modules/inventory/_components/validation/serialize-items';
import {generateCustomUUID} from '@/lib/util/utils';

interface Props {
	onSubmit?: () => void;
}

export function CreateInventorySerialRecord({onSubmit}: Props) {
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const {id} = useParams();
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const supplierData = await request<ApiRequest<Supplier>>(
					'GET',
					`/api/v1/ims/product/${id}/productSupplier?no_pagination=true`,
				);
				setSuppliers(
					Array.isArray(supplierData.data)
						? supplierData.data
						: [supplierData.data],
				);
				// setVariants(
				// 	Array.isArray(productVariantResult.data)
				// 		? productVariantResult.data
				// 		: [productVariantResult.data],
				// );
			} catch (e) {
				if (e instanceof Error) {
					setRes(e.toString());
				} else if (e instanceof AxiosError) {
					setRes(e.response?.data as string);
				} else {
					setRes('An unknown error occured');
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	const uuid = generateCustomUUID();
	const form = useForm<SerializeItem>({
		resolver: zodResolver(serializeItemSchema),
		defaultValues: {
			product_id: Number(id),
			serial_number: uuid,
		},
		mode: 'onChange',
	});
	const processForm = async (data: SerializeItem) => {
		try {
			console.log(data);
			await request('POST', `/api/v1/ims/product/${id}/serializeRecord`, data);
			toast.success('Record Added');
			if (onSubmit) {
				onSubmit();
			}
		} catch (error) {
			let errorMessage = 'An unexpected error occurred';
			if (axios.isAxiosError(error)) {
				errorMessage =
					error.response?.data?.message || // Use the `message` field if available
					error.response?.data?.errors?.[0]?.message || // If `errors` array exists, use the first error's message
					'Failed to process request';
			}

			toast.error(errorMessage);
		}
	};

	const status = [
		'Sold',
		'Pending Payment',
		'On Order',
		'In Service',
		'Awaiting Service',
		'Return Requested',
	];
	const condtion = ['New', 'Secondhand', 'Broken'];
	if (res) {
		return <div className="flex gap-5"> {res} </div>;
	}
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
				<FormField
					control={form.control}
					name="supplier_id"
					render={({field}) => (
						<FormItem>
							<FormLabel>Supplier</FormLabel>
							<Select
								disabled={loading}
								onValueChange={(value) => field.onChange(Number(value))}
								value={field.value?.toString()}
								defaultValue={field.value?.toString()}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											defaultValue={field.value}
											placeholder="Select Supplier"
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{suppliers.map((supplier, key) => (
										<SelectItem
											key={key}
											value={supplier.supplier_id?.toString() ?? ''}
										>
											{supplier.name}
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
					name="external_serial_code"
					render={({field}) => (
						<FormItem>
							<FormLabel>External Serial Code</FormLabel>
							<FormControl>
								<Input
									disabled={loading}
									placeholder="external_warranty_code"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="external_warranty_date"
					render={({field}) => (
						<FormItem>
							<FormLabel>External Warranty Date</FormLabel>
							<FormControl>
								<Input
									type="date"
									disabled={loading}
									{...field}
									value={
										field.value ? field.value.toISOString().split('T')[0] : ''
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="price"
					render={({field}) => (
						<FormItem>
							<FormLabel>Price</FormLabel>
							<FormControl>
								<Input
									type="number"
									{...field}
									disabled={loading}
									placeholder="1000"
									onChange={(e) => {
										const value = e.target.value;
										// Ensure the value is converted to a number
										field.onChange(value ? parseFloat(value) : 0);
									}}
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
				<div className="flex justify-end">
					<div className="space-x-2">
						<Button type="submit">Save</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
