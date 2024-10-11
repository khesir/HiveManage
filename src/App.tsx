import {Routes as Router, Route, BrowserRouter} from 'react-router-dom';
import NotFound from './pages/_auth/_not-found';
// Layouts
import MainLayout from './components/layout/main-layout';
// Authentication
import AuthenticationPage from './pages/_auth/login';
// Admin
import DashboardPage from './pages/admin/dashboard';
import EmployeeOverviewPage from './pages/admin/systems/ems/overview-page';
import EmployeePage from './pages/admin/systems/ems/employee-page';
import EmployeeCreatePage from './pages/admin/systems/ems/employee-create-page';
import EmployeeUpdatePage from './pages/admin/systems/ems/employee-update-page';
import EmployeeViewPage from './pages/admin/systems/ems/employee-view-page';

function App() {
	return (
		<BrowserRouter>
			<Router>
				<Route index path="/" element={<AuthenticationPage />} />

				{/* Admin Layout */}
				<Route path="admin" element={<MainLayout userType={'admin'} />}>
					<Route path="dashboard" element={<DashboardPage />} />

					<Route path="ems">
						<Route path="overview" element={<EmployeeOverviewPage />} />

						<Route path="employees">
							<Route index element={<EmployeePage />} />
							<Route path="create" element={<EmployeeCreatePage />} />
							<Route path="update" element={<EmployeeUpdatePage />} />
							<Route path="view" element={<EmployeeViewPage />} />
						</Route>

						<Route path="payroll" />
						<Route path="payroll/:id/details" />
						<Route path="payroll/:id/create/" />

						<Route path="leave" />
					</Route>

					<Route path="sales">
						<Route path="overview" />
						<Route path="services" />
					</Route>

					<Route path="inventory">
						<Route path="overview" />
						<Route path="items" />
						<Route path="orders" />
					</Route>
				</Route>

				{/* TODO: Technical Layout */}
				<Route path="tech" element={<MainLayout userType={'tech'} />}>
					<Route path="dashboard" element={<DashboardPage />} />
				</Route>

				{/* TODO: Sales Layout */}
				<Route path="sales" element={<MainLayout userType={'sales'} />}>
					<Route path="dashboard" element={<DashboardPage />} />
					<Route path="in-house" element={<DashboardPage />} />
					<Route path="history" element={<DashboardPage />} />
					<Route path="customer" element={<DashboardPage />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Router>
		</BrowserRouter>
	);
}

export default App;
