import {ApiRequest, request} from '@/api/axios';
import {useEmployeeStore} from '@/components/hooks/use-employee-story';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@/components/ui/pagination';
import {Separator} from '@/components/ui/separator';
import {dateParser} from '@/lib/util/utils';
import {
	EmploymentInformationNestedForeignKey,
	FinancialInformation,
	PersonalInformation,
	SalaryInformation,
} from '@/lib/zod-schema';
import {
	ChevronLeft,
	ChevronRight,
	CreditCard,
	File,
	MoreVertical,
} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export function EmployeeProfile() {
	const {selectedEmployee} = useEmployeeStore();
	const navigate = useNavigate();

	const [employmentInfo, setEmploymentInfo] =
		useState<EmploymentInformationNestedForeignKey | null>(null);

	const [financialInfo, setFinancialInfo] =
		useState<FinancialInformation | null>(null);

	const [personalInfo, setPersonalInfo] = useState<PersonalInformation | null>(
		null,
	);
	const [salaryInfo, setSalaryInfo] = useState<SalaryInformation | null>(null);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchReferencedData = async () => {
			setLoading(true); // Set loading state to true before fetching
			try {
				if (selectedEmployee?.employee_id) {
					const [employmentRes, financialRes, personalRes, salaryRes] =
						await Promise.all([
							request<ApiRequest<EmploymentInformationNestedForeignKey[]>>(
								'GET',
								`api/v1/ems/employees/${selectedEmployee.employee_id}/employmentInformation`,
							),
							request<ApiRequest<FinancialInformation[]>>(
								'GET',
								`api/v1/ems/employees/${selectedEmployee.employee_id}/financialInformation`,
							),
							request<ApiRequest<PersonalInformation[]>>(
								'GET',
								`api/v1/ems/employees/${selectedEmployee.employee_id}/personalInformation`,
							),
							request<ApiRequest<SalaryInformation[]>>(
								'GET',
								`api/v1/ems/employees/${selectedEmployee.employee_id}/salaryInformation`,
							),
						]);

					// Extract the first item from the array if available
					setEmploymentInfo(
						(
							employmentRes.data as EmploymentInformationNestedForeignKey[]
						)[0] || null,
					);
					setFinancialInfo(
						(financialRes.data as FinancialInformation[])[0] || null,
					);
					setPersonalInfo(
						(personalRes.data as PersonalInformation[])[0] || null,
					);
					setSalaryInfo((salaryRes.data as SalaryInformation[])[0] || null);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false); // Set loading state to false after fetching
			}
		};

		if (selectedEmployee) {
			fetchReferencedData();
		}
	}, [selectedEmployee]);

	if (!selectedEmployee) {
		return <div>No employee selected.</div>;
	}

	if (loading) {
		return <div>Loading...</div>; // Loading indicator
	}

	return (
		<div>
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					<div className="grid gap-0.5">
						<CardTitle className="group flex items-center gap-2 text-lg">
							{selectedEmployee.lastname}, {selectedEmployee.firstname}
						</CardTitle>
						<CardDescription>
							Hired date: {dateParser(selectedEmployee.created_at)}
						</CardDescription>
					</div>
					<div className="ml-auto flex items-center gap-1">
						<Button
							size="sm"
							variant="outline"
							className="h-8 gap-1"
							onClick={() => {
								navigate(`view/${selectedEmployee?.employee_id}`);
							}}
						>
							<File className="h-3.5 w-3.5" />
							<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
								View More
							</span>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="icon" variant="outline" className="h-8 w-8">
									<MoreVertical className="h-3.5 w-3.5" />
									<span className="sr-only">More</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>Edit</DropdownMenuItem>
								{/* <DropdownMenuItem>Export</DropdownMenuItem> */}
								{/* <DropdownMenuSeparator />
															<DropdownMenuItem>Trash</DropdownMenuItem> */}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>
				<CardContent className="p-6 text-sm">
					{personalInfo && (
						<div className="grid gap-3">
							<div className="font-semibold">Personal Information</div>
							<ul className="grid gap-3">
								{/* Example data; replace with actual data from fetched info */}
								<li className="flex items-center justify-between">
									<span className="text-muted-foreground">Birthday</span>
									<span>{dateParser(personalInfo.birthday)}</span>
								</li>
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
									<span className="text-muted-foreground">Address</span>
									<span>{personalInfo.address_line}</span>
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
					{employmentInfo && (
						<>
							<Separator className="my-4" />
							<div className="grid gap-3">
								<div className="font-semibold">Employment Information</div>
								<dl className="grid gap-3">
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Department</dt>
										<dd>{employmentInfo.department.name}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Designation</dt>
										<dd>{employmentInfo.designation.title}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Employee Type</dt>
										<dd>{employmentInfo.employee_type}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Employee Status</dt>
										<dd>{employmentInfo.employee_status}</dd>
									</div>
								</dl>
							</div>
						</>
					)}
					{salaryInfo && (
						<>
							<Separator className="my-4" />
							<div className="grid gap-3">
								<div className="font-semibold">Employment Information</div>
								<dl className="grid gap-3">
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Base Salary</dt>
										<dd>{salaryInfo.base_salary}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Payroll Frequency</dt>
										<dd>{salaryInfo.payroll_frequency}</dd>
									</div>
								</dl>
							</div>
						</>
					)}
					{financialInfo && (
						<>
							<Separator className="my-4" />
							<div className="grid gap-3">
								<div className="font-semibold">Payment Information</div>
								<dl className="grid gap-3">
									<div className="flex items-center justify-between">
										<dt className="flex items-center gap-1 text-muted-foreground">
											<CreditCard className="h-4 w-4" />
											Bank Account Number
										</dt>
										<dd>{financialInfo.bank_account_number}</dd>
									</div>
								</dl>
								<dl className="grid gap-3">
									<div className="flex items-center justify-between">
										<dt className="flex items-center gap-1 text-muted-foreground">
											<CreditCard className="h-4 w-4" />
											Pag-Ibig
										</dt>
										<dd>{financialInfo.pag_ibig_id}</dd>
									</div>
								</dl>
								<dl className="grid gap-3">
									<div className="flex items-center justify-between">
										<dt className="flex items-center gap-1 text-muted-foreground">
											<CreditCard className="h-4 w-4" />
											Phil Health
										</dt>
										<dd>{financialInfo.philhealth_id}</dd>
									</div>
								</dl>
								<dl className="grid gap-3">
									<div className="flex items-center justify-between">
										<dt className="flex items-center gap-1 text-muted-foreground">
											<CreditCard className="h-4 w-4" />
											SSS
										</dt>
										<dd>{financialInfo.sss_id}</dd>
									</div>
								</dl>
								<dl className="grid gap-3">
									<div className="flex items-center justify-between">
										<dt className="flex items-center gap-1 text-muted-foreground">
											<CreditCard className="h-4 w-4" />
											TIN ID
										</dt>
										<dd>{financialInfo.tin}</dd>
									</div>
								</dl>
							</div>
						</>
					)}
				</CardContent>
				<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
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
				</CardFooter>
			</Card>
		</div>
	);
}
