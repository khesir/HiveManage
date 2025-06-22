import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import useService from '../../_components/hooks/use-service';
import {ApiRequest, request} from '@/api/axios';
import {Service} from '@/components/validation/service';
import {toast} from 'sonner';
import {ServiceTab} from '../../service/view/serviceDetails/service-tab';
import {ServiceInformation} from '../../service/view/service-details';
import useEventTrigger from '../../service/_components/use-event-hook';

export default function ViewService() {
	const {setService} = useService();
	const {service_id, joborder_id} = useParams();
	const {isTriggered} = useEventTrigger();
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await request<ApiRequest<Service>>(
					'GET',
					`/api/v1/sms/joborder/${joborder_id}/service/${service_id}`,
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
	}, [isTriggered]);
	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<ServiceTab />
				</div>
				<div className="flex flex-col gap-4">
					<ServiceInformation />
				</div>
			</div>
		</div>
	);
}
