import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {useState, useCallback, useEffect} from 'react';
import {Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {CreateProductSupplierForm} from './create-product-supplier-form';
import {ProductSupplier} from '@/components/validation/product-supplier';
import {PaginationResponse, request} from '@/api/axios';
import {useParams} from 'react-router-dom';
import {AxiosError} from 'axios';

export function CreateProductSupplierDialogue() {
	const [formModal, setFormModal] = useState<boolean>(false);
	const handleFormSubmit = useCallback(() => {
		setFormModal(false);
	}, []);
	const {id} = useParams();
	const [productSupplier, setProductSupplier] = useState<ProductSupplier[]>([]);
	const [loading, setLoading] = useState(false);
	const [res, setRes] = useState<string | null>(null);
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
	if (loading) {
		return <div>Fetching data</div>;
	}
	if (res) {
		return <div>{res}</div>;
	}
	return (
		<Dialog open={formModal} onOpenChange={setFormModal}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-1">
					<Plus className="w-4 h-4" /> Add Supplier
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[2000px]">
				<DialogTitle>Add Product Supplier</DialogTitle>
				<DialogDescription></DialogDescription>
				<CreateProductSupplierForm
					onSubmit={handleFormSubmit}
					productSuppliers={productSupplier}
				/>
			</DialogContent>
		</Dialog>
	);
}
