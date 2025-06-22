import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import useServiceItem from '@/modules/sales/service/_components/hooks/use-serviceItem-hook';
import {ShoppingBagIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {AddSerializeSelection} from '../dialogue/sales-serialize-selection';
import {useSelectedItemsStore} from '@/modules/sales/dashboard/_components/hooks/use-serialize-selection';
import {request} from '@/api/axios';
import {useParams} from 'react-router-dom';
import {AxiosError} from 'axios';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import useEventTrigger from '@/modules/sales/service/_components/use-event-hook';
type Props = {
	onSubmit: () => void;
	isRent: boolean;
};
export function SelectedServiceItems({onSubmit, isRent = false}: Props) {
	const {data} = useServiceItem();
	const [loading, setLoading] = useState<boolean>(false);
	const {joborder_id, service_id} = useParams();
	const [quantity, setQuantity] = useState<number>(0);
	const {selectedItems, clearSelectedItems} = useSelectedItemsStore();
	const {user} = useEmployeeRoleDetailsStore();
	const {toggleTrigger} = useEventTrigger();
	useEffect(() => {
		clearSelectedItems();
	}, []);
	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		if (!data) return;

		const maxQuantity = data.service_quantity ?? 0;

		if (isNaN(value) || value < 0) {
			setQuantity(value);
			return;
		}

		if (value > maxQuantity) {
			setQuantity(maxQuantity);
			return;
		}

		setQuantity(value);
	};
	const handleSubmit = async () => {
		setLoading(true);
		if (!data) {
			toast.error('Please select a product');
			setLoading(false);
			return;
		}
		if (quantity <= 0) {
			toast.error('0 Quantity is invalid');
			return;
		}
		if (data.is_serialize && selectedItems.length !== quantity) {
			toast.error('Select the required quantity for serialize items');
			return;
		}
		try {
			await request(
				'POST',
				`/api/v1/sms/joborder/${joborder_id}/service/${service_id}/service-items`,
				{
					product_id: data.product_id,
					service_id: Number(service_id),
					serialize_items: selectedItems,
					quantity: quantity,
					sold_price: isRent ? 0 : Number(data.selling_price),
					status: 'Pending',
					user_id: user?.employee.employee_id,
				},
			);
			if (onSubmit) {
				onSubmit();
			}
			toggleTrigger();
			toast.success('Added to service items');
		} catch (e) {
			if (e instanceof Error) {
				toast.error(e.toString());
			} else if (e instanceof AxiosError) {
				toast.error(e.response?.data as string);
			} else {
				toast.error('An unknown error occured');
			}
			console.log(e);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant={'outline'} className="p-5 flex gap-5">
					<span>{data?.name ? data?.name : 'Not set'}</span>
					<ShoppingBagIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				side="right"
				align="start"
				sideOffset={8}
				className="w-[30vh]"
			>
				<p className="mb-3">Quantity</p>
				<Input
					type="number"
					value={quantity}
					disabled={loading}
					onChange={handleQuantityChange}
					placeholder="Enter quantity"
				/>
				<Button className="w-full mt-5" onClick={handleSubmit}>
					Submit
				</Button>
				{data?.is_serialize && (
					<div className="flex flex-col gap-2">
						<div className="px-3">
							<div className="p-3 border">
								<Popover>
									<PopoverTrigger asChild>
										<span className="text-xs">
											{selectedItems.length === 0
												? 'No items selected.'
												: `${selectedItems.length} selected`}
										</span>
									</PopoverTrigger>
									<PopoverContent>
										{selectedItems.map((data, index) => (
											<div key={index}>{data.product?.name}</div>
										))}
									</PopoverContent>
								</Popover>
							</div>
						</div>
						<AddSerializeSelection
							product_id={data.product_id!}
							limit={quantity}
						/>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
