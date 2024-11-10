import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import {
  assignedemployees,
  customer,
  employee,
  jobOrder,
  joborder_services,
  jobordertype,
  SchemaType,
  service,
} from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateJobOrder, UpdateJobOrder } from './joborder.model';

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
    uuid: string | undefined,
    service_id: string | undefined,
    joborder_status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(jobOrder.deleted_at)];

    if (joborder_status) {
      // Define valid statuses as a string union type
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
      ] as const; // 'as const' infers a readonly tuple of strings
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
    if (service_id) {
      conditions.push(eq(jobOrder.service_id, Number(service_id)));
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
      .leftJoin(service, eq(service.service_id, jobOrder.service_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(jobOrder.created_at) : desc(jobOrder.created_at),
      );

    // Control Pagination
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;

    const joAssign = await this.db
      .select()
      .from(assignedemployees)
      .leftJoin(
        employee,
        eq(employee.employee_id, assignedemployees.employee_id),
      )
      .where(isNull(assignedemployees.deleted_at));

    const assignmentsByJoID = joAssign.reduce(
      (acc, assignment) => {
        if (
          assignment.assignedemployees.job_order_id !== null &&
          !(assignment.assignedemployees.job_order_id in acc)
        ) {
          acc[assignment.assignedemployees.job_order_id] = [];
        }
        if (assignment.assignedemployees.job_order_id !== null) {
          acc[assignment.assignedemployees.job_order_id].push({
            ...assignment.assignedemployees,
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

    const jotypes = await this.db
      .select()
      .from(joborder_services)
      .leftJoin(
        jobordertype,
        eq(jobordertype.joborder_type_id, joborder_services.joborder_types_id),
      )
      .where(isNull(joborder_services.deleted_at));
    const typesByJoService = jotypes.reduce(
      (acc, type) => {
        if (
          type.joborder_services.job_order_id !== null &&
          !(type.joborder_services.job_order_id in acc)
        ) {
          acc[type.joborder_services.job_order_id] = [];
        }
        if (type.joborder_services.job_order_id !== null) {
          acc[type.joborder_services.job_order_id].push({
            ...type.joborder_services,
            joborder_type: {
              ...type.jobordertype,
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
      joborder_id: row.joborder.job_order_id,
      joborder_assign: assignmentsByJoID[row.joborder.job_order_id] || [],
      joborder_type: typesByJoService[row.joborder.job_order_id] || [],
      service: {
        service_id: row.service?.service_id,
        employee: {
          employee_id: row.employee?.employee_id,
          firstname: row.employee?.firstname,
          middlename: row.employee?.middlename,
          lastname: row.employee?.lastname,
          email: row.employee?.email,
          profile_link: row.employee?.profile_link,
          created_at: row.employee?.created_at,
          last_updated: row.employee?.last_updated,
          deleted_at: row.employee?.deleted_at,
        },
        customer: {
          customer_id: row.customer?.customer_id,
          firstname: row.customer?.firstname,
          lastname: row.customer?.lastname,
          contact_phone: row.customer?.contact_phone,
          socials: row.customer?.socials,
          address_line: row.customer?.address_line,
          baranay: row.customer?.address_line,
          province: row.customer?.province,
          standing: row.customer?.standing,
        },
        service_title: row.service?.service_title,
        service_description: row.service?.service_description,
        service_status: row.service?.service_status,
        has_reservation: row.service?.has_reservation,
        has_sales_item: row.service?.has_sales_item,
        has_borrow: row.service?.has_borrow,
        has_job_order: row.service?.has_job_order,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      uuid: row.joborder?.uuid,
      fee: row.joborder?.fee,
      joborder_status: row.joborder?.joborder_status,
      total_cost_price: row.joborder?.total_cost_price,
      created_at: row.joborder?.created_at,
      last_updated: row.joborder?.last_updated,
      deleted_at: row.joborder?.deleted_at,
    }));

    return { totalData, joborderitemWithDetails };
  }

  async getJobOrderById(job_order_id: number) {
    const result = await this.db
      .select()
      .from(jobOrder)
      .leftJoin(service, eq(service.service_id, jobOrder.service_id))
      .leftJoin(employee, eq(employee.employee_id, service.employee_id))
      .leftJoin(customer, eq(customer.customer_id, service.customer_id))
      .where(eq(jobOrder.job_order_id, Number(job_order_id)));

    const joAssign = await this.db
      .select()
      .from(assignedemployees)
      .leftJoin(
        employee,
        eq(employee.employee_id, assignedemployees.employee_id),
      )
      .where(isNull(assignedemployees.deleted_at));

    const assignmentsByJoID = joAssign.reduce(
      (acc, assignment) => {
        if (
          assignment.assignedemployees.job_order_id !== null &&
          !(assignment.assignedemployees.job_order_id in acc)
        ) {
          acc[assignment.assignedemployees.job_order_id] = [];
        }
        if (assignment.assignedemployees.job_order_id !== null) {
          acc[assignment.assignedemployees.job_order_id].push({
            ...assignment.assignedemployees,
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

    const jotypes = await this.db
      .select()
      .from(joborder_services)
      .leftJoin(
        jobordertype,
        eq(jobordertype.joborder_type_id, joborder_services.joborder_types_id),
      )
      .where(isNull(joborder_services.deleted_at));
    const typesByJoService = jotypes.reduce(
      (acc, type) => {
        if (
          type.joborder_services.job_order_id !== null &&
          !(type.joborder_services.job_order_id in acc)
        ) {
          acc[type.joborder_services.job_order_id] = [];
        }
        if (type.joborder_services.job_order_id !== null) {
          acc[type.joborder_services.job_order_id].push({
            ...type.joborder_services,
            joborder_type: {
              ...type.jobordertype,
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
      joborder_id: row.joborder.job_order_id,
      joborder_assign: assignmentsByJoID[row.joborder.job_order_id] || [],
      joborder_type: typesByJoService[row.joborder.job_order_id] || [],
      service: {
        service_id: row.service?.service_id,
        employee: {
          employee_id: row.employee?.employee_id,
          firstname: row.employee?.firstname,
          middlename: row.employee?.middlename,
          lastname: row.employee?.lastname,
          email: row.employee?.email,
          profile_link: row.employee?.profile_link,
          created_at: row.employee?.created_at,
          last_updated: row.employee?.last_updated,
          deleted_at: row.employee?.deleted_at,
        },
        customer: {
          customer_id: row.customer?.customer_id,
          firstname: row.customer?.firstname,
          lastname: row.customer?.lastname,
          contact_phone: row.customer?.contact_phone,
          socials: row.customer?.socials,
          address_line: row.customer?.address_line,
          baranay: row.customer?.address_line,
          province: row.customer?.province,
          standing: row.customer?.standing,
        },
        service_title: row.service?.service_title,
        service_description: row.service?.service_description,
        service_status: row.service?.service_status,
        has_reservation: row.service?.has_reservation,
        has_sales_item: row.service?.has_sales_item,
        has_borrow: row.service?.has_borrow,
        has_job_order: row.service?.has_job_order,
        created_at: row.service?.created_at,
        last_updated: row.service?.last_updated,
        deleted_at: row.service?.deleted_at,
      },
      uuid: row.joborder?.uuid,
      fee: row.joborder?.fee,
      joborder_status: row.joborder?.joborder_status,
      total_cost_price: row.joborder?.total_cost_price,
      created_at: row.joborder?.created_at,
      last_updated: row.joborder?.last_updated,
      deleted_at: row.joborder?.deleted_at,
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
