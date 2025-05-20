import {Heading} from '@/components/ui/heading';
import {useSearchParams} from 'react-router-dom';
import ServiceList from '../../sales/sales-list';
import {Separator} from '@/components/ui/separator';
import {SalesReportDialog} from '../../_components/reports/sales-report-dialog';

export default function SalesListSection() {
	const [searchParams] = useSearchParams();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="flex flex-col gap-4">
				<div className="flex justify-between">
					<Heading
						title={`Sales Records`}
						description="Overall Transaction Sale Records"
					/>
					<SalesReportDialog />
				</div>
				<Separator />
			</div>
			<ServiceList searchParams={searchParams} />
		</div>
	);
}
