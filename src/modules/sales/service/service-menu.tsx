import {ApiRequest, request} from '@/api/axios';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Heading} from '@/components/ui/heading';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Separator} from '@/components/ui/separator';
import {ServiceType} from '@/components/validation/service-type';
import clsx from 'clsx';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useServiceTypeStore from './_components/use-serviceType-hook';

export function ServiceMenu() {
	const [serviceMenu, setServiceMenu] = useState<ServiceType[]>();
	const navigate = useNavigate();
	const {setServiceType} = useServiceTypeStore();
	useEffect(() => {
		const fetchData = async () => {
			const res = await request<ApiRequest<ServiceType[]>>(
				'GET',
				'/api/v1/sms/service-type',
			);
			setServiceMenu(
				Array.isArray(res.data) && Array.isArray(res.data[0])
					? (res.data as ServiceType[][]).flat()
					: (res.data as ServiceType[]),
			);
		};
		fetchData();
		if (serviceMenu && serviceMenu.length > 0) {
			setServiceType(serviceMenu[0]);
		}
	}, []);
	const handleProfile = (data: ServiceType) => {
		setServiceType(data);
	};
	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between">
				<Heading title={'Servie Menu'} description="" />
				<div className="flex gap-3">
					<Button onClick={() => navigate('transactions')}>Transaction</Button>
					<Button onClick={() => navigate('create')}>
						Create New Service Type
					</Button>
				</div>
			</div>
			<Separator />
			<ScrollArea>
				<div className="grid grid-cols-3 gap-2">
					{serviceMenu?.map((service, index) => (
						<ServiceCard
							key={index}
							service={service}
							handleService={handleProfile}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}

function ServiceCard({
	service,
	handleService,
}: {
	service: ServiceType;
	handleService: (data: ServiceType) => void;
}) {
	return (
		<Card
			className="p-5 h-[250px] flex flex-col justify-between"
			onClick={() => handleService(service)}
		>
			<div className="flex flex-col gap-1">
				<h1 className="text-xl font-semibold">
					{service.name}{' '}
					<Badge
						className={clsx(
							'text-white hover:none, text-xs',
							service.is_active ? 'bg-green-500' : 'bg-red-500',
						)}
					>
						{service.is_active ? 'Active' : 'Inactive'}
					</Badge>
				</h1>
				<p>{`Fee: ${service.customizable_fee}`}</p>
				<p>{service.description}</p>
			</div>
			<div className="space-y-2">
				<Separator />
				<p>{service.duration}</p>
			</div>
		</Card>
	);
}
