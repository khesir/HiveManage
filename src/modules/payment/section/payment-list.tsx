import {useSearchParams} from 'react-router-dom';

export default function PaymentListSection() {
	const [searchParams] = useSearchParams();

	return <div className="flex flex-col sm:gap-4">Payment list</div>;
}
