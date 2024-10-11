import {Separator} from '@/components/ui/separator';
import {Heading} from '@/components/ui/heading';
import PayrollList from './payroll-list';
import {PayrollProfile} from './payroll-profile';
import {PayrollEmployeeList} from './payroll-employee-list';

export type paramsProps = {
	searchParams: URLSearchParams;
};

export default function PayrollSection(data: paramsProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					{/* Payroll Records */}
					<div className="flex flex-col gap-4">
						<Heading title={`Payroll`} description="Manage payroll" />
						<Separator />
					</div>
					<PayrollList searchParams={data.searchParams} />
				</div>
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					{/* Payroll details */}
					<PayrollProfile />
					{/* Employee Table  */}
					<PayrollEmployeeList />
				</div>
			</div>
		</div>
	);
}
