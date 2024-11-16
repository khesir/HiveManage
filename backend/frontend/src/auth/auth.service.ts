import { SupabaseService } from '@/supabase/supabase.service';
import { Login } from './auth.model';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { db } from '@/drizzle/pool';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { EmployeeRolesService } from '../api/ems/employeeRoles/employeeRoles.service';

export class AuthenticationService {
  private supabaseService: SupabaseService;
  private db: PostgresJsDatabase<SchemaType>;
  private employeeRolesService: EmployeeRolesService;

  constructor() {
    this.supabaseService = SupabaseService.getInstance();
    this.db = db;
    this.employeeRolesService = new EmployeeRolesService(db);
  }

  async login(data: Login) {
    return await this.supabaseService.signInSupabaseUser(data);
  }

  async logout() {
    await this.supabaseService.signOutSupabaseUser();
  }

  async getCurrentUser() {
    const user = await this.supabaseService.getCurrentUser();
    return user;
  }
  async getCurrentSession() {
    const session = await this.supabaseService.getCurrentSession();
    return session;
  }
  async getAllUser(
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
    const data = await this.employeeRolesService.getAllEmployeeAccount(
      sort,
      limit,
      offset,
      status,
      role_id,
      employee_id,
      user_id,
      fullname,
      position_id,
    );
    return data;
  }
}
