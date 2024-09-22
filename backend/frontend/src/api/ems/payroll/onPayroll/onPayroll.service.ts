import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { OnPayroll } from './onPayroll.model';
import { employee, onPayroll, payrollApproval } from '@/drizzle/drizzle.schema';
import { inArray, eq, and, isNull } from 'drizzle-orm';
export class OnPayrollService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }
  async getAllOnPayroll(payroll_id: number) {
    const result = await this.db
      .select()
      .from(onPayroll)
      .leftJoin(employee, eq(onPayroll.employee_id, employee.employee_id))
      .leftJoin(
        payrollApproval,
        eq(onPayroll.on_payroll_id, payrollApproval.on_payroll_id),
      )
      .where(and(eq(onPayroll.payroll_id, payroll_id)));
    return result;
  }

  async createOnPayroll(employees: OnPayroll[], payroll_id: number) {
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
        employees.map((emp) =>
          tx
            .insert(onPayroll)
            .values({ employee_id: emp.employee_id, payroll_id: payroll_id }),
        ),
      );
    });
  }
  async updateOnPayroll(
    toAddEmployee: OnPayroll[],
    toDeleteEmployee: OnPayroll[],
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
      console.log(existingEmployeeIdsSet);

      if (toDeleteEmployee.length > 0) {
        const deleteEmp = toDeleteEmployee.map((emp) => emp.employee_id);
        // Filter out employees that do not exist in the database
        const missingEmployeeIds = deleteEmp.filter(
          (id) => !existingEmployeeIdsSet.includes(id),
        );
        console.log(missingEmployeeIds);

        if (missingEmployeeIds.length > 0) {
          throw new Error(
            `The following Employee IDs do not exist: ${missingEmployeeIds.join(', ')}`,
          );
        }

        await Promise.all(
          toDeleteEmployee.map((emp) =>
            tx
              .update(onPayroll)
              .set({ deleted_at: new Date(Date.now()) })
              .where(
                and(
                  eq(onPayroll.payroll_id, payroll_id),
                  eq(onPayroll.employee_id, emp.employee_id),
                  isNull(onPayroll.deleted_at),
                ),
              ),
          ),
        );
      }

      if (toAddEmployee.length > 0) {
        const addEmployees = toAddEmployee.map((emp) => emp.employee_id);
        // Validate if employee exists on the list throw errror where this employee is already added
        const alreadyAddedEmployeeIds = addEmployees.filter((id) => {
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
              employee_id: id.employee_id,
            }),
          ),
        );
      }

      return {
        message: 'On Payroll update completed succesfully',
      };
    });
  }
}
