import { asc, desc, eq, isNull, and, sql, like, or } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import {
  department,
  designation,
  employee,
  employee_roles,
  employmentInformation,
  personalInformation,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { CreateEmployee, UpdateEmployee } from './employee.model';
import { SupabaseService } from '@/supabase/supabase.service';

export class EmployeeService {
  private db: PostgresJsDatabase<SchemaType>;
  private supabaseSerivce: SupabaseService;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
    this.supabaseSerivce = SupabaseService.getInstance();
  }
  async getAllEmployee(
    limit: number,
    sort: string,
    offset: number,
    fullname: string | undefined,
  ) {
    const conditions = [isNull(employee.deleted_at)];

    if (fullname) {
      const likeFullname = `%${fullname}%`; // Partial match
      const nameConditions = or(
        like(employee.firstname, likeFullname),
        like(employee.middlename, likeFullname),
        like(employee.lastname, likeFullname),
      );
      if (nameConditions) {
        conditions.push(nameConditions);
      }
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(employee)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(employee)
      .where(and(...conditions))
      .leftJoin(
        personalInformation,
        eq(personalInformation.employee_id, employee.employee_id),
      )
      .leftJoin(
        employmentInformation,
        eq(employmentInformation.employee_id, employee.employee_id),
      )
      .leftJoin(
        department,
        eq(department.department_id, employmentInformation.department_id),
      )
      .leftJoin(
        designation,
        eq(designation.designation_id, employmentInformation.designation_id),
      )
      .orderBy(
        sort === 'asc' ? asc(employee.created_at) : desc(employee.created_at),
      )
      .limit(limit)
      .offset(offset);

    const employeeWithRelatedData = result.map((row) => ({
      employee: row.employee,
      personal_information: row.personal_info,
      employment_information: {
        ...row.employment_info,
        department: {
          ...row.department,
        },
        designation: {
          ...row.designation,
        },
      },
    }));
    return {
      totalData,
      employeeWithRelatedData,
    };
  }

  async createEmployee(data: CreateEmployee): Promise<void> {
    await this.db.insert(employee).values(data);
  }

  async getEmployeeById(paramsId: number) {
    const result = await this.db
      .select()
      .from(employee)
      .where(eq(employee.employee_id, paramsId))
      .leftJoin(
        personalInformation,
        eq(personalInformation.employee_id, employee.employee_id),
      )
      .leftJoin(
        employmentInformation,
        eq(employmentInformation.employee_id, employee.employee_id),
      )
      .leftJoin(
        department,
        eq(department.department_id, employmentInformation.department_id),
      )
      .leftJoin(
        designation,
        eq(designation.designation_id, employmentInformation.designation_id),
      );

    const employeeWithRelatedData = result.map((row) => ({
      employee: row.employee,
      personal_information: row.personal_info,
      employment_information: {
        ...row.employment_info,
        department: {
          ...row.department,
        },
        designation: {
          ...row.designation,
        },
      },
    }));
    return employeeWithRelatedData;
  }

  async updateEmployee(
    paramsId: number,
    data: UpdateEmployee,
    file: Express.Multer.File | undefined,
  ) {
    return this.db.transaction(async (tx) => {
      // Update EmployeeRoles
      if (data.role_id) {
        await tx
          .update(employee_roles)
          .set({ role_id: Number(data.role_id) })
          .where(eq(employee_roles.employee_id, paramsId));
      }
      // Upload file
      let filePath = undefined;
      const empNewData = {
        ...data,
        position_id: data.position_id ? Number(data.position_id) : undefined,
      };
      delete empNewData['role_id'];
      if (file) {
        filePath = await this.supabaseSerivce.uploadImageToBucket(file);
        empNewData['profile_link'] = filePath;
      } else if (data.remove_image === 'true') {
        empNewData['profile_link'] = undefined;
      }
      //Update employee
      await tx
        .update(employee)
        .set(empNewData)
        .where(eq(employee.employee_id, paramsId));
    });
  }

  async deleteEmployeeById(employeeId: number): Promise<void> {
    await this.db
      .update(employee)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employee.employee_id, employeeId));
  }
}
