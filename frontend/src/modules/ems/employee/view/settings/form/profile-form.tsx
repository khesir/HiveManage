import {ApiRequest, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {DropdownMenu, DropdownMenuContent} from '@/components/ui/dropdown-menu';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {appendFormData} from '@/lib/util/utils';
import {UpdateEmployee} from '@/modules/ems/_components/api/employee';
import {
	EmployeeBasicInformation,
	employeeSchema,
} from '@/modules/ems/_components/validation/employee';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';
import {Position} from '@/modules/ems/_components/validation/position';
import {Role} from '@/modules/ems/_components/validation/role';
import {zodResolver} from '@hookform/resolvers/zod';
import {DropdownMenuTrigger} from '@radix-ui/react-dropdown-menu';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {toast} from 'sonner';

interface Props {
	selectedEmployee: EmployeeRolesWithDetails;
}

export function ProfileForm({selectedEmployee}: Props) {
	const [profileData, setProfileData] =
		useState<EmployeeRolesWithDetails>(selectedEmployee);
	const [loading, setLoading] = useState<boolean>(false);
	const [position, setPosition] = useState<Position[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);
	const [selectedImage, setSelectedImage] = useState<string | null>(
		selectedEmployee?.employee.profile_link ?? null,
	);
	const [removeImage, setRemoveImage] = useState<boolean>(false);
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const [positionResponse, roleResponse] = await Promise.all([
					request<ApiRequest<Position>>('GET', '/api/v1/ems/position'),
					request<ApiRequest<Role>>('GET', '/api/v1/ems/roles'),
				]);

				setPosition(
					Array.isArray(positionResponse.data)
						? positionResponse.data
						: [positionResponse.data],
				);
				setRoles(
					Array.isArray(roleResponse.data)
						? roleResponse.data
						: [roleResponse.data],
				);
			} catch (e) {
				console.log(e);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const form = useForm<EmployeeBasicInformation>({
		resolver: zodResolver(employeeSchema),
		defaultValues: {
			position_id: profileData.employee.position.position_id?.toString(),
			firstname: profileData.employee.firstname,
			middlename: profileData.employee.middlename,
			lastname: profileData.employee.lastname,
			email: profileData.employee.email,
			profile_link: undefined as File | undefined,
			role_id: profileData.role.role_id?.toString(),
		},
		mode: 'onChange',
	});

	const processForm = async (data: EmployeeBasicInformation) => {
		try {
			setLoading(true);
			const formData = new FormData();
			appendFormData(
				{
					...data,
					remove_image: removeImage,
					profile_link: removeImage ? undefined : data.profile_link,
				},
				formData,
			);
			const res = await UpdateEmployee(
				formData,
				profileData.employee.employee_id,
			);
			setProfileData(res);
			toast.success('Profile Updated');
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (
		e: React.ChangeEvent<HTMLInputElement> | undefined,
		remove_image: boolean,
	) => {
		if (remove_image) {
			setSelectedImage(null);
			setRemoveImage(true);
		} else {
			const file = e!.target.files?.[0];
			if (file) {
				const reader = new FileReader();

				reader.onloadend = () => {
					setSelectedImage(reader.result as string);
				};

				reader.readAsDataURL(file);
				setRemoveImage(false);
			}
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Profile</h3>
				<p className="text-sm text-muted-foreground">
					This is how others will see you on the site.
				</p>
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(processForm)}
					className="w-full space-y-6"
				>
					<div className="flex flex-col gap-5">
						<div className="flex-1 gap-8 md:grid md:grid-cols-3 h-full">
							<FormField
								control={form.control}
								name="firstname"
								render={({field}) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input disabled={loading} placeholder="John" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="middlename"
								render={({field}) => (
									<FormItem>
										<FormLabel>Middle Name</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												placeholder="Mike (Optional)"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastname"
								render={({field}) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input disabled={loading} placeholder="Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="flex gap-5 items-center">
							<div className="flex-1 grid gap-4 h-full">
								<Card>
									<CardHeader>
										<CardTitle className="text-lg font-medium">
											Account Information
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-5">
										<FormField
											control={form.control}
											name="email"
											render={({field}) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															type="text"
															disabled={loading}
															placeholder="john@example.com"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														This is an email account that will be used for login
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="position_id"
											render={({field}) => (
												<FormItem>
													<FormLabel>Position</FormLabel>
													<Select
														disabled={loading}
														onValueChange={(value) => field.onChange(value)}
														value={field.value?.toString()}
														defaultValue={field.value?.toString()}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	defaultValue={field.value}
																	placeholder="Select a Position"
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{position.map((data, key) => (
																<SelectItem
																	key={key}
																	value={data.position_id?.toString() ?? ''}
																>
																	{data.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormDescription>
														Admin only, change positions to access other role
														specific pages, only 1 position at a time
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="role_id"
											render={({field}) => (
												<FormItem>
													<FormLabel>Role</FormLabel>
													<Select
														disabled={loading}
														onValueChange={(value) => field.onChange(value)}
														value={field.value?.toString()}
														defaultValue={field.value?.toString()}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	defaultValue={field.value}
																	placeholder="Select a Role"
																/>
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{roles.map((data, key) => (
																<SelectItem
																	key={key}
																	value={data.role_id?.toString() ?? ''}
																>
																	{data.name}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormDescription>
														Admin only, change role to access other role
														specific features
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
							</div>

							<div className="relative flex-0 flex flex-col items-center gap-5">
								<div className="overflow-hidden rounded-full w-[250px] h-[250px] border-2">
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
											<Button className="w-full min-w-[100px] max-w-full">
												{removeImage ? 'Add Profile picture' : 'Edit'}
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
																	handleFileChange(e, false);
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<Button
												className="w-full"
												variant={'destructive'}
												onClick={() => handleFileChange(undefined, true)}
											>
												Remove Image
											</Button>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<div className="space-x-2">
							<Button type="submit">Save</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
