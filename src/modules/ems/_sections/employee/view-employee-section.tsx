import {Separator} from '@/components/ui/separator';
import {ViewEmployeeDetails} from '../../employee/view/employee-view';
import {EmployeeRecentActivity} from '../../employee/view/employee-recent-activity';

export default function EmployeeViewSection() {
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<ViewEmployeeDetails />
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Employee Profile */}
					<EmployeeRecentActivity />
				</div>
			</div>
		</div>
	);
}
