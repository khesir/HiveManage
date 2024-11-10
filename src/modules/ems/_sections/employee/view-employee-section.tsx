import {ViewEmployeeDetails} from '../../employee/view/employee-view';

export default function EmployeeViewSection() {
	return (
		<div className="flex flex-col sm:gap-4">
			<ViewEmployeeDetails />
		</div>
	);
}
