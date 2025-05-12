import {EmployeeBasicInformation} from '@/modules/ems/_components/validation/employee';

export interface ProductLogs {
	product_log_id: number;
	product_id: number;
	product_record_id: number;
	serial_id: number;
	action: string;
	quantity: number;
	performed_by: EmployeeBasicInformation;
	created_at: string;
	last_updated: string;
	deleted_at: string;
}

export interface EmployeeLogs {
	employee_logs_id: number;
	employee_id: number;
	action: string;
	quantity: number;
	performed_by: EmployeeBasicInformation;
	created_at: string;
	last_updated: string;
	deleted_at: string;
}

export interface OrderLogs {
	order_log_id: number;
	order_id: number;
	product_id: number;
	order_item_id: number;

	total_quantity: string;
	ordered_quantity: string;
	delivered_quantity: string;
	resolved_quantity: string;

	status: string;
	action_type: string;
	performed_by: EmployeeBasicInformation;
	resolve_type: string;
	created_at: string;
	last_updated: string;
	deleted_at: string;
}

export interface SalesLogs {
	sales_logs_id: number;
	sales_id: number;
	payment_id: number;
	sales_items_id: number;
	action: string;
	quantity: number;
	performed_by: EmployeeBasicInformation;
	created_at: string;
	last_updated: string;
	deleted_at: string;
}

export interface ServiceLogs {
	service_log_id: number;
	service_id: number;
	ticket_id: number;
	report_id: number;
	service_item_id: number;
	action: string;
	quantity: number;
	performed_by: EmployeeBasicInformation;
	created_at: string;
	last_updated: string;
	deleted_at: string;
}
