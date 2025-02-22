'use client';

import {LayoutGrid, LogOut, User} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from '@/components/ui/tooltip';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {PaginationResponse, request} from '@/api/axios';
import {useEmployeeRoleDetailsStore} from '../../../modules/authentication/hooks/use-sign-in-userdata';
import {useEffect} from 'react';
import {EmployeeRolesWithDetails} from '@/modules/ems/_components/validation/employeeRoles';

export function UserNav() {
	const navigate = useNavigate();
	const location = useLocation();
	const firstSegment = location.pathname.split('/')[1]; // 'sales'
	const {user, setUser, clearUser} = useEmployeeRoleDetailsStore();

	const handleClick = async () => {
		try {
			await request('GET', '/auth/sign-out');
			console.log(
				`/api/v1/ems/employeeRoles/${user?.employee_roles_id}/status`,
			);
			await request(
				'PATCH',
				`/api/v1/ems/employeeRoles/${user?.employee_roles_id}/status`,
				{status: 'Offline'},
			);
			clearUser();
			navigate('/');
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!user) {
			const fetchData = async () => {
				const result = (await request('GET', '/auth/user')) as {
					data: {id: string};
				};
				const empRoleData = await request<
					PaginationResponse<EmployeeRolesWithDetails>
				>('GET', `/api/v1/ems/employeeRoles?user_id=${result.data.id}`);
				setUser(empRoleData.data[0]);
			};
			fetchData();
		}
	}, [user, setUser]);

	return (
		<DropdownMenu>
			<TooltipProvider disableHoverableContent>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="relative h-8 w-8 rounded-full"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage src="#" alt="Avatar" />
									<AvatarFallback className="bg-transparent">
										<img
											src={
												user?.employee.profile_link
													? user.employee.profile_link
													: `https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.employee.firstname}${user?.employee.lastname}`
											}
										/>
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">Profile</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{`${user?.employee.lastname}, ${user?.employee.firstname} ${user?.employee.middlename}`}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user?.employee.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem className="hover:cursor-pointer" asChild>
						<Link
							to={`/${firstSegment}/dashboard`}
							className="flex items-center"
						>
							<LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
							Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="hover:cursor-pointer" asChild>
						<Link to={`/${firstSegment}/profile`} className="flex items-center">
							<User className="w-4 h-4 mr-3 text-muted-foreground" />
							Profile
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="hover:cursor-pointer"
					onClick={() => handleClick()}
				>
					<LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
