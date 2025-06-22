import {Heading} from '@/components/ui/heading';
import {ServiceForm} from '../../service/create/create-service-form';

export function CreateServiceSection() {
	return (
		<div className="flex flex-col gap-4">
			<div className="p-4 sm:px-6 space-y-5">
				<Heading title={`Create Service`} description="" />
				<ServiceForm />
			</div>
		</div>
	);
}
