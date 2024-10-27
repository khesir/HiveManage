import {Separator} from '@/components/ui/separator';
import {Heading} from '@/components/ui/heading';
import {useSearchParams} from 'react-router-dom';
import ServiceList from '../../sales/service_list';

export default function ServiceListSection() {
	const [searchParams] = useSearchParams();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="flex flex-col gap-4">
				<Heading
					title={`Services`}
					description="Manange Service (Server side table functionalities.)"
				/>
				<Separator />
			</div>
			<ServiceList searchParams={searchParams} />
		</div>
	);
}
