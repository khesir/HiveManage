import {ApiRequest, request} from '@/api/axios';
import {CardContent} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {UpgradeDetails} from '@/components/validation/service-details';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {UpgradeDialog} from './upgradeDialog';
import {useServiceDetails} from '../../../_components/use-service-details-hook';

export function UpgradeDetailsCard() {
	const {serviceDetails, setServiceDetails} = useServiceDetails();

	const [loading, setLoading] = useState(false);
	const {joborder_id, service_id} = useParams();
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const res = await request<ApiRequest<UpgradeDetails>>(
				'GET',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/upgrade-details`,
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
				No Existing upgrade Details
				<UpgradeDialog />
			</CardContent>
		);
	}
	return (
		<div className="grid gap-3">
			<div className="font-semibold flex justify-between">
				<span>Upgrade Details</span>
				<UpgradeDialog />
			</div>
			<ul className="grid gap-3">
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">
						Before Specs (Customer Items)
					</span>
					<span>
						{(serviceDetails as UpgradeDetails).ownedItems?.length ?? 0}
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">
						Upgraded Components (Service Items)
					</span>
					<span>
						{(serviceDetails as UpgradeDetails).serviceItems?.length ?? 0}
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span className="text-muted-foreground">Notes</span>
					<span>{(serviceDetails as UpgradeDetails).notes ?? ''}</span>
				</li>
			</ul>
		</div>
	);
}
