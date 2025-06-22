import { and, eq, isNull, sql, asc, desc } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateSalesItem, UpdateSalesItem } from './salesItem.model';
import { product } from '@/drizzle/schema/ims';
import { SchemaType } from '@/drizzle/schema/type';
import { sales, salesItems } from '@/drizzle/schema/sales';
import { employee } from '@/drizzle/schema/ems';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';
import { payment } from '@/drizzle/schema/payment';

export class SalesItemService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async createSalesItem(data: CreateSalesItem) {
    await this.db.insert(salesItems).values(data);
  }

  async getAllSalesItem(
    product_id: string | undefined,
    sales_item_status: string | undefined,
    sort: string,
    limit: number,
    offset: number,
  ) {
    const conditions = [isNull(salesItems.deleted_at)];

    if (product_id !== undefined && !isNaN(Number(product_id))) {
      conditions.push(eq(salesItems.product_id, Number(product_id)));
    }

    const totalCountQuery = await this.db
      .select({ count: sql<number>`COUNT(*)` })
      .from(salesItems)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const result = await this.db
      .select()
      .from(salesItems)
      .leftJoin(product, eq(product.product_id, salesItems.product_id))
      .leftJoin(sales, eq(sales.sales_id, salesItems.sales_id))
      .where(and(...conditions))
      .orderBy(
        sort === 'asc'
          ? asc(salesItems.created_at)
          : desc(salesItems.created_at),
      )
      .limit(limit)
      .offset(offset);

    const salesitemWithDetails = result.map((row) => ({
      ...row.sales_items,
      product: {
        ...row.product,
      },
      sales: {
        ...row.sales,
      },
    }));

    return { totalData, salesitemWithDetails };
  }

  async getSalesItemById(sales_item_id: number) {
    const result = await this.db
      .select()
      .from(salesItems)
      .leftJoin(product, eq(product.product_id, salesItems.product_id))
      .leftJoin(sales, eq(sales.sales_id, salesItems.sales_id))
      .where(eq(salesItems.sales_items_id, Number(sales_item_id)));

    const salesItemWithDetails = result.map((row) => ({
      ...row.sales_items,
      product: {
        ...row.product,
      },
      sales: {
        ...row.sales,
      },
    }));

    return salesItemWithDetails;
  }

  async updateSalesItem(data: object, paramsId: number) {
    await this.db
      .update(salesItems)
      .set({ ...data })
      .where(eq(salesItems.sales_items_id, paramsId));
  }

  async deleteSalesItem(paramsId: number): Promise<void> {
    await this.db
      .update(salesItems)
      .set({ deleted_at: new Date(Date.now()) })
      .where(eq(salesItems.sales_items_id, paramsId));
  }

  async addReturn(data: UpdateSalesItem, paramsId: number) {
    return this.db.transaction(async (tx) => {
      console.log(data);
      await tx
        .update(salesItems)
        .set({
          return_qty: data.return_qty ?? 0,
          return_note: data.return_note,
          refund_amount: data.refund_amount ?? 0,
          warranty_used: true,
          warranty_claimed_at: new Date(),
        })
        .where(eq(salesItems.sales_items_id, Number(paramsId)));
      console.log('pass2');
      await tx
        .update(product)
        .set({
          sale_quantity: sql`${product.sale_quantity} + ${data.return_qty ?? 0}`,
        })
        .where(eq(product.product_id, data.product_id));
      console.log('pass3');
      const currentSales = await tx
        .select()
        .from(sales)
        .where(eq(sales.sales_id, data.sales_id));
      console.log('pass4');
      if ((data.refund_amount ?? 0) > 0) {
        await tx.insert(payment).values({
          payment_method: 'Cash',
          payment_date: new Date().toISOString(),
          related_payment_id: currentSales[0].payment_id,
          is_refund: true,
          amount: -data.refund_amount!,
          payment_type: 'Sales',
        });
      }
      // Logging
      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user_id));

      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} processed return with sales item ${paramsId} with ${data.return_qty}`,
      });
    });
  }
  // async processRestock(data: UpdateSalesItem, paramsId: number) {
  //   return this.db.transaction(async (tx) => {
  //     await tx
  //       .update(salesItems)
  //       .set({ ...data })
  //       .where(eq(salesItems.sales_items_id, Number(paramsId)));
  //     // Logging
  //     const empData = await tx
  //       .select()
  //       .from(employee)
  //       .where(eq(employee.employee_id, data.user_id));

  //     await tx.insert(employeeLog).values({
  //       employee_id: empData[0].employee_id,
  //       performed_by: empData[0].employee_id,
  //       action: `${empData[0].firstname} ${empData[0].lastname} processed restock from return items with sales item ${paramsId} with ${data.return_qty}`,
  //     });
  //   });
  // }
}
