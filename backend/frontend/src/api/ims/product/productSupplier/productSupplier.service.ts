import { SchemaType } from '@/drizzle/schema/type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateProductSupplier } from './productSupplier.model';
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm';
import { productSupplier } from '@/drizzle/schema/ims/schema/product/productSupplier.schema';
import { product, supplier } from '@/drizzle/schema/ims';
import { employee } from '@/drizzle/schema/ems';
import { ProductLog } from '@/drizzle/schema/records';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';

export class ProductSupplierService {
  private db: PostgresJsDatabase<SchemaType>;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
  }

  async getAllProductSupplier(
    product_id: string | undefined,
    supplier_id: string | undefined,
    sort: string,
    limit: number,
    offset: number,
    no_pagination: boolean,
  ) {
    const conditions = [isNull(productSupplier.deleted_at)];

    if (product_id) {
      conditions.push(eq(productSupplier.product_id, Number(product_id)));
    }
    if (supplier_id) {
      conditions.push(eq(productSupplier.supplier_id, Number(supplier_id)));
    }

    const totalCountQuery = await this.db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(productSupplier)
      .where(and(...conditions));

    const totalData = totalCountQuery[0].count;

    const query = this.db
      .select()
      .from(productSupplier)
      .leftJoin(supplier, eq(supplier.supplier_id, productSupplier.supplier_id))
      .leftJoin(product, eq(product.product_id, productSupplier.product_id))
      .where(and(...conditions))
      .orderBy(
        sort == 'desc'
          ? asc(productSupplier.created_at)
          : desc(productSupplier.created_at),
      );
    if (!no_pagination) {
      query.limit(limit).offset(offset);
    }
    const result = await query;
    const productSupplierWithDetails = result.map((row) => ({
      ...row.product_supplier,
      supplier: {
        ...row.supplier,
      },
      product: {
        ...row.product,
      },
    }));

    return { totalData, productSupplierWithDetails };
  }

  // async getProductSuppplierByID(product_supplier_id: string) {
  //   return 'This fetches product supplier id';
  // }

  async createProductSupplier(data: CreateProductSupplier) {
    await this.db.transaction(async (tx) => {
      await tx.insert(productSupplier).values(data);
      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user));
      const supData = await tx
        .select()
        .from(supplier)
        .where(eq(supplier.supplier_id, data.supplier_id));
      await tx.insert(ProductLog).values({
        product_id: data.product_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} added supplier ${supData[0].name}`,
      });
      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} added supplier in product ${data.product_id}`,
      });
    });
  }

  // async updateProductSupplier(data: CreateProductSupplier, paramsId: number) {}

  async deleteProductSupplier(paramsId: number, user: number) {
    await this.db.transaction(async (tx) => {
      const pSdata = await tx
        .select()
        .from(productSupplier)
        .where(eq(productSupplier.product_supplier_id, paramsId));

      await tx
        .update(productSupplier)
        .set({ deleted_at: new Date(Date.now()) })
        .where(eq(productSupplier.product_supplier_id, paramsId));
      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, user));
      const supData = await tx
        .select()
        .from(supplier)
        .where(eq(supplier.supplier_id, pSdata[0].supplier_id!));
      await tx.insert(ProductLog).values({
        product_id: pSdata[0].product_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} removed supplier ${supData[0].name}`,
      });
      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} removed supplier in product ${pSdata[0].product_id}`,
      });
    });
  }
}
