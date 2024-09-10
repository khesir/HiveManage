import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { OnPayroll } from './onPayroll.model';
import { employee, onPayroll } from '../../../../../drizzle/drizzle.schema';
import { inArray, eq, and, isNull } from 'drizzle-orm';
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
  async updateOnPayroll(
    toAddEmployee: number[],
    toDeleteEmployee: number[],
    payroll_id: number,
  ) {
    return this.db.transaction(async (tx) => {
      // Fetch all employee based on its payroll_id
      const existingEmployees = await tx
        .select()
        .from(onPayroll)
        .where(
          and(
            eq(onPayroll.payroll_id, payroll_id),
            isNull(onPayroll.deleted_at),
          ),
        );

      // Create a set of existing employee IDs
      const existingEmployeeIdsSet = existingEmployees.map(
        (emp) => emp.employee_id,
      );

      // Filter out employees that do not exist in the database
      const missingEmployeeIds = toDeleteEmployee.filter(
        (id) => !existingEmployeeIdsSet.includes(id),
      );

      if (missingEmployeeIds.length > 0) {
        throw new Error(
          `The following Employee IDs do not exist: ${missingEmployeeIds.join(', ')}`,
        );
      }

      // Validate if employee exists on the list throw errror where this employee is already added
      const alreadyAddedEmployeeIds = toAddEmployee.filter((id) => {
        existingEmployeeIdsSet.includes(id);
      });

      if (alreadyAddedEmployeeIds.length > 0) {
        throw new Error(
          `The following Employee IDs are already added to the payroll: ${alreadyAddedEmployeeIds.join(',')}`,
        );
      }

      // Add new employees to payroll

      await Promise.all(
        toAddEmployee.map((id) =>
          tx.insert(onPayroll).values({
            payroll_id: payroll_id,
            employee_id: id,
          }),
        ),
      );

      await tx
        .update(onPayroll)
        .set({ deleted_at: new Date(Date.now()) })
        .where(
          and(
            eq(onPayroll.payroll_id, payroll_id),
            inArray(onPayroll.employee_id, toDeleteEmployee),
            isNull(onPayroll.deleted_at),
          ),
        );
      return {
        message: 'On Payroll update completed succesfully',
      };
    });
  }
}
