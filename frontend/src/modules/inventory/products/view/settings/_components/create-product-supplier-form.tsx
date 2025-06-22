import {PaginationResponse, request} from '@/api/axios';
import {AvatarCircles} from '@/components/ui/avatarcircles';
import {Button} from '@/components/ui/button';
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {ProductSupplier} from '@/components/validation/product-supplier';
import {Supplier} from '@/components/validation/supplier';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'sonner';
import useEventTrigger from '../../../../_components/hooks/use-event-trigger';

interface Props {
	onSubmit?: () => void;
	callback?: (val: Supplier) => void;
	productSuppliers: ProductSupplier[];
	alternate?: boolean;
}

export function CreateProductSupplierForm({
	onSubmit,
	callback,
	productSuppliers,
	alternate = false,
}: Props) {
	const [suppliers, setSupplier] = useState<Supplier[]>([]);
	const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const {id} = useParams();
	const {user} = useEmployeeRoleDetailsStore();
	const {toggleTrigger} = useEventTrigger();
	const fetchData = async () => {
		try {
			// Fetch all customers from the backend
			const response = await request<PaginationResponse<Supplier>>(
				'GET',
				`/api/v1/ims/supplier?no_pagination=true`,
			);
			const filteredSuppliers = response.data.filter(
				(supplier) =>
					!productSuppliers.some(
						(ps) => ps.supplier_id === supplier.supplier_id,
					),
			);

			setSupplier(filteredSuppliers);
		} catch (error) {
			console.error('Error fetching customer:', error);
			setSupplier([]);
		}
	};
	// Function to handle customer search
	useEffect(() => {
		if (!alternate) {
			fetchData();
		} else {
			const suppliersOnly = productSuppliers
				.map((productSupplier) => productSupplier.supplier)
				.filter((supplier): supplier is Supplier => supplier !== undefined);

			setSupplier(suppliersOnly);
		}
	}, []);

	const processRequest = async (supplier: Supplier) => {
		try {
			if (!user?.employee.employee_id) {
				toast.error('You need to be logged in to do this.');
				return;
			}
			// ain't sure if this will tightly coupled some functionality
			if (callback) {
				if (supplier.supplier_id !== undefined) {
					callback(supplier);
				} else {
					console.error('Supplier ID is undefined');
				}
				return;
			}
			const data = {
				supplier_id: supplier.supplier_id!,
				product_id: parseInt(id!),
				user: user?.employee.employee_id,
			};
			await request('POST', `/api/v1/ims/product/${id}/productSupplier`, data);
			toast.success('Supplier Added');
			toggleTrigger();
			if (onSubmit) {
				setIsModalOpen(false);
				onSubmit();
			}
		} catch (error) {
			console.log(error);
			let errorMessage = 'An unexpected error occurred';
			if (axios.isAxiosError(error)) {
				errorMessage =
					error.response?.data?.message || // Use the `message` field if available
					error.response?.data?.errors?.[0]?.message || // If `errors` array exists, use the first error's message
					'Failed to process request';
			}

			toast.error(errorMessage);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<h1 className="font-semibold">Search Suppliers</h1>
			{/* ShadCN Command Component for displaying search results */}
			<Command>
				<CommandInput placeholder="Search for a suppliers..." />
				<CommandList className="max-h-[350px]">
					{suppliers.length > 0 ? (
						<CommandGroup heading="Suppliers">
							{suppliers.map((supplier) => (
								<CommandItem
									key={supplier.supplier_id}
									onSelect={() => {
										setSelectedSupplier(supplier);
										setIsModalOpen(true);
									}}
								>
									<div className="flex items-center gap-3">
										<AvatarCircles
											avatar={[
												{
													link:
														typeof supplier.profile_link === 'string'
															? supplier.profile_link
															: '',
													name: supplier.name ?? '',
												},
											]}
										/>
										<div className="flex-1">
											<p className="font-semibold">{supplier.name}</p>
											<p className="text-sm text-gray-500">
												{supplier.relationship}
											</p>
										</div>
									</div>
								</CommandItem>
							))}
						</CommandGroup>
					) : (
						<p className="p-3 text-sm text-gray-500">No Suppliers found.</p>
					)}
				</CommandList>
			</Command>
			{isModalOpen && (
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle> Selected Supplier</DialogTitle>
							<DialogDescription>
								<div className="p-4 flex gap-5">
									<AvatarCircles
										avatar={[
											{
												link:
													typeof selectedSupplier?.profile_link === 'string'
														? selectedSupplier?.profile_link
														: '',
												name: selectedSupplier?.name ?? '',
											},
										]}
									/>
									<div className="flex-1">
										<p className="font-semibold">{selectedSupplier?.name}</p>
										<p className="text-sm text-gray-500">
											{selectedSupplier?.relationship}
										</p>
									</div>
								</div>
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
							<Button
								onClick={() => {
									setIsModalOpen(false);
									processRequest(selectedSupplier!);
								}}
							>
								Confirm
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
