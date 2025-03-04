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
import axios, {AxiosError} from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {ApiRequest, request} from '@/api/axios';
import {Skeleton} from '@/components/ui/skeleton';

import {Supplier} from '@/modules/inventory/_components/validation/supplier';
import {
	ItemRecords,
	itemRecordSchema,
} from '@/modules/inventory/_components/validation/item-record';
import {Product} from '@/modules/inventory/_components/validation/product';

interface Props {
	onSubmit?: () => void;
}

export function CreateInventoryRecord({onSubmit}: Props) {
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const navigate = useNavigate();
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const {id} = useParams();

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const supplierData = await request<ApiRequest<Supplier>>(
					'GET',
					`/api/v1/ims/supplier?no_pagination=true`,
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

	const form = useForm<ItemRecords>({
		resolver: zodResolver(itemRecordSchema),
		mode: 'onChange',
	});
	const processForm = async (data: ItemRecords) => {
		try {
			console.log(data);
			await request('POST', `/api/v1/ims/product/${id}/item-record`, data);
			toast.success('Record Added');
			navigate(-1);
		} catch (error) {
			console.log(error);
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
		'OnStock',
		'Sold',
		'Depleted',
		'Returned',
		'Pending Payment',
		'On Order',
		'In Transit',
		'Return Requested',
		'Pending Inspection',
		'In Service',
		'Under Repair',
		'Awaiting Service',
		'Ready for Pickup',
		'Retired',
	];
	const condtion = [
		'New',
		'Old',
		'Damage',
		'Refurbished',
		'Used',
		'Antique',
		'Repaired',
	];
	if (res) {
		return <div className="flex gap-5"> {res} </div>;
	}
	if (loading) {
		return <Skeleton className="flex h-[600px]" />;
	}
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Record Information</h3>
				<p className="text-sm text-muted-foreground">
					Product Records, this is considered a batch record
				</p>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(processForm)}
					className="w-full space-y-3"
				>
					{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

					<FormItem>
						<FormLabel></FormLabel>
					</FormItem>
				</form>
			</Form>
		</div>
	);
}
