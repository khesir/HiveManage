import {Button} from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {useState} from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {request} from '@/api/axios';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Skeleton} from '@/components/ui/skeleton';
import {Textarea} from '@/components/ui/textarea';
import {zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {appendFormData} from '@/lib/util/utils';
import {Supplier, supplierSchema} from '@/components/validation/supplier';
import {Switch} from '@/components/ui/switch';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';

export function CreateSupplierForm() {
	const [loading, setLoading] = useState(false);
	const {user} = useEmployeeRoleDetailsStore();

	const form = useForm<Supplier>({
		resolver: zodResolver(supplierSchema),
		mode: 'onChange',
		defaultValues: {
			status: false,
		},
	});

	const processForm = async (data: Supplier) => {
		try {
			setLoading(true);
			const newData = {
				name: data.name,
				remarks: data.remarks,
				relationship: data.relationship,
				status: data.status ? 'Available' : 'Unavailable',
				contact_number: data.contact_number,
				profile_link: data.profile_link,
				user: user?.employee.employee_id,
			};
			const formData = new FormData();
			appendFormData(newData, formData);
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
		} finally {
			setLoading(false);
		}
	};

	const [selectedImage, setSelectedImage] = useState<string | null>();
	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement> | undefined,
	) => {
		const file = e!.target.files?.[0];
		if (file) {
			const imgUrl = URL.createObjectURL(file);
			setSelectedImage(imgUrl);
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
	if (loading) {
		return <Skeleton className="flex h-[600px]" />;
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(processForm)}
				className="w-full space-y-3 px-5"
			>
				<pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
				<div className="flex flex-col md:flex-row gap-5 items-center">
					<div className=" flex flex-col items-center gap-5 md:order-1 md:flex-[1_1_30%] min-w-[200px]">
						<div className="relative">
							<div className="overflow-hidden rounded-full w-[300px] h-[300px] border-2">
								<img
									src={
										selectedImage
											? selectedImage
											: `https://api.dicebear.com/7.x/lorelei/svg?seed=JD`
									}
									alt="Selected profile"
									className="object-cover w-full h-full"
								/>
							</div>
							<div className="absolute bottom-0 left-0">
								<DropdownMenu>
									<DropdownMenuTrigger>
										<Button className="w-full min-w-[200px] max-w-full">
											Attach Image
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="space-y-2 p-3">
										<FormField
											control={form.control}
											name="profile_link"
											render={({field}) => (
												<FormItem>
													<FormControl>
														<Input
															type="file"
															disabled={loading}
															onChange={(e) => {
																field.onChange(e.target.files?.[0]);
																handleFileChange(e);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
					<Card className="flex flex-col gap-5 p-5 md:flex-[1_1_50%] min-w-[300px]">
						<p className="text-lg font-semibold">Create Supplier</p>
						<div className="flex flex-col gap-5">
							<div className="flex-1 gap-3 flex flex-col h-full">
								<FormField
									control={form.control}
									name="name"
									render={({field}) => (
										<FormItem>
											<FormLabel>Supplier name</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="John"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Names can&apos;t be all numbers. Use letters, numbers,
												dashes, or underscores.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="remarks"
									render={({field}) => (
										<FormItem>
											<FormLabel>Remarks</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe what is this product"
													disabled={loading}
													className="resize-none overflow-y-auto"
													{...field}
													value={field.value ?? ''}
												/>
											</FormControl>
											<FormDescription>
												Only letters, numbers, dashes, and underscores are
												allowed
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`relationship`}
									render={({field}) => (
										<FormItem>
											<FormLabel>Relationship</FormLabel>
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
								<FormField
									control={form.control}
									name="contact_number"
									render={({field}) => (
										<FormItem>
											<FormLabel>Contact</FormLabel>
											<FormControl>
												<Input
													disabled={loading}
													placeholder="0932-132-1222"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="status"
									render={({field}) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">Status</FormLabel>
												<FormDescription>
													Supplier availability — Available, Unavailable.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={!!field.value}
													onCheckedChange={field.onChange}
													aria-readonly
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<Button
								disabled={loading}
								type="submit"
								className="bg-green-400 hover:bg-green-400"
							>
								Submit
							</Button>
						</div>
					</Card>
				</div>
			</form>
		</Form>
	);
}
