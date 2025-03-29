import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {useState} from 'react';
import {ReservationForm} from '../service/serviceForm/reservation-form';
import {JoborderForm} from '../service/serviceForm/joborder-form';
import {BorrowForm} from '../service/serviceForm/borrow-form';

export const Services = [
	// {
	// 	name: 'Borrow',
	// 	description: 'Borrow 1 Take 2',
	// 	fee: 100,
	// 	status: 'Active',
	// },
	// {
	// 	name: 'Reserve',
	// 	description: 'Reserve Item and get notified later',
	// 	fee: 0,
	// 	status: 'Active',
	// },
	{
		name: 'Joborder',
		description: 'All tasks related to repairs, cleaning and moree',
		fee: 100,
		status: 'Active',
	},
];

export function ServiceList() {
	const [isEditing, setIsEditing] = useState<{
		name: string;
		fee: number | undefined;
	}>({name: '', fee: undefined});
	const handleIsEditing = (value: string, fee: number | undefined) => {
		setIsEditing({name: value, fee: fee});
	};

	return (
		<>
			{/* Render your items */}
			{isEditing['name'] === 'Reserve' ? (
				<ReservationForm handleIsEditing={handleIsEditing} />
			) : isEditing['name'] === 'Borrow' ? (
				<BorrowForm
					handleIsEditing={handleIsEditing}
					fee={isEditing['fee'] ?? 0}
				/>
			) : isEditing['name'] === 'Joborder' ? (
				<JoborderForm
					handleIsEditing={handleIsEditing}
					fee={isEditing['fee'] ?? 0}
				/>
			) : (
				<div className="grid grid-cols-3 gap-3">
					{Services.map((service, index) => (
						<Card
							className="relative w-full h-[170px] overflow-hidden"
							key={index}
						>
							<div className="flex justify-start">
								<CardHeader className="flex flex-col justify-start">
									<CardTitle className="font-semibold text-sm  hover:underline">
										{service.name}
									</CardTitle>
									<CardDescription className="space-y-2">
										<div className="space-x-1">
											<Badge>{service.status}</Badge>
										</div>
										<div>{service.description}</div>
									</CardDescription>
								</CardHeader>
							</div>
							<div className="absolute bottom-1 right-3 gap-2 flex items-center justify-end">
								<Button variant={'ghost'}>View Details</Button>
								<Button
									className="bg-green-400 hover:bg-green-200"
									onClick={() => handleIsEditing(service.name, service.fee)}
								>
									Setup
								</Button>
							</div>
						</Card>
					))}
				</div>
			)}
		</>
	);
}
