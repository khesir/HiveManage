import {PaginationResponse, request} from '@/api/axios';
import {Button} from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {ProductSupplier} from '@/components/validation/product-supplier';
import {AxiosError} from 'axios';
import {useCallback, useEffect, useState} from 'react';
import {CreateProductSupplierForm} from '../../view/settings/_components/create-product-supplier-form';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Supplier} from '@/components/validation/supplier';
import {toast} from 'sonner';
import {createPO} from './fetch-supplier-draft-order.-dialogue';
import {useEmployeeRoleDetailsStore} from '@/modules/authentication/hooks/use-sign-in-userdata';
import {Separator} from '@/components/ui/separator';
interface Props {
	id: number;
}

const createPo = z.object({
	quantity: z.string().regex(/^\d+$/, 'Quantity must be a numeric'),
	price: z.string().regex(/^\d+$/, 'Price must be a numeric'),
});
export function CreatePODialogue({id}: Props) {
	const [formModal, setFormModal] = useState<boolean>(false);
	const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
		null,
	);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	const processSubmission = (id: Supplier) => {
		setSelectedSupplier(id);
	};
	const [productSupplier, setProductSupplier] = useState<ProductSupplier[]>([]);
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
	const {user} = useEmployeeRoleDetailsStore();
	useEffect(() => {
		try {
			setLoading(true);
			const fetchProducts = async () => {
				const response = await request<PaginationResponse<ProductSupplier>>(
					'GET',
					`/api/v1/ims/product/${id}/productSupplier?no_pagination=true`,
				);
				setProductSupplier(response.data);
			};
			fetchProducts();
		} catch (e) {
			if (e instanceof Error) {
				setRes(e.toString());
			} else if (e instanceof AxiosError) {
				setRes(e.response?.data as string);
			} else {
				setRes('An Unknown error occured');
			}
		} finally {
			setLoading(false);
		}
	}, []);
	const form = useForm<z.infer<typeof createPo>>({
		resolver: zodResolver(createPo),
		defaultValues: {quantity: '', price: ''},
		mode: 'onSubmit',
	});
	const processForm = async (poData: z.infer<typeof createPo>) => {
		if (!selectedSupplier || !selectedSupplier.supplier_id) {
			toast.error('No Selected Supplier');
			return;
		}
		if (!user || !user.employee.employee_id) {
			toast.error('Cannot process, you must properly authenticate');
			return;
		}
		await createPO(
			Number(poData.quantity),
			Number(poData.price),
			selectedSupplier.supplier_id,
			id,
			user.employee.employee_id,
		);
	};
	if (loading) {
		return <div>Fetching data</div>;
	}
	if (res) {
		return <div>{res}</div>;
	}
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="w-full">Create PO</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Create Order</DialogTitle>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(processForm)}
						className="w-full space-y-2 h-full"
					>
						<FormField
							control={form.control}
							name="quantity"
							render={({field}) => (
								<FormItem>
									<FormLabel>Quantity</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											disabled={loading}
											placeholder="10000"
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price"
							render={({field}) => (
								<FormItem>
									<FormLabel>Selling Price</FormLabel>
									<FormControl>
										<Input
											type="number"
											{...field}
											disabled={loading}
											placeholder="10000"
											value={field.value ?? ''}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Separator />
						<div className="border p-2 rounded-sm">
							{selectedSupplier ? (
								<div className="flex justify-between items-center">
									<div>
										<span className="text-gray-600">Supplier selected:</span>{' '}
										<span>{selectedSupplier.name}</span>
									</div>
									<Button onClick={() => setSelectedSupplier(null)}>
										Remove
									</Button>
								</div>
							) : (
								<div>No supplier selected</div>
							)}
						</div>
						<CreateProductSupplierForm
							callback={processSubmission}
							onSubmit={handleFormSubmit}
							productSuppliers={productSupplier}
							alternate={true}
						/>
						<Button type="submit" className="w-full">
							Submit
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
