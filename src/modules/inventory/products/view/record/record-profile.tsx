import {BatchRecords} from './batch-records';
import useItemStore from './hook/use-item';
import {SerializeRecord} from './serialize-record';

export function ItemProfile() {
	const {data} = useItemStore();

	return (
		<>
			{data ? (
				<div className="flex flex-col gap-5">
					<BatchRecords data={data} />
					<SerializeRecord data={data} />
				</div>
			) : (
				<div className="flex w-full h-[85vh] justify-center items-center border">
					{' '}
					<p className="w-[400px] h-[200px] flex justify-center text-lg font-semibold">
						Select an Item
					</p>
				</div>
			)}
		</>
	);
}
