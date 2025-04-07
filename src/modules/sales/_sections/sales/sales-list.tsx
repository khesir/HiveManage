import {Heading} from '@/components/ui/heading';
import {useSearchParams} from 'react-router-dom';
import ServiceList from '../../sales/sales-list';
import {Separator} from '@/components/ui/separator';

export default function SalesListSection() {
	const [searchParams] = useSearchParams();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="flex flex-col gap-4">
				<Heading
					title={`Sales Records`}
					description="Overall Transaction Sale Records"
				/>
				<Separator />
			</div>
			<ServiceList searchParams={searchParams} />
		</div>
	);
}
