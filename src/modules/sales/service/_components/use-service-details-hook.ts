import {
	BuildDetails,
	CleaningDetails,
	RentDetails,
	RepairDetails,
	ReplacementDetails,
	UpgradeDetails,
} from '@/components/validation/service-details';
import {create} from 'zustand';

type ServiceDetails =
	| ReplacementDetails
	| BuildDetails
	| CleaningDetails
	| RentDetails
	| RepairDetails
	| UpgradeDetails;
type ServiceDetailsProps = {
	serviceDetails: ServiceDetails | null;
	setServiceDetails: (newServiceDetails: ServiceDetails) => void;
	resetServiceDetails: () => void;
};

export const useServiceDetails = create<ServiceDetailsProps>((set) => ({
	serviceDetails: null,
	setServiceDetails: (newServiceDetails) =>
		set(() => ({
			serviceDetails: newServiceDetails,
		})),
	resetServiceDetails: () => set({serviceDetails: null}),
}));
