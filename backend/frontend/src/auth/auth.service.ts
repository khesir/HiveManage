import { SupabaseService } from '@/supabase/supabase.service';
import { Login } from './auth.model';

export class AuthenticationService {
  private supabaseService: SupabaseService;

  constructor() {
    this.supabaseService = SupabaseService.getInstance();
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
}
