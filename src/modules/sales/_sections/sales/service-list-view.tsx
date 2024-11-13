import {Heading} from '@/components/ui/heading';
import {Link, useSearchParams} from 'react-router-dom';
import ServiceList from '../../sales/service_list';
import {Button} from '@/components/ui/button';

export default function ServiceListSection() {
	const [searchParams] = useSearchParams();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="flex justify-between gap-4 p-4">
				<Heading
					title={`Services`}
					description="Manange Service (Server side table functionalities.)"
				/>
				<div className="flex items-center gap-2">
					<Link to="">
						<Button variant={'outline'}>View Sales</Button>
					</Link>
					<Link to="">
						<Button variant={'outline'}>View Joborder</Button>
					</Link>
					<Link to="">
						<Button variant={'outline'}>View Borrow</Button>
					</Link>
					<Link to="">
						<Button variant={'outline'}>View Reservation</Button>
					</Link>
				</div>
			</div>
			<ServiceList searchParams={searchParams} />
		</div>
	);
}
