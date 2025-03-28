import {BatchItem} from '@/components/validation/inventory/batch-items';
import useItemStore from '../_components/hooks/use-custom-item';
import {BatchRecords} from './batch-records';
import {SerializeRecord} from './serialize-records';
import {SerializeItem} from '@/components/validation/inventory/serialize-items';

export function CombinedRecord() {
	const {selectedItem} = useItemStore();
	return (
		<>
			{selectedItem?.item_type === 'Batch' ? (
				<BatchRecords
					data={
						Array.isArray(selectedItem.batch)
							? (selectedItem.batch as BatchItem[])
							: []
					}
				/>
			) : selectedItem?.item_type === 'Serialized' ? (
				<SerializeRecord
					data={
						Array.isArray(selectedItem.serial)
							? (selectedItem.serial as SerializeItem[])
							: []
					}
				/>
			) : selectedItem?.item_type === 'Both' ? (
				<div>
					<BatchRecords
						data={
							Array.isArray(selectedItem.batch)
								? (selectedItem.batch as BatchItem[])
								: []
						}
					/>
					<SerializeRecord
						data={
							Array.isArray(selectedItem.serial)
								? (selectedItem.serial as SerializeItem[])
								: []
						}
					/>
				</div>
			) : (
				<div>Select a Variant</div>
			)}
		</>
	);
}
