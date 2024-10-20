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
import {
	EmployeeBasicInformation,
	employeeBasicInformationSchema,
} from '@/lib/employee-zod-schema';
import {MoreVertical} from 'lucide-react';
import {useState} from 'react';
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

import {toast} from 'sonner';
import {Input} from '@/components/ui/input';
import {ApiRequest, request} from '@/api/axios';

export function EmployeeInformationCard() {
	const {selectedEmployee, setSelectedEmployee} = useEmployeeStore();
	const [loading, setLoading] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState(false);

	// Form
	const form = useForm<EmployeeBasicInformation>({
		resolver: zodResolver(employeeBasicInformationSchema),
		mode: 'onChange',
	});

	const handleEdit = () => {
		setIsEditing((prev) => !prev);
		if (selectedEmployee) {
			form.reset({
				firstname: selectedEmployee.firstname,
				middlename: selectedEmployee.middlename,
				lastname: selectedEmployee.lastname,
			});
		}
	};

	const processForm = async (formData: EmployeeBasicInformation) => {
		try {
			setLoading(true);
			await request(
				'PUT',
				`/api/v1/ems/employees/${selectedEmployee?.employee_id}`,
				formData,
			);
			const response = await request<ApiRequest<EmployeeBasicInformation>>(
				'GET',
				`/api/v1/ems/employees/${selectedEmployee?.employee_id}`,
			);
			setSelectedEmployee((response.data as EmployeeBasicInformation[])[0]);
		} catch (error) {
			toast('Error updating employment information:', {
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
			});
		} finally {
			handleEdit();
			setLoading(false);
		}
	};

	return (
		<Accordion
			type="single"
			defaultValue={'item-1'}
			collapsible
			className="w-full"
		>
			<AccordionItem value="item-1">
				<AccordionTrigger
					value="item-1"
					className="relative !no-underline  [&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden"
				>
					<p className="font-semibold text-lg">Basic Information</p>
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
						</DropdownMenuContent>
					</DropdownMenu>
				</AccordionTrigger>
				<AccordionContent>
					{isEditing ? (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(processForm)}
								className="w-full space-y-2"
							>
								<Card className="gap-8 md:grid md:grid-cols-3 p-5">
									<FormField
										control={form.control}
										name="firstname"
										render={({field}) => (
											<FormItem>
												<FormLabel>First Name</FormLabel>
												<FormControl>
													<Input
														disabled={loading}
														placeholder="John"
														{...field}
													/>
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
													<Input
														disabled={loading}
														placeholder="Doe"
														{...field}
													/>
												</FormControl>
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
					) : (
						<Card x-chunk="dashboard-05-chunk-3" className="gap-8 p-4 md:grid">
							<ul className="grid gap-3">
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Firstname</span>
									<span>{selectedEmployee?.firstname}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Middlename</span>
									<span>{selectedEmployee?.middlename}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Lastname</span>
									<span>{selectedEmployee?.lastname}</span>
								</li>
							</ul>
						</Card>
					)}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
