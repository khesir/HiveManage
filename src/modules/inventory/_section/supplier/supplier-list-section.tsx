import {Separator} from '@/components/ui/separator';
import {Heading} from '@/components/ui/heading';
import {useSearchParams} from 'react-router-dom';
import SupplierList from '../../suppliers/supplier-list';
import {SupplierProfile} from '../../suppliers/supplier-profile';
import {CreateSupplierDialogForm} from '../../suppliers/form/create-supplier-form';
import {useState} from 'react';
import useSupplierStore from '../../_components/hooks/use-supplier';

export default function SupplierListView() {
	const [searchParams] = useSearchParams();
	const {data} = useSupplierStore();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="flex flex-row items-center justify-between gap-4 px-4">
				<Heading
					title={`Supplier Database`}
					description="Manange Supplier (Server side table functionalities.)"
				/>
				<div>
					<CreateSupplierDialogForm
						isModalOpen={isModalOpen}
						closeModal={handleModal}
					/>
				</div>
			</div>
			<Separator />
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				{/* Employee List */}
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					<SupplierList
						searchParams={searchParams}
						modalRefreshTrigger={isModalOpen}
					/>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex lg:hidden">
						<Separator />
					</div>
					<SupplierProfile data={data ?? undefined} />
				</div>
			</div>
		</div>
	);
}
