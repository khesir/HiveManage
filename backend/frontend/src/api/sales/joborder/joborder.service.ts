import {
  and,
  eq,
  isNull,
  sql,
  asc,
  desc,
  inArray,
  gte,
  lte,
} from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { CreateJoborder, UpdateJoborder } from './joborder.model';
import { customer } from '@/drizzle/schema/customer';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';
import { joborder } from '@/drizzle/schema/services/schema/service/joborder.schema';
import { joborderLog } from '@/drizzle/schema/records/schema/joborderLog';
import { payment } from '@/drizzle/schema/payment';
import { service } from '@/drizzle/schema/services';
import { serviceItem } from '@/drizzle/schema/services/schema/service/serviceItems';
import { product, serializeProduct } from '@/drizzle/schema/ims';

export class JoborderService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createJoborder(data: CreateJoborder) {
    await this.db.transaction(async (tx) => {
      const [newJoborder] = await tx
        .insert(joborder)
        .values({
          ...data,
          expected_completion_date: data.expected_completion_date
            ? new Date(data.expected_completion_date)
            : undefined,
          completed_at: data.completed_at
            ? new Date(data.completed_at)
            : undefined,
          turned_over_at: data.turned_over_at
            ? new Date(data.turned_over_at)
            : undefined,
        })
        .returning({ joborder_id: joborder.joborder_id });
      await tx
        .update(joborder)
        .set({ joborder_uuid: `JO-${newJoborder.joborder_id}` })
        .where(eq(joborder.joborder_id, newJoborder.joborder_id));
      await tx.insert(joborderLog).values({
        joborder_id: newJoborder.joborder_id,
        action: 'Created Joborder',
        performed_by: data.user_id,
      });
      // Create employee logging
      await tx.insert(employeeLog).values({
        employee_id: data.user_id,
        action: 'Created Joborder',
        performed_by: data.user_id,
      });
    });
  }

  async getAllJoborders(
    no_pagination: boolean,
    sort: string,
    limit: number,
    offset: number,
    status: string | undefined,
    range: string | undefined,
  ) {
    const conditions = [isNull(joborder.deleted_at)];
    if (status) {
      conditions.push(
        eq(
          joborder.status,
          status as
            | 'Pending'
            | 'In Progress'
            | 'Completed'
            | 'Turned Over'
            | 'Cancelled',
        ),
      );
    }

    if (range) {
      const now = new Date();
      const date = new Date(now); // clone the current date

      const amount = parseInt(range.slice(0, -1));
      const unit = range.slice(-1).toLowerCase(); // lowercase to accept "D" or "d"

      if (unit === 'd') {
        date.setDate(date.getDate() - amount); // subtract days
      } else if (unit === 'm') {
        date.setMonth(date.getMonth() - amount); // subtract months
      }

      // Conditions: From 'date' (earlier) to 'now' (later)
      conditions.push(gte(joborder.turned_over_at, date));
      conditions.push(lte(joborder.turned_over_at, now));
    }
    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(joborder)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(joborder)
      .leftJoin(customer, eq(customer.customer_id, joborder.customer_id))
      .leftJoin(payment, eq(payment.payment_id, joborder.payment_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc' ? asc(joborder.joborder_id) : desc(joborder.joborder_id),
      );

    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }

    const result = await query;
    const joborderIds = result.map((s) => s.joborder.joborder_id);
    const joborderServiceByJoborderID =
      await this.getJoborderServiceByJoborderID(joborderIds);
    const joborderWithDetails = result.map((row) => ({
      ...row.joborder,
      customer: row.customer,
      services: joborderServiceByJoborderID.get(row.joborder.joborder_id),
      payment: row.payment,
    }));

    return { totalData, joborderWithDetails };
  }

  async getJoborderById(Joborder_id: number) {
    const result = await this.db
      .select()
      .from(joborder)
      .leftJoin(customer, eq(customer.customer_id, joborder.customer_id))
      .leftJoin(service, eq(service.joborder_id, joborder.joborder_id))
      .where(eq(joborder.joborder_id, Number(Joborder_id)));

    const joborderIds = result.map((s) => s.joborder.joborder_id);
    const joborderServiceByJoborderID =
      await this.getJoborderServiceByJoborderID(joborderIds);
    const joborderWithDetails = result.map((row) => ({
      ...row.joborder,
      customer: row.customer,
      services: joborderServiceByJoborderID.get(row.joborder.joborder_id),
    }));

    return joborderWithDetails;
  }

  async updateJoborder(data: UpdateJoborder, paramsId: number) {
    await this.db.transaction(async (tx) => {
      const [returningData] = await tx
        .update(joborder)
        .set({
          ...data,
          expected_completion_date: data.expected_completion_date
            ? new Date(data.expected_completion_date)
            : undefined,
          completed_at: data.completed_at
            ? new Date(data.completed_at)
            : undefined,
          turned_over_at: data.turned_over_at
            ? new Date(data.turned_over_at)
            : undefined,
        })
        .where(eq(joborder.joborder_id, paramsId))
        .returning({ joborder_id: joborder.joborder_id });
      await tx.insert(joborderLog).values({
        joborder_id: returningData.joborder_id,
        action: 'Updated Joborder Data',
        performed_by: data.user_id,
      });
      await tx.insert(employeeLog).values({
        employee_id: data.user_id,
        action: 'Updated Joborder',
        performed_by: data.user_id,
      });
    });
  }

  async deleteJoborder(paramsId: number): Promise<void> {
    await this.db
      .update(joborder)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(joborder.joborder_id, paramsId));
  }
  async payment(
    { payment: paymentData, user_id }: UpdateJoborder,
    joborder_id: number,
  ): Promise<void> {
    await this.db.transaction(async (tx) => {
      if (
        !paymentData ||
        paymentData.payment_method === undefined ||
        paymentData.payment_type === undefined
      ) {
        throw new Error('payment_method and payment_type are required');
      }
      const [newPayment] = await tx
        .insert(payment)
        .values({
          ...paymentData,
          payment_method: paymentData.payment_method,
          payment_type: paymentData.payment_type,
        })
        .returning({ payment_id: payment.payment_id });
      // Process all service items and stockout
      const services = await tx
        .select()
        .from(service)
        .where(eq(service.joborder_id, joborder_id));

      const serviceIds = services.map((service) => service.service_id);
      const serviceItems = await tx
        .select()
        .from(serviceItem)
        .where(inArray(serviceItem.service_id, serviceIds));
      await Promise.all(
        serviceItems.map(async (item) => {
          if (!item.product_id) {
            throw new Error('Missing product_id in service item');
          }
          await tx
            .update(product)
            .set({
              service_quantity: sql`${product.service_quantity} - ${item.quantity}`,
            })
            .where(eq(product.product_id, item.product_id!));
          await tx
            .update(serializeProduct)
            .set({ status: 'Sold' })
            .where(
              inArray(
                serializeProduct.serial_id,
                Array.isArray(item.serialize_items) ? item.serialize_items : [],
              ),
            );
        }),
      );
      // Mark Joborder Complete
      await tx
        .update(joborder)
        .set({
          payment_id: newPayment.payment_id,
          status: 'Completed',
          turned_over_at: new Date(),
        })
        .where(eq(joborder.joborder_id, joborder_id));
      await tx.insert(joborderLog).values({
        joborder_id: joborder_id,
        action: `Payment created with value ${paymentData.amount} `,
        performed_by: user_id,
      });
    });
  }
  // private async getAssignedEmployeeByJoborderIDs(
  //   JoborderIDs: number[],
  // ): Promise<Map<number, unknown[]>> {
  //   const result = await this.db
  //     .select()
  //     .from(assignedEmployees)
  //     .leftJoin(
  //       employee,
  //       eq(employee.employee_id, assignedEmployees.employee_id),
  //     )
  //     .where(inArray(assignedEmployees.Joborder_id, JoborderIDs));

  //   const assignedEmployeesByJoborderID = new Map<number, unknown[]>();

  //   result.forEach((record) => {
  //     const JoborderID = record.assigned_employees.Joborder_id!;
  //     if (!assignedEmployeesByJoborderID.has(JoborderID)) {
  //       assignedEmployeesByJoborderID.set(JoborderID, []);
  //     }
  //     assignedEmployeesByJoborderID.get(JoborderID)!.push({
  //       ...record.assigned_employees,
  //       employee: record.employee,
  //     });
  //   });
  //   return assignedEmployeesByJoborderID;
  // }
  private async getJoborderServiceByJoborderID(
    joborderIds: number[],
  ): Promise<Map<number, unknown[]>> {
    const result = await this.db
      .select()
      .from(service)
      .leftJoin(joborder, eq(joborder.joborder_id, service.joborder_id))
      .where(inArray(joborder.joborder_id, joborderIds));

    const assignedJoborderService = new Map<number, unknown[]>();

    result.forEach((record) => {
      const joborderId = record.service.joborder_id!;
      if (!assignedJoborderService.has(joborderId)) {
        assignedJoborderService.set(joborderId, []);
      }
      assignedJoborderService.get(joborderId)!.push({
        ...record.service,
      });
    });
    return assignedJoborderService;
  }
}
