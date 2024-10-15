import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {BenefitsInformationCard} from './payroll-card/benefits-info-card';
import {DeductionInformationCard} from './payroll-card/deduction-info-card';

export function EmployeePayrollCard() {
	return (
		<div className="space-y-3">
			<Card x-chunk="dashboard-05-chunk-3">
				<CardHeader className="px-7">
					<CardTitle>Payroll</CardTitle>
					<CardDescription>
						Overall collective employee information
					</CardDescription>
				</CardHeader>
			</Card>
			<BenefitsInformationCard />
			<DeductionInformationCard />
		</div>
	);
}
