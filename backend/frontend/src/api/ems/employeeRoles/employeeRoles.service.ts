import {
  and,
  asc,
  desc,
  eq,
  inArray,
  isNull,
  like,
  or,
  sql,
} from 'drizzle-orm';
import {
  employee,
  employee_roles,
  employmentInformation,
  personalInformation,
  position,
  roles,
  SchemaType,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  CreateEmployeeRoles,
  Status,
  UpdateEmployeeRoles,
} from './employeeRoles.model';
import { SupabaseService } from '@/supabase/supabase.service';
import { CreateEmployee } from '../employee/employee/employee.model';
import { PersonalInformation } from '../employee/personal_information/personalInformation.model';
import { EmploymentInformation } from '../employee/employmentInformation/employmentInformation.model';

export class EmployeeRolesService {
  private db: PostgresJsDatabase<SchemaType>;
  private supabaseSerivce: SupabaseService;
  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
    this.supabaseSerivce = SupabaseService.getInstance();
  }

  async createEmployeeAccount(
    data: CreateEmployeeRoles,
    file: Express.Multer.File | undefined,
  ) {
    return this.db.transaction(async (tx) => {
      // Insert employee for base
      let filePath = undefined;
      if (file) {
        filePath = await this.supabaseSerivce.uploadImageToBucket(file);
      }
      const [newEmployee] = await tx
        .insert(employee)
        .values({
          firstname: data.employee_firstname,
          middlename: data.employee_middlename,
          lastname: data.employee_lastname,
          email: data.employee_email,
          position_id: Number(data.employee_position_id),
          profile_link: filePath,
        } as CreateEmployee)
        .returning({ employee_id: employee.employee_id });

      await tx.insert(employmentInformation).values({
        employee_id: newEmployee.employee_id,
        department_id: Number(data.employment_information_department_id),
        designation_id: Number(data.employment_information_designation_id),
        employee_status: data.employment_information_employee_status,
        employee_type: data.employment_information_employee_type,
      } as EmploymentInformation);

      await tx.insert(personalInformation).values({
        employee_id: newEmployee.employee_id,
        birthday: data.personal_information_birthday,
        phone: data.personal_information_phone,
        sex: data.personal_information_sex,
        address_line: data.personal_information_address_line,
        postal_code: data.personal_information_postal_code,
      } as PersonalInformation);

      const email = data.employee_email;
      const password = '123456789';
      const user = await this.supabaseSerivce.createSupabaseUser(
        email,
        password,
      );
      await tx.insert(employee_roles).values({
        employee_id: Number(newEmployee.employee_id),
        role_id: Number(data.employee_role_role_id),
        user_id: user.data.user?.id,
        status: 'Offline',
      });
    });
  }

  async updateEmployeeAccount(
    data: UpdateEmployeeRoles,
    employee_role_id: string,
  ) {
    // Update Status, role or po
    console.log(employee_role_id);
  }

  async updateStatus(data: Status, employee_role_id: string) {
    await this.db
      .update(employee_roles)
      .set(data)
      .where(eq(employee_roles.employee_roles_id, Number(employee_role_id)));
  }

  async getAllEmployeeAccount(
    sort: string,
    limit: number,
    offset: number,
    status: string | undefined,
    role_id: string | undefined,
    employee_id: string | undefined,
    user_id: string | undefined,
    fullname: string | undefined,
    position_id: string | undefined,
  ) {
    const conditions = [isNull(employee_roles.deleted_at)];
    const employeeIds: number[] = [];
    const employeePosIDs: number[] = [];
    // Name Filter
    if (fullname) {
      const likeFullname = `%${fullname}%`;
      const nameConditions = or(
        like(employee.firstname, likeFullname),
        like(employee.middlename, likeFullname),
        like(employee.lastname, likeFullname),
      );
      const employeeData = await this.db
        .select()
        .from(employee)
        .where(and(nameConditions, isNull(employee.deleted_at)));
      employeeIds.push(...employeeData.map((emp) => emp.employee_id));

      if (employeeIds.length > 0) {
        conditions.push(inArray(employee_roles.employee_id, employeeIds));
      }
    }
    // Status Filter
    if (status) {
      conditions.push(eq(employee_roles.status, status));
    }
    // Employee ID Filter
    if (employee_id) {
      conditions.push(eq(employee_roles.employee_id, Number(employee_id)));
    }
    // Supabase UserID Filter
    if (user_id) {
      conditions.push(eq(employee_roles.user_id, user_id));
    }
    // Role Filter
    if (role_id) {
      conditions.push(eq(roles.role_id, Number(role_id)));
    }
    // Position Filter
    if (position_id) {
      const empPos = await this.db
        .select()
        .from(employee)
        .where(
          and(
            eq(employee.position_id, Number(position_id)),
            isNull(employee.deleted_at),
          ),
        );
      employeePosIDs.push(...empPos.map((emp) => emp.employee_id));
      if (employeePosIDs.length > 0) {
        conditions.push(inArray(employee_roles.employee_id, employeePosIDs));
      }
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(employee_roles)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(employee_roles)
      .leftJoin(employee, eq(employee.employee_id, employee_roles.employee_id))
      .leftJoin(roles, eq(roles.role_id, employee_roles.role_id))
      .leftJoin(position, eq(position.position_id, employee.position_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(employee_roles.created_at)
          : desc(employee_roles.created_at),
      )
      .limit(limit)
      .offset(offset);

    const employeeaccountWithDetails = result.map((row) => ({
      employee_roles_id: row.employee_roles.employee_roles_id,
      employee: {
        employee_id: row.employee?.employee_id,
        position: {
          position_id: row.position?.position_id,
          name: row.position?.name,
          created_at: row.position?.created_at,
          last_updated: row.position?.last_updated,
          deleted_at: row.position?.deleted_at,
        },
        firstname: row.employee?.firstname,
        middlename: row.employee?.middlename,
        lastname: row.employee?.lastname,
        email: row.employee?.email,
        profile_link: row.employee?.profile_link,
        created_at: row.employee?.created_at,
        last_updated: row.employee?.last_updated,
        deleted_at: row.employee?.deleted_at,
      },
      role: {
        role_id: row.roles?.role_id,
        name: row.roles?.name,
        created_at: row.roles?.created_at,
        last_updated: row.roles?.last_updated,
        deleted_at: row.roles?.deleted_at,
      },
      status: row.employee_roles?.status,
      created_at: row.employee_roles.created_at,
      last_updated: row.employee_roles.last_updated,
      deleted_at: row.employee_roles.deleted_at,
    }));
    return { totalData, employeeaccountWithDetails };
  }

  async getEmployeeAccountById(employee_roles_id: string) {
    const result = await this.db
      .select()
      .from(employee_roles)
      .leftJoin(employee, eq(employee.employee_id, employee_roles.employee_id))
      .leftJoin(roles, eq(roles.role_id, employee_roles.role_id))
      .leftJoin(position, eq(position.position_id, employee.position_id))
      .where(
        and(
          eq(employee_roles.employee_roles_id, Number(employee_roles_id)),
          isNull(employee_roles.deleted_at),
        ),
      );

    const employeeaccountWithDetails = result.map((row) => ({
      employee_roles_id: row.employee_roles.employee_roles_id,
      employee: {
        employee_id: row.employee?.employee_id,
        position: {
          position_id: row.position?.position_id,
          name: row.position?.name,
          created_at: row.position?.created_at,
          last_updated: row.position?.last_updated,
          deleted_at: row.position?.deleted_at,
        },
        firstname: row.employee?.firstname,
        middlename: row.employee?.middlename,
        lastname: row.employee?.lastname,
        profile_link: row.employee?.profile_link,
        created_at: row.employee?.created_at,
        last_updated: row.employee?.last_updated,
        deleted_at: row.employee?.deleted_at,
      },
      role: {
        role_id: row.roles?.role_id,
        name: row.roles?.name,
        created_at: row.roles?.created_at,
        last_updated: row.roles?.last_updated,
        deleted_at: row.roles?.deleted_at,
      },
      status: row.employee_roles?.status,
      created_at: row.employee_roles.created_at,
      last_updated: row.employee_roles.last_updated,
      deleted_at: row.employee_roles.deleted_at,
    }));
    return employeeaccountWithDetails;
  }

  async deleteEmployeeAccount(paramsId: number): Promise<void> {
    await this.db
      .update(employee_roles)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(employee_roles.employee_roles_id, paramsId));
  }
}
