import {Separator} from '@/components/ui/separator';
import {Heading} from '@/components/ui/heading';
import {CreateEmployeeForm} from '../../employee/create/create-employee-form';

export default function CreateEmployeSection() {
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="flex flex-col gap-4">
				<Heading
					title={`Create Employee`}
					description="Fill up the form and complete all the steps"
				/>
				<Separator />
			</div>
			<CreateEmployeeForm />
		</div>
	);
}
