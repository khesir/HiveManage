import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateJobOrder, UpdateJobOrder } from './joborder.model';
import { customer } from '@/drizzle/schema/customer';
import { employee } from '@/drizzle/schema/ems';
import {
  assignedEmployees,
  jobOrder,
  jobOrderType,
} from '@/drizzle/schema/services';
import { SchemaType } from '@/drizzle/schema/type';

export class JobOrderService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createJobOrder(data: CreateJobOrder) {
    await this.db.insert(jobOrder).values(data);
  }

  async getAllJobOrder(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
    uuid: string | undefined,
    customer_id: string | undefined,
    joborder_status: string | undefined,
  ) {
    const conditions = [isNull(jobOrder.deleted_at)];

    if (joborder_status) {
      const validStatuses = [
        'Pending',
        'In Progress',
        'Completed',
        'On Hold',
        'Cancelled',
        'Awaiting Approval',
        'Approved',
        'Rejected',
        'Closed',
      ] as const;
      if (
        validStatuses.includes(
          joborder_status as (typeof validStatuses)[number],
        )
      ) {
        conditions.push(
          eq(
            jobOrder.joborder_status,
            joborder_status as (typeof validStatuses)[number],
          ),
        );
      } else {
        throw new Error(`Invalid payment status: ${status}`);
      }
    }
    if (customer_id) {
      conditions.push(eq(jobOrder.customer_id, Number(customer_id)));
    }
    if (uuid) {
      conditions.push(sql`${jobOrder.uuid} LIKE ${'%' + uuid + '%'}`);
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(jobOrder)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(jobOrder)
      .leftJoin(
        jobOrderType,
        eq(jobOrderType.joborder_type_id, jobOrder.job_order_type_id),
      )
      .leftJoin(customer, eq(customer.customer_id, jobOrder.customer_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(jobOrder.created_at) : desc(jobOrder.created_at),
      );

    // Control Pagination
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    // Getting all employee that is asssigned using the joint table of assignedEmployee
    const joAssign = await this.db
      .select()
      .from(assignedEmployees)
      .leftJoin(
        employee,
        eq(employee.employee_id, assignedEmployees.employee_id),
      )
      .where(isNull(assignedEmployees.deleted_at));

    const assignmentsByJoID = joAssign.reduce(
      (acc, assignment) => {
        if (
          assignment.assigned_employees.job_order_id !== null &&
          !(assignment.assigned_employees.job_order_id in acc)
        ) {
          acc[assignment.assigned_employees.job_order_id] = [];
        }
        if (assignment.assigned_employees.job_order_id !== null) {
          acc[assignment.assigned_employees.job_order_id].push({
            ...assignment.assigned_employees,
            employee: {
              ...assignment.employee,
            },
          });
        }
        return acc;
      },
      // Too much work to write a typing for this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<number, any[]>,
    );
    // Filter and map only job orders where the specified employee_id is involved
    const joborderitemWithDetails = result
      .filter((row) => {
        const assignments = assignmentsByJoID[row.job_order.job_order_id] || [];
        return Number(employee)
          ? assignments.some(
              (assignment) => assignment.employee_id === Number(employee),
            )
          : assignments.length > 0;
      })
      .map((row) => ({
        ...row.job_order,
        joborder_assign: assignmentsByJoID[row.job_order.job_order_id] || [],
        customer: {
          ...row.customer,
        },
      }));
    return { totalData, joborderitemWithDetails };
  }

  async getJobOrderById(job_order_id: number) {
    const result = await this.db
      .select()
      .from(jobOrder)
      .leftJoin(
        jobOrderType,
        eq(jobOrderType.joborder_type_id, jobOrder.job_order_type_id),
      )
      .leftJoin(customer, eq(customer.customer_id, jobOrder.customer_id))
      .where(eq(jobOrder.job_order_id, Number(job_order_id)));

    const joAssign = await this.db
      .select()
      .from(assignedEmployees)
      .leftJoin(
        employee,
        eq(employee.employee_id, assignedEmployees.employee_id),
      )
      .where(isNull(assignedEmployees.deleted_at));

    const assignmentsByJoID = joAssign.reduce(
      (acc, assignment) => {
        if (
          assignment.assigned_employees.job_order_id !== null &&
          !(assignment.assigned_employees.job_order_id in acc)
        ) {
          acc[assignment.assigned_employees.job_order_id] = [];
        }
        if (assignment.assigned_employees.job_order_id !== null) {
          acc[assignment.assigned_employees.job_order_id].push({
            ...assignment.assigned_employees,
            employee: {
              ...assignment.employee,
            },
          });
        }
        return acc;
      },
      // Too much work to write a typing for this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<number, any[]>,
    );

    const joborderitemWithDetails = result.map((row) => ({
      joborder_id: row.job_order.job_order_id,
      joborder_assign: assignmentsByJoID[row.job_order.job_order_id] || [],
      jobordertype: {
        joborder_type_id: row.job_order_type?.joborder_type_id,
        name: row.customer?.firstname,
        description: row.customer?.lastname,
        fee: row.customer?.contact_phone,
        customer: {
          customer_id: row.customer?.customer_id,
          firstname: row.customer?.firstname,
          lastname: row.customer?.lastname,
          contact: row.customer?.contact_phone,
          email: row.customer?.email,
          socials: row.customer?.socials,
          addressline: row.customer?.address_line,
          barangay: row.customer?.barangay,
          province: row.customer?.province,
          standing: row.customer?.standing,
          customer_group_id: row.customer?.customer_group_id,
        },
        joborder_name: row.job_order_type?.name,
        jobtype_description: row.job_order_type?.description,
        created_at: row.job_order_type?.created_at,
        last_updated: row.job_order_type?.last_updated,
        deleted_at: row.job_order_type?.deleted_at,
      },
      uuid: row.job_order?.uuid,
      fee: row.job_order?.fee,
      joborder_status: row.job_order?.joborder_status,
      total_cost_price: row.job_order?.total_cost_price,
      created_at: row.job_order?.created_at,
      last_updated: row.job_order?.last_updated,
      deleted_at: row.job_order?.deleted_at,
    }));

    return joborderitemWithDetails;
  }

  async updateJobOrder(data: UpdateJobOrder, paramsId: number) {
    await this.db
      .update(jobOrder)
      .set(data)
      .where(eq(jobOrder.job_order_id, paramsId));
  }

  async deleteJobOrder(paramsId: number): Promise<void> {
    await this.db
      .update(jobOrder)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(jobOrder.job_order_id, paramsId));
  }
}
