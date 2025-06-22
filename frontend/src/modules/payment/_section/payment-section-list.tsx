import {Separator} from '@/components/ui/separator';
import {Heading} from '@/components/ui/heading';
import {useSearchParams} from 'react-router-dom';
import PaymentList from '../payment/payment-list';
import {PaymentProfile} from '../payment/payment-profile';

export default function PaymentListSection() {
	const [searchParams] = useSearchParams();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Payment List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<div className="flex flex-col gap-4">
						<Heading
							title={`Payment Records`}
							description="List of all payments histories and records"
						/>
						<Separator />
					</div>
					<PaymentList searchParams={searchParams} />
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					{/* Payment Profile */}
					<PaymentProfile />
				</div>
			</div>
		</div>
	);
}
