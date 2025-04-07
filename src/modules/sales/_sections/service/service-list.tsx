import {useSearchParams} from 'react-router-dom';

export default function ServiceListSection() {
	const [searchParams] = useSearchParams();

	return (
		<div className="flex flex-col sm:gap-4">
			<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
				<div className="grid items-start auto-rows-max gap-4 gap md:gap-6 lg:col-span-2">
					Service List
				</div>
				<div className="flex flex-col gap-4">Service Profile</div>
			</div>
		</div>
	);
}
