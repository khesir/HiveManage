import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee-zod-schema';
import {cn} from '@/lib/util/utils';

interface AvatarCirclesProps {
	className?: string;
	numPeople?: number;
	avatarUrls: string[];
}

export const AvatarCircles = ({
	numPeople = 0,
	className,
	avatarUrls,
}: AvatarCirclesProps) => {
	return (
		<div className={cn('z-10 flex -space-x-4 rtl:space-x-reverse', className)}>
			{avatarUrls.map((url, index) => (
				<img
					key={index}
					className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
					src={url !== '#' ? url : '/img/placeholder.jpg'}
					width={40}
					height={40}
					alt={`Avatar ${index + 1}`}
				/>
			))}
			{numPeople > 0 && (
				<a
					className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
					href="#"
				>
					+{numPeople}
				</a>
			)}
		</div>
	);
};

interface EmployeeAvatarCirclesProps {
	employees: EmployeeBasicInformation[];
	isTable?: boolean;
}

export const EmployeeAvatarCircles = ({
	employees,
	isTable = false,
}: EmployeeAvatarCirclesProps) => {
	// TODO: Replace # to img_url of employee
	const maxVisibleAvatars = isTable ? 3 : 5;

	const avatarUrls = employees.slice(0, maxVisibleAvatars).map((emp) => '#');
	const totalEmployees = employees.length;
	const numPeople =
		totalEmployees > maxVisibleAvatars ? totalEmployees - maxVisibleAvatars : 0;
	return <AvatarCircles avatarUrls={avatarUrls} numPeople={numPeople} />;
};
