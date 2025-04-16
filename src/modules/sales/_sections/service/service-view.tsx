import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import useService from '../../_components/hooks/use-service';
import {ApiRequest, request} from '@/api/axios';
import {Service} from '@/components/validation/service';
import {toast} from 'sonner';
import {ServiceTab} from '../../service/view/service-tab';

export default function ViewService() {
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
			<ServiceTab />
		</div>
	);
}
