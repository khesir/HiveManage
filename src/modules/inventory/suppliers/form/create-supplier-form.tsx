import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Plus} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Supplier, supplierSchema} from '../../_components/validation/supplier';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {ApiRequest, request} from '@/api/axios';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Skeleton} from '@/components/ui/skeleton';
import {Textarea} from '@/components/ui/textarea';
import {zodResolver} from '@hookform/resolvers/zod';
import {Separator} from '@radix-ui/react-dropdown-menu';
import axios, {AxiosError} from 'axios';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {Category} from '../../_components/validation/category';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Badge} from '@/components/ui/badge';
import {ScrollArea} from '@/components/ui/scroll-area';
import {appendFormData} from '@/lib/util/utils';
interface Formprops {
	isModalOpen?: boolean;
	closeModal: () => void;
}

export function CreateSupplierDialogForm({isModalOpen, closeModal}: Formprops) {
	return (
		<Dialog open={isModalOpen} onOpenChange={closeModal}>
			{/* Call closeModal to handle the modal state */}
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" /> New Supplier
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Create Supplier Form</DialogTitle>
					<DialogDescription>Fill up the fields</DialogDescription>
				</DialogHeader>
				<ScrollArea className="max-h-[600px]">
					<CreateSupplierForm closeModal={closeModal} />
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}

function CreateSupplierForm({closeModal}: Formprops) {
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const [categories, setCategories] = useState<Category[]>([]);

	const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const categoryResult = await request<ApiRequest<Category>>(
					'GET',
					`/api/v1/ims/category?no_pagination=true`,
				);

				setCategories(
					Array.isArray(categoryResult.data)
						? categoryResult.data
						: [categoryResult.data],
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

	const form = useForm<Supplier>({
		resolver: zodResolver(supplierSchema),
		mode: 'onChange',
	});

	const processForm = async (data: Supplier) => {
		try {
			closeModal();
			const newData = {
				name: data.name,
				remarks: data.remarks,
				relationship: data.relationship,
				contact_number: data.contact_number,
				profile_link: data.profile_link,
				product_categories: selectedCategories,
			};
			const formData = new FormData();
			appendFormData(newData, formData);
			console.log('FormData contents:', ...formData.entries());
			await request('POST', `/api/v1/ims/supplier`, formData);
			toast.success('Supplier Added');
			// navigate(-1);
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

	const [imgUrl, setImgUrl] = useState<string | null>();
	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement> | undefined,
	) => {
		const file = e!.target.files?.[0];
		if (file) {
			const imgUrl = URL.createObjectURL(file);
			setImgUrl(imgUrl);
		}
	};

	const relationship = [
		'manufacturer',
		'distributor',
		'wholesaler',
		'vendor',
		'authorized dealer',
		'OEM (Original Equipment Manufacturer)',
		'peripheral supplier',
		'component reseller',
		'refurbished parts supplier',
		'specialized parts supplier',
		'network hardware supplier',
		'value-added reseller',
		'accessories supplier',
		'logistics partner',
	];
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
				className="w-full space-y-3 px-5"
			>
				{/* <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre> */}
				<div className="gap-3 flex flex-col h-full">
					<FormField
						control={form.control}
						name="name"
						render={({field}) => (
							<FormItem>
								<FormLabel>Product name</FormLabel>
								<FormControl>
									<Input disabled={loading} placeholder="John" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="remarks"
						render={({field}) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Describe what is this product"
										disabled={loading}
										className="resize-none overflow-y-auto"
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
									name="profile_link"
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
					<FormField
						control={form.control}
						name="contact_number"
						render={({field}) => (
							<FormItem>
								<FormLabel>Product name</FormLabel>
								<FormControl>
									<Input
										disabled={loading}
										placeholder="0932-132-1222"
										type="number"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="w-full">
						<DropdownMenu>
							<DropdownMenuTrigger className="flex flex-col text-sm font-semibold gap-2">
								<p>Category</p>
								<Button
									variant={'outline'}
									className="border w-[400px] max-h-full flex flex-wrap justify-start gap-3"
									style={{whiteSpace: 'normal'}}
								>
									{selectedCategories.length > 0 ? (
										<div className="flex items-start gap-3 flex-wrap">
											{selectedCategories.slice(0, 4).map((category) => (
												<Badge
													key={category.category_id}
													variant={'secondary'}
													className="rounded-sm px-1 font-normal"
												>
													{category.name}
												</Badge>
											))}
											{selectedCategories.length > 4 && (
												<Badge
													variant={'secondary'}
													className="rounded-sm px-1 font-normal"
												>
													+{selectedCategories.length - 4}
												</Badge>
											)}
										</div>
									) : (
										<p className="text-gray-500">No categories selected</p>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="flex flex-col">
								<Button
									variant={'ghost'}
									onClick={() => setSelectedCategories([])}
								>
									Remove all filters
								</Button>
								<Separator />
								{categories.map((data, index) => {
									const isSelected = selectedCategories.some(
										(category) => category.category_id === data.category_id,
									);

									return (
										<Button
											key={index}
											variant={isSelected ? 'default' : 'ghost'}
											onClick={() => {
												if (isSelected) {
													setSelectedCategories((prev) =>
														prev.filter(
															(category) =>
																category.category_id !== data.category_id,
														),
													);
												} else {
													setSelectedCategories((prev) => [...prev, data]);
												}
											}}
										>
											{data.name}
										</Button>
									);
								})}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<FormField
						control={form.control}
						name={`relationship`}
						render={({field}) => (
							<FormItem>
								<FormLabel>Suppliers (optional)</FormLabel>
								<Select
									disabled={loading}
									onValueChange={field.onChange}
									value={field.value}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												defaultValue={field.value}
												placeholder="Select a Relationship"
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{relationship.map((data, key) => (
											<SelectItem key={key} value={data.toString()}>
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
				<DialogFooter>
					<Button type="submit">Submit</Button>
				</DialogFooter>
			</form>
		</Form>
	);
}
