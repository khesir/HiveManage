import {useLocation, Outlet, Navigate} from 'react-router-dom';
import {useEmployeeRoleDetailsStore} from './hooks/use-sign-in-userdata';

interface RequireAuthProps {
	allowedRoles: Array<'Administrator' | 'Manager' | 'Staff'>;
}

export default function RequireAuth({allowedRoles}: RequireAuthProps) {
	const {user} = useEmployeeRoleDetailsStore();
	const location = useLocation();

	const userRoleName = user?.role?.name;

	if (!user) {
		return <Navigate to="/" state={{from: location}} replace />;
	} else if (
		userRoleName &&
		!allowedRoles.includes(
			userRoleName as 'Administrator' | 'Manager' | 'Staff',
		)
	) {
		return <Navigate to="/unauthorized" state={{from: location}} replace />;
	}

	return <Outlet />;
}
