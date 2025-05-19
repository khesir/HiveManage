import {ApiRequest, request} from '@/api/axios';
import {CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {useEffect, useState} from 'react';
import {BuildDetails} from '@/components/validation/service-details';
import {useParams} from 'react-router-dom';
import {BuildDialog} from './buildDialog';
import {useServiceDetails} from '../../../_components/use-service-details-hook';

export function BuildDetailsCard() {
	const {serviceDetails, setServiceDetails} = useServiceDetails();
	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const res = await request<ApiRequest<BuildDetails>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/build-details`,
			);
			setServiceDetails(
				Array.isArray(res.data) ? (res.data[0] ?? null) : res.data,
			);
		};
		fetchData();
		setLoading(false);
	}, []);

	if (loading) {
		return <Skeleton className="w-[200px]"></Skeleton>;
	}

	if (serviceDetails === null) {
		return (
			<CardContent className="flex flex-col justify-center items-center font-semibold gap-3 p-3">
				No Existing Build Details
				<BuildDialog />
			</CardContent>
		);
	}
	return (
		<div className="grid gap-3">
			<div className="font-semibold flex justify-between">
				<span>Build Details</span>
				<BuildDialog />
			</div>
			<ul className="grid gap-3">
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">
						Owned Items (Customer Items)
					</span>
					<span>
						{(serviceDetails as BuildDetails).ownedItems?.length ?? 0}
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">
						Parts Used (Service Items)
					</span>
					<span>
						{(serviceDetails as BuildDetails).serviceItems?.length ?? 0}
					</span>
				</li>

				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Build Specs</span>
					<span>{(serviceDetails as BuildDetails).build_specs}</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Checklist</span>
					<span>{(serviceDetails as BuildDetails).checklist}</span>
				</li>
			</ul>
		</div>
	);
}
