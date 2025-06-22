import {CreateProductForm} from '../../products/_components/form/product-form';

export default function CreateProductSection() {
	return (
		<div className="h-full max-h-[100vh] flex flex-col sm:gap-4 p-4">
			<CreateProductForm />
		</div>
	);
}
