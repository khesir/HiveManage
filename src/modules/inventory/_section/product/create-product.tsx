import {CreateProductForm} from '../../products/form/product-form';

export default function CreateProductSection() {
	return (
		<div className="flex flex-col sm:gap-4 p-4">
			<CreateProductForm />
		</div>
	);
}
