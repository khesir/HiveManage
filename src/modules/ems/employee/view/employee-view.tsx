import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {EmployeeInformationListCard} from './employee-information-list-card';
import {EmployeePayrollCard} from './employee-payroll-card';
import {EmployeeOtherCard} from './employee-other-card';

export function ViewEmployeeDetails() {
	return (
		<Tabs defaultValue="Informations">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="Informations">Informations</TabsTrigger>
					<TabsTrigger value="Payroll">Payroll</TabsTrigger>
					<TabsTrigger value="Others">Others</TabsTrigger>
				</TabsList>
				{/* <div className="ml-auto flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
								<ListFilter className="h-3.5 w-3.5" />
								<span className="sr-only sm:not-sr-only">Filter</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Filter by</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem checked>
								Fulfilled
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
						<File className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only">Export</span>
					</Button>
				</div> */}
			</div>
			<TabsContent value="Informations">
				<EmployeeInformationListCard />
			</TabsContent>
			<TabsContent value="Payroll">
				<EmployeePayrollCard />
			</TabsContent>
			<TabsContent value="Others">
				<EmployeeOtherCard />
			</TabsContent>
		</Tabs>
	);
}
