import JoborderList from '../../service/joborder-list';

export default function JoborderListSection() {
	return (
		<div className="flex flex-col sm:gap-4">
			<JoborderList />
		</div>
	);
}
