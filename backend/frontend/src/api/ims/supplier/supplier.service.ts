import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { eq, isNull, and } from 'drizzle-orm';
import { SchemaType } from '@/drizzle/schema/type';
import { supplier } from '@/drizzle/schema/ims';
import { CreateSupplier, UpdateSupplier } from './supplier.model';
import { SupabaseService } from '@/supabase/supabase.service';
import { employee } from '@/drizzle/schema/ems';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';

export class SupplierService {
  private db: PostgresJsDatabase<SchemaType>;
  private supabaseService: SupabaseService;

  constructor(db: PostgresJsDatabase<SchemaType>) {
    this.db = db;
    this.supabaseService = SupabaseService.getInstance();
  }

  async createSupplier(
    data: CreateSupplier,
    file: Express.Multer.File | undefined,
  ) {
    await this.db.transaction(async (tx) => {
      let filepath = undefined;
      if (file) {
        filepath = await this.supabaseService.uploadImageToBucket(file);
      }
      const [newSupplier] = await tx
        .insert(supplier)
        .values({
          ...data,
          profile_link: filepath,
        })
        .returning({ suppler_id: supplier.supplier_id });

      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user));
      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} created supplier ${newSupplier.suppler_id}`,
      });
    });
  }

  async getAllSupplier(profile: string | undefined) {
    if (profile) {
      const result = await this.db
        .select()
        .from(supplier)
        .where(
          and(eq(supplier.profile_link, profile), isNull(supplier.deleted_at)),
        );
      return result;
    } else {
      const result = await this.db
        .select()
        .from(supplier)
        .where(isNull(supplier.deleted_at));
      return result;
    }
  }

  async getSupplierById(paramsId: number) {
    const result = await this.db
      .select()
      .from(supplier)
      .where(eq(supplier.supplier_id, paramsId));
    return result[0];
  }

  async updateSupplier(
    data: UpdateSupplier,
    paramsId: number,
    file: Express.Multer.File | undefined,
  ) {
    await this.db.transaction(async (tx) => {
      if (file) {
        const filepath = await this.supabaseService.uploadImageToBucket(file);
        await tx
          .update(supplier)
          .set({
            ...data,
            profile_link: filepath,
          })
          .where(eq(supplier.supplier_id, paramsId));
      } else {
        await tx
          .update(supplier)
          .set({
            ...data,
          })
          .where(eq(supplier.supplier_id, paramsId));
      }
      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, data.user));
      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} update supplier ${paramsId}`,
      });
    });
  }

  async deleteSupplier(paramsId: number, user: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(supplier)
        .set({ deleted_at: new Date(Date.now()) })
        .where(eq(supplier.supplier_id, paramsId));
      const empData = await tx
        .select()
        .from(employee)
        .where(eq(employee.employee_id, user));
      await tx.insert(employeeLog).values({
        employee_id: empData[0].employee_id,
        performed_by: empData[0].employee_id,
        action: `${empData[0].firstname} ${empData[0].lastname} update supplier ${paramsId}`,
      });
    });
  }
}
