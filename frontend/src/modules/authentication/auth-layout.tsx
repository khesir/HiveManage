import {useLocation, Outlet, Navigate} from 'react-router-dom';
import {useEmployeeRoleDetailsStore} from './hooks/use-sign-in-userdata';

interface RequireAuthProps {
	allowedRoles: Array<'Admin' | 'Technician' | 'Sales'>;
}

export default function RequireAuth({allowedRoles}: RequireAuthProps) {
	const {user} = useEmployeeRoleDetailsStore();
	const location = useLocation();
	const userRoleName = user?.employee.position.name;
	if (!user) {
		return <Navigate to="/" state={{from: location}} replace />;
	} else if (
		userRoleName &&
		!allowedRoles.includes(userRoleName as 'Admin' | 'Technician' | 'Sales')
	) {
		return <Navigate to="/unauthorized" state={{from: location}} replace />;
	}

	return <Outlet />;
}
