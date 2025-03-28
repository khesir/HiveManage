import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee';
import {Product} from './product';

export type StockLogs = {
	stock_log_id: number;
	product_id: number;
	employee_id: number;
	quantity: number;
	movement_type: string;
	action: string;
	created_at: string;
	product: Product;
	employee: EmployeeBasicInformation;
};
