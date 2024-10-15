import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {EmployeeInformationCard} from './info-card/employee-information-card';
import {EmployeePersonalInformationCard} from './info-card/employee-personal-information-card';
import {EmployeeEmploymentInformationCard} from './info-card/employee-employment-information-card';
import {EmployeeFinancialInformationCard} from './info-card/employee-financial-information-card';
import {EmployeeSalaryInformationCard} from './info-card/employee-salary-information-card';

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
