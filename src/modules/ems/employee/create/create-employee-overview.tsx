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
import {Separator} from '@/components/ui/separator';
import useConfirmStore from '@/hooks/use-confirm-store';
import useEmployeeFormStore from '@/hooks/use-create-employee-view';
import {dateParser} from '@/lib/util/utils';
import {CreditCard, MoreVertical} from 'lucide-react';

export function CreateEmployeeOverview() {
	const {data} = useEmployeeFormStore();
	const {status, setStatus} = useConfirmStore();

	return (
		<div>
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					<div className="grid gap-0.5">
						<CardTitle className="group flex items-center gap-2 text-lg">
							{data?.basicInformation.lastname},{' '}
							{data?.basicInformation.firstname}
						</CardTitle>
						<CardDescription>
							Hired date: {dateParser(new Date().toISOString())}
						</CardDescription>
					</div>
					<div className="ml-auto flex items-center gap-1">
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
					<div className="grid gap-3">
						<div className="font-semibold">Personal Information</div>
						<ul className="grid gap-3">
							{/* Example data; replace with actual data from fetched info */}
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Birthday</span>
								<span>
									{dateParser(data?.personalInformation.birthday ?? '')}
								</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Gender</span>
								<span>{data?.personalInformation.gender}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Email</span>
								<span>{data?.personalInformation.email}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Phone</span>
								<span>{data?.personalInformation.phone}</span>
							</li>
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Address</span>
								<span>{data?.personalInformation.address_line}</span>
							</li>
						</ul>
					</div>

					<Separator className="my-4" />
					<div className="grid gap-3">
						<div className="font-semibold">Employment Information</div>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Department</dt>
								<dd>{data?.employmentInformation.department}</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Designation</dt>
								<dd>{data?.employmentInformation.designation}</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Employee Type</dt>
								<dd>{data?.employmentInformation.employee_type}</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Employee Status</dt>
								<dd>{data?.employmentInformation.employment_status}</dd>
							</div>
						</dl>
					</div>

					<Separator className="my-4" />
					<div className="grid gap-3">
						<div className="font-semibold">Salary Information</div>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Base Salary</dt>
								<dd>{data?.salaryInformation.base_salary}</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Payroll Frequency</dt>
								<dd>{data?.salaryInformation.payroll_frequency}</dd>
							</div>
						</dl>
					</div>
					<Separator className="my-4" />
					<div className="grid gap-3">
						<div className="font-semibold">Payment Information</div>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="flex items-center gap-1 text-muted-foreground">
									<CreditCard className="h-4 w-4" />
									Bank Account Number
								</dt>
								<dd>{data?.financialInformation.bank_account_number}</dd>
							</div>
						</dl>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="flex items-center gap-1 text-muted-foreground">
									<CreditCard className="h-4 w-4" />
									Pag-Ibig
								</dt>
								<dd>{data?.financialInformation.pag_ibig_id}</dd>
							</div>
						</dl>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="flex items-center gap-1 text-muted-foreground">
									<CreditCard className="h-4 w-4" />
									Phil Health
								</dt>
								<dd>{data?.financialInformation.philhealth_id}</dd>
							</div>
						</dl>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="flex items-center gap-1 text-muted-foreground">
									<CreditCard className="h-4 w-4" />
									SSS
								</dt>
								<dd>{data?.financialInformation.sss_id}</dd>
							</div>
						</dl>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="flex items-center gap-1 text-muted-foreground">
									<CreditCard className="h-4 w-4" />
									TIN ID
								</dt>
								<dd>{data?.financialInformation.tin}</dd>
							</div>
						</dl>
					</div>
				</CardContent>
				<CardFooter className="flex flex-row items-center justify-between border-t bg-muted/50 px-6 py-3">
					<div className="text-xs text-muted-foreground">
						Please review and confirm the data above
					</div>
					<Button
						disabled={status === true}
						size={'sm'}
						variant={'outline'}
						onClick={() => {
							setStatus(!status);
						}}
					>
						Confirm
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
