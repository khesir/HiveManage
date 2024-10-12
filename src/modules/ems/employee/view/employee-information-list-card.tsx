import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {EmployeeInformationCard} from './cards/employee-information-card';
import {EmployeePersonalInformationCard} from './cards/employee-personal-information-card';
import {EmployeeEmploymentInformationCard} from './cards/employee-employment-information-card';
import {EmployeeFinancialInformationCard} from './cards/employee-financial-information-card';
import {EmployeeSalaryInformationCard} from './cards/employee-salary-information-card';

export function EmployeeInformationListCard() {
	// Implement a fetching for employee information
	return (
		<div className="space-y-3">
			<Card x-chunk="dashboard-05-chunk-3">
				<CardHeader className="px-7">
					<CardTitle>Information</CardTitle>
					<CardDescription>
						Overall collective employee information
					</CardDescription>
				</CardHeader>
			</Card>
			<EmployeeInformationCard />
			<EmployeePersonalInformationCard />
			<EmployeeEmploymentInformationCard />
			<EmployeeFinancialInformationCard />
			<EmployeeSalaryInformationCard />
		</div>
	);
}
