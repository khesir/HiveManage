import {ApiRequest, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {dateParser} from '@/lib/util/utils';
import {EmployeeWithRelatedDetails} from '@/modules/ems/_components/validation/employee';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {File} from 'lucide-react';
import {EmployeeRolesWithDetails} from '../_components/validation/employeeRoles';
import {Skeleton} from '@/components/ui/skeleton';

interface EmployeeProfileProps {
	selectedEmployee: EmployeeRolesWithDetails | null;
}

export function EmployeeProfile({selectedEmployee}: EmployeeProfileProps) {
	const navigate = useNavigate();
	const [employeDetails, setEmployeeDetails] =
		useState<EmployeeWithRelatedDetails>();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (!selectedEmployee) {
			return; // Exit early if no employee is selected
		}

		const fetchReferencedData = async () => {
			setLoading(true);
			try {
				const res = await request<ApiRequest<EmployeeWithRelatedDetails[]>>(
					'GET',
					`api/v1/ems/employees/${selectedEmployee.employee.employee_id}`,
				);
				setEmployeeDetails(res.data[0] as EmployeeWithRelatedDetails);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchReferencedData();
	}, [selectedEmployee]);

	// Render early if no selected employee
	if (!selectedEmployee) {
		return <Card>No selected employee</Card>;
	}

	// Render loading state
	if (loading) {
		return <Skeleton className="flex h-[500px]" />;
	}
	return (
		<div>
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					<div className="grid gap-0.5">
						<CardTitle className="group flex items-center gap-2 text-lg">
							{selectedEmployee.employee.lastname},{' '}
							{selectedEmployee.employee.firstname}
						</CardTitle>
						<CardDescription>
							Hired date: {dateParser(selectedEmployee.created_at ?? '')}
						</CardDescription>
					</div>
					<div className="ml-auto flex items-center gap-1">
						<Button
							size="sm"
							variant="outline"
							className="h-8 gap-1"
							onClick={() => {
								navigate(`view/${selectedEmployee.employee.employee_id}`);
							}}
						>
							<File className="h-3.5 w-3.5" />
							<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
								View More
							</span>
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-6 text-sm">
					{employeDetails?.personal_information && (
						<div className="grid gap-3">
							<div className="font-semibold">Personal Information</div>
							<ul className="grid gap-3">
								{/* Example data; replace with actual data from fetched info */}
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Birthday</span>
									<span>
										{dateParser(employeDetails.personal_information.birthday)}
									</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Gender</span>
									<span>{employeDetails.personal_information.sex}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Phone</span>
									<span>{employeDetails.personal_information.phone}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Email</span>
									<span>{employeDetails.employee.email}</span>
								</li>
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Address</span>
									<span>
										{employeDetails.personal_information.address_line}
									</span>
								</li>
							</ul>
							{/* Uncomment and update for actual data */}
							{/* <Separator className="my-2" />
											<ul className="grid gap-3">
													<li className="flex items-center justify-between">
															<span className="text-muted-foreground">Subtotal</span>
															<span>$299.00</span>
													</li>
													<li className="flex items-center justify-between">
															<span className="text-muted-foreground">Shipping</span>
															<span>$5.00</span>
													</li>
													<li className="flex items-center justify-between">
															<span className="text-muted-foreground">Tax</span>
															<span>$25.00</span>
													</li>
													<li className="flex items-center justify-between font-semibold">
															<span className="text-muted-foreground">Total</span>
															<span>$329.00</span>
													</li>
											</ul> */}
						</div>
					)}
					{/*  I don't know if this is a good thing */}
					{employeDetails?.employment_information.department.name && (
						<>
							<Separator className="my-4" />
							<div className="grid gap-3">
								<div className="font-semibold">Employment Information</div>
								<dl className="grid gap-3">
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Department</dt>
										<dd>
											{employeDetails.employment_information.department.name}
										</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Designation</dt>
										<dd>
											{employeDetails.employment_information.designation.title}
										</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Employee Type</dt>
										<dd>
											{employeDetails.employment_information.employee_type}
										</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Employee Status</dt>
										<dd>
											{employeDetails.employment_information.employee_status}
										</dd>
									</div>
								</dl>
							</div>
						</>
					)}
					{!employeDetails?.employment_information.department.name &&
					!employeDetails?.personal_information ? (
						<p className="flex justify-center">No Available Information</p>
					) : (
						''
					)}
				</CardContent>
				{/* <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
					<div className="text-xs text-muted-foreground">
						Updated <time dateTime="2023-11-23">November 23, 2023</time>
					</div>
					<Pagination className="ml-auto mr-0 w-auto">
						<PaginationContent>
							<PaginationItem>
								<Button size="icon" variant="outline" className="h-6 w-6">
									<ChevronLeft className="h-3.5 w-3.5" />
									<span className="sr-only">Previous Order</span>
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button size="icon" variant="outline" className="h-6 w-6">
									<ChevronRight className="h-3.5 w-3.5" />
									<span className="sr-only">Next Order</span>
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</CardFooter> */}
			</Card>
		</div>
	);
}
