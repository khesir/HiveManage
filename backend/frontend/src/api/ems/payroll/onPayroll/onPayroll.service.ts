import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { OnPayroll } from './onpayroll.model';
import { employee, onPayroll } from '../../../../../drizzle/drizzle.schema';
import { inArray } from 'drizzle-orm';
export class OnPayrollService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  async createOnPayroll(employees: OnPayroll[]) {
    return this.db.transaction(async (tx) => {
      const employeeIds = [
        ...new Set(employees.map((employee) => employee.employee_id)),
      ];

      const existingEmployees = await tx
        .select({ employee_id: employee.employee_id })
        .from(employee)
        .where(inArray(employee.employee_id, employeeIds));
      console.log(existingEmployees);

      const existingEmployeeIds = existingEmployees.map(
        (employee) => employee.employee_id,
      );

      const missingEmployeeIds = employeeIds.filter(
        (id) => !existingEmployeeIds.includes(id),
      );

      if (missingEmployeeIds.length > 0) {
        throw new Error(
          `The following Employee IDs do not exist: ${missingEmployeeIds.join(', ')}`,
        );
      }
      await Promise.all(
        employees.map((emp) => tx.insert(onPayroll).values(emp)),
      );
    });
  }
}
