import {ApiRequest, request} from '@/api/axios';
import {useEmployeeStore} from '@/components/hooks/use-employee-story';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {formatDate} from '@/lib/util/utils';
import {PersonalInformation, personalInformationSchema} from '@/lib/zod-schema';
import {MoreVertical} from 'lucide-react';
import {useEffect, useState} from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {toast} from 'sonner';
import {Input} from '@/components/ui/input';

export function EmployeePersonalInformationCard() {
	const {selectedEmployee} = useEmployeeStore();
	const [res, setRes] = useState<string | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(false);
	const [personalInfo, setPersonalInfo] = useState<PersonalInformation>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (!selectedEmployee || !selectedEmployee.employee_id) return; // Guard clause

		const fetchEmploymentData = async () => {
			setLoading(true);
			try {
				const response = await request<ApiRequest<PersonalInformation[]>>(
					'GET',
					`api/v1/ems/employees/${selectedEmployee.employee_id}/personalInformation`,
				);
				const data = response.data as PersonalInformation[];
				console.log(data);
				if (data.length > 0) {
					setPersonalInfo(data[0]);
				} else {
					setPersonalInfo(undefined);
				}
			} catch (error) {
				if (error instanceof Error) {
					setRes(error.message);
				} else {
					setRes('Unknown Error has occurred');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchEmploymentData();
	}, [selectedEmployee]); // Only depend on selectedEmployee

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	// Form
	const form = useForm<PersonalInformation>({
		resolver: zodResolver(personalInformationSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
		if (personalInfo) {
			form.reset({
				birthday: formatDate(personalInfo.birthday),
				gender: personalInfo.gender as 'Male' | 'Female',
				phone: personalInfo.phone,
				email: personalInfo.email,
				address_line: personalInfo.address_line,
				postal_code: personalInfo.postal_code,
			});
		}
	};

	const [submitLoading, setSubmitLoading] = useState<boolean>(false);
	const gender = [
		{id: 1, name: 'Male'},
		{id: 2, name: 'Female'},
		{id: 3, name: 'Others'},
	];

	const processForm = async (formData: PersonalInformation) => {
		try {
			setSubmitLoading(true);
			if (!selectedEmployee) {
				throw new Error('No Employee is selected');
			}
			if (personalInfo) {
				// Update Employment Information
				await request(
					'PUT',
					`/api/v1/ems/employees/${selectedEmployee.employee_id}/personalInformation/${personalInfo.personal_information_id}`,
					formData,
				);
			} else {
				// Create Employment Information
				await request(
					'POST',
					`/api/v1/ems/employees/${selectedEmployee.employee_id}/personalInformation`,
					formData,
				);
			}
			// Fetch new Employment Information
			const response = await request<ApiRequest<PersonalInformation[]>>(
				'GET',
				`/api/v1/ems/employees/${selectedEmployee.employee_id}/personalInformation`,
			);
			const data = response.data as PersonalInformation[];

			if (data.length > 0) {
				setPersonalInfo(data[0]);
			} else {
				setPersonalInfo(undefined);
			}
		} catch (error) {
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		} finally {
			setSubmitLoading(false);
			handleEdit();
		}
	};
	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger
					value="item-1"
					className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
				>
					<p className="font-semibold text-lg">Personal Information</p>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="icon"
								variant="outline"
								className="absolute right-8"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									handleEdit();
								}}
							>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={(e) => {
									e.stopPropagation();
									openModal();
								}}
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</AccordionTrigger>
				<AccordionContent>
					{loading ? (
						<div>Loading...</div>
					) : res ? (
						<div>Error: {res}</div>
					) : isEditing ? (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(processForm)}
								className="w-full space-y-2"
							>
								<Card className="gap-8 md:grid md:grid-cols-3 p-5">
									<FormField
										control={form.control}
										name="gender"
										render={({field}) => (
											<FormItem>
												<FormLabel>Gender</FormLabel>
												<Select
													disabled={submitLoading}
													onValueChange={field.onChange}
													value={field.value}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue
																defaultValue={field.value}
																placeholder="Select a country"
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{gender.map((gender) => (
															<SelectItem key={gender.id} value={gender.name}>
																{gender.name}
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
										name="email"
										render={({field}) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														disabled={loading}
														placeholder="johndoe@gmail.com"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="phone"
										render={({field}) => (
											<FormItem>
												<FormLabel>Contact Number</FormLabel>
												<FormControl>
													<Input
														disabled={submitLoading}
														type="number"
														placeholder="Enter you contact number"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="birthday"
										render={({field}) => (
											<FormItem>
												<FormLabel>Birthday</FormLabel>
												<FormControl>
													<Input
														type="date"
														disabled={submitLoading}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="address_line"
										render={({field}) => (
											<FormItem>
												<FormLabel>Address Line</FormLabel>
												<FormControl>
													<Input
														disabled={submitLoading}
														placeholder="Full Address"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="postal_code"
										render={({field}) => (
											<FormItem>
												<FormLabel>Postal code</FormLabel>
												<Input
													disabled={submitLoading}
													placeholder="Code"
													{...field}
												/>
												<FormMessage />
											</FormItem>
										)}
									/>
								</Card>
								<div className="flex justify-end">
									<div className="space-x-2">
										<Button type="submit">Save</Button>
										<Button
											type="button"
											variant={'destructive'}
											onClick={handleEdit}
										>
											Cancel
										</Button>
									</div>
								</div>
							</form>
						</Form>
					) : personalInfo === undefined ? (
						<div className="flex justify-center">
							<Button
								onClick={() => {
									handleEdit();
								}}
							>
								Add Personal Info Data
							</Button>
						</div>
					) : (
						<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Gender</span>
									<span>{personalInfo.gender}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Email</span>
									<span>{personalInfo.email}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Phone</span>
									<span>{personalInfo.phone}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Birthday</span>
									<span>{personalInfo.birthday}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">AddressLine</span>
									<span>{personalInfo.address_line}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Postal Code</span>
									<span>{personalInfo.postal_code}</span>
								</li>
							</ul>
						</Card>
					)}
				</AccordionContent>
			</AccordionItem>
			{isModalOpen && (
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Delete Item</DialogTitle>
							<DialogDescription>
								Are you sure you want to delete this item? This action cannot be
								undone.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={closeModal}>Cancel</Button>
							<Button variant="destructive" onClick={closeModal}>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</Accordion>
	);
}
