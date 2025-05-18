import {useEffect} from 'react';
import useJoborderStore from '../../service/_components/use-joborder-hook';
import ServiceList from '../../service/view/service-list';
import {JoborderProfile} from '../../service/view/joborder-profile';
import {ApiRequest, request} from '@/api/axios';
import {useParams} from 'react-router-dom';
import {Joborder} from '@/components/validation/joborder';

export default function ServiceListSection() {
	const {joborder_id} = useParams();
	const {setJoborder} = useJoborderStore();
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<Joborder>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}`,
			);
			setJoborder(Array.isArray(res.data) ? res.data[0] : res.data);
		};
		fetchData();
	}, []);

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<ServiceList />
				</div>
				<div className="flex flex-col gap-4">
					<JoborderProfile />
				</div>
			</div>
		</div>
	);
}
