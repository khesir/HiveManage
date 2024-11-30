import {ApiRequest, request} from '@/api/axios';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Form,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Separator} from '@/components/ui/separator';
import {Skeleton} from '@/components/ui/skeleton';
import {appendFormData} from '@/lib/util/utils';
import useTrackReferesh from '@/modules/inventory/_components/hooks/uset-track-refresh';
import {Supplier} from '@/modules/inventory/_components/validation/supplier';
import {
	ProductVariant,
	productVariantSchema,
} from '@/modules/inventory/_components/validation/variants';
import {zodResolver} from '@hookform/resolvers/zod';
import axios, {AxiosError} from 'axios';
import {Trash2Icon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {useParams} from 'react-router-dom';
import {toast} from 'sonner';
interface Formprops {
	handleModal: () => void;
}
export function CreateVariantForm({handleModal}: Formprops) {
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [imgUrl, setImgUrl] = useState<string | null>();
	const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
	const {id} = useParams();
	const {track, setTrack} = useTrackReferesh();

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const supplierResult = await request<ApiRequest<Supplier>>(
					'GET',
					`/api/v1/ims/supplier?no_pagination=true`,
				);
				setSuppliers(
					Array.isArray(supplierResult.data)
						? supplierResult.data
						: [supplierResult.data],
				);
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
	const form = useForm<ProductVariant>({
		resolver: zodResolver(productVariantSchema),
		mode: 'onChange',
	});

	const {fields, append, remove} = useFieldArray({
		control: form.control,
		name: 'attributes', // Field name in the form
	});
	const processForm = async (data: ProductVariant) => {
		try {
			const attributesObject = data.attributes.reduce(
				(acc: Record<string, string | number | boolean>, item) => {
					if (item.key) {
						acc[item.key] = item.value;
					}
					return acc;
				},
				{},
			);
			const newData = {
				variant_name: data.variant_name,
				img_url: data.img_url,
				attribute: attributesObject,
				suppliers: selectedSuppliers.map((supplier) => supplier.supplier_id),
			};
			const formData = new FormData();
			appendFormData(newData, formData);
			await request('POST', `/api/v1/ims/product/${id}/variant`, formData);
			toast.success('Variant Added');
			setTrack(track + 1);
			handleModal();
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

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement> | undefined,
	) => {
		const file = e!.target.files?.[0];
		if (file) {
			const imgUrl = URL.createObjectURL(file);
			setImgUrl(imgUrl);
		}
	};
	if (res) {
		return <Card className="flex gap-5"> {res} </Card>;
	}
	if (loading) {
		return <Skeleton className="flex h-[600px]" />;
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-8"
			>
				<FormField
					control={form.control}
					name="variant_name"
					render={({field}) => (
						<FormItem>
							<FormLabel>Variant Name</FormLabel>
							<FormControl>
								<Input
									disabled={loading}
									placeholder="Variant name"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex flex-col text-sm font-semibold gap-2">
					<p>Image</p>
					<div className="relative flex flex-row items-center text-white font-semibold bg-muted/50 h-[50px]">
						{/* Background Image with Gradient */}
						<div
							className="absolute inset-0 z-0 rounded-lg bg-cover bg-center"
							style={{
								backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url(${imgUrl})`,
							}}
						></div>

						{/* Image as clickable trigger */}
						<div className="relative z-10 flex gap-4 cursor-pointer">
							{/* FormField component to handle file input */}
							<FormField
								control={form.control}
								name="img_url"
								render={({field}) => (
									<FormItem>
										<FormControl>
											{/* Hidden File Input */}
											<Input
												type="file"
												className="bg-transparent border-none"
												disabled={false} // Remove any disabling logic unless necessary
												onChange={(e) => {
													field.onChange(e.target.files?.[0]);
													handleFileChange(e); // Update image URL when file is selected
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>
				<Card className="flex flex-col gap-3 pt-5">
					<ScrollArea className="h-[200px]">
						{fields.map((field, index) => (
							<div key={field.id} className="flex items-center gap-5 px-5">
								<FormField
									control={form.control}
									name={`attributes.${index}.key`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Attribute Key</FormLabel>
											<FormControl>
												<Input
													type="text"
													disabled={loading}
													placeholder="Key"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`attributes.${index}.value`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Attribute Value</FormLabel>
											<FormControl>
												<Input
													type="text"
													disabled={loading}
													placeholder="Value"
													{...field}
													value={String(field.value)}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									variant="outline"
									size="icon"
									className="mt-7"
									onClick={() => remove(index)}
								>
									<Trash2Icon className="h-4 w-4 " />
								</Button>
							</div>
						))}
					</ScrollArea>
					<Button
						size={'sm'}
						type="button"
						onClick={() => append({key: '', value: ''})}
					>
						Add Attribute
					</Button>
				</Card>
				<DropdownMenu>
					<DropdownMenuTrigger className="flex flex-col text-sm gap-3 font-semibold">
						<div className="text-start">
							<p>Supplier / Providers</p>
							<p className="text-gray-400 font-normal">
								All parameters under supplier related to this variant will be
								set to default
							</p>
						</div>
						<Button
							variant={'outline'}
							className="border w-full h-full max-h-full flex flex-wrap justify-start gap-3"
							style={{whiteSpace: 'normal'}}
						>
							{selectedSuppliers.length > 0 ? (
								<div className="flex items-start gap-3 flex-wrap">
									{selectedSuppliers.slice(0, 4).map((supplier) => (
										<Badge
											key={supplier.supplier_id}
											variant={'secondary'}
											className="rounded-sm px-1 font-normal"
										>
											{supplier.name}
										</Badge>
									))}
									{selectedSuppliers.length > 4 && (
										<Badge
											variant={'secondary'}
											className="rounded-sm px-1 font-normal"
										>
											+{selectedSuppliers.length - 4}
										</Badge>
									)}
								</div>
							) : (
								<p className="text-gray-500">No suppliers selected</p>
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="flex flex-col">
						<Button variant={'ghost'} onClick={() => setSelectedSuppliers([])}>
							Remove all filters
						</Button>
						<Separator />
						{suppliers.map((data, index) => {
							const isSelected = selectedSuppliers.some(
								(supplier) => supplier.supplier_id === data.supplier_id,
							);

							return (
								<Button
									key={index}
									variant={isSelected ? 'default' : 'ghost'}
									onClick={() => {
										if (isSelected) {
											setSelectedSuppliers((prev) =>
												prev.filter(
													(supplier) =>
														supplier.supplier_id !== data.supplier_id,
												),
											);
										} else {
											setSelectedSuppliers((prev) => [...prev, data]);
										}
									}}
								>
									{data.name}
								</Button>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
