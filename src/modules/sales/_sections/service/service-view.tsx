import {useEffect} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';
import useService from '../../_components/hooks/use-service';
import {ApiRequest, request} from '@/api/axios';
import {Service} from '@/components/validation/service';
import {toast} from 'sonner';
import {ServiceDetails} from '../../service/view/service-details';
import TransactionServiceItemList from '../../service/view/transaction-service-item-list';

export default function ViewService() {
	const [searchParams] = useSearchParams();
	const {setService} = useService();
	const {id} = useParams();
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await request<ApiRequest<Service>>(
					'GET',
					`/api/v1/sms/service/${id}`,
				);
				if (!Array.isArray(response.data)) {
					setService(response.data);
				} else {
					setService(response.data[0]);
				}
			} catch (error) {
				toast.error(
					`Error fetching Service data: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		};
		fetchProducts();
	}, [id]);
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<TransactionServiceItemList searchParams={searchParams} />
				</div>
				<div className="flex flex-col gap-4">
					<ServiceDetails />
				</div>
			</div>
		</div>
	);
}
