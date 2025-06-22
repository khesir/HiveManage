import {Heading} from '@/components/ui/heading';
import {CreateJoborderForm} from '../../service/create/create-joborder-form';

export function CreateJoborderSection() {
	return (
		<div className="flex flex-col gap-4">
			<div className="p-4 sm:px-6 space-y-5">
				<Heading title={`Create Joborder`} description="" />
				<CreateJoborderForm />
			</div>
		</div>
	);
}
