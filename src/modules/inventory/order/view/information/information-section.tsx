import {OrderProducts} from './information-products';
import OrderInformationDetails from './information-profile';
export function InformationSection() {
	return (
		<div className="flex gap-5 w-full">
			<div className="flex-[3]">
				<OrderInformationDetails />
			</div>
			<div className="flex-[7]">
				<OrderProducts />
			</div>
		</div>
	);
}
