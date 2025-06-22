import {ApiRequest, request} from '@/api/axios';
import {Skeleton} from '@/components/ui/skeleton';
import {useEffect, useState} from 'react';
import {ReplacementDialog} from './replacementDialog';
import {ReplacementDetails} from '@/components/validation/service-details';
import {useParams} from 'react-router-dom';
import {useServiceDetails} from '../../../_components/use-service-details-hook';

export function ReplacementDetailsCard() {
	const {serviceDetails, setServiceDetails} = useServiceDetails();
	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const res = await request<ApiRequest<ReplacementDetails>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/replacement-details`,
			);
			setServiceDetails(
				Array.isArray(res.data) ? (res.data[0] ?? null) : res.data,
			);
		};
		fetchData();
		setLoading(false);
	}, [serviceDetails]);

	if (loading) {
		return <Skeleton className="w-[200px]"></Skeleton>;
	}

	if (serviceDetails === null) {
		return (
			<div className="flex flex-col justify-center items-center font-semibold gap-3 p-3">
				No Existing Replacement Details
				<ReplacementDialog />
			</div>
		);
	}
	return (
		<div className="grid gap-3">
			<div className="font-semibold flex justify-between">
				<span>Replacement Details</span>
				<ReplacementDialog />
			</div>
			<ul className="grid gap-3">
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Reason</span>
					<span>{(serviceDetails as ReplacementDetails).reason}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Owned Items</span>
					<span>
						{(serviceDetails as ReplacementDetails).ownedItems?.length ?? 0}
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">New Products</span>
					<span>
						{(serviceDetails as ReplacementDetails).serviceItems?.length ?? 0}
					</span>
				</li>
			</ul>
		</div>
	);
}
