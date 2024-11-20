import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee';
import {cn} from '@/lib/util/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './tooltip';

interface AvatarCirclesProps {
	className?: string;
	numPeople?: number;
	avatar: {link: string; name: string}[];
}

export const AvatarCircles = ({
	numPeople = 0,
	className,
	avatar,
}: AvatarCirclesProps) => {
	return (
		<div className={cn('z-10 flex -space-x-4 rtl:space-x-reverse', className)}>
			{avatar.map((data, index) => (
				<TooltipProvider key={index}>
					<Tooltip>
						<TooltipTrigger>
							<img
								className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
								src={
									data.link !== '#' && data.link
										? data.link
										: '/img/placeholder.jpg'
								}
								width={40}
								height={40}
								alt={`Avatar ${index + 1}`}
							/>
						</TooltipTrigger>
						<TooltipContent>{data.name}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
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

	const avatarUrls = employees.slice(0, maxVisibleAvatars).map((emp) => {
		return {
			link: emp.profile_link as unknown as string,
			name: `${emp.firstname} ${emp.middlename} ${emp.lastname}`,
		};
	});
	const totalEmployees = employees.length;
	const numPeople =
		totalEmployees > maxVisibleAvatars ? totalEmployees - maxVisibleAvatars : 0;
	return <AvatarCircles avatar={avatarUrls} numPeople={numPeople} />;
};
