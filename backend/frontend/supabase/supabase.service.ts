import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Login } from '../src/api/auth/auth.model';

export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseURL = process.env.SUPABASE_URL || '';
    const supabaseAPIkey = process.env.SUPABASE_KEY || '';
    if (!supabaseURL || !supabaseAPIkey) {
      throw new Error('Supabase URL and API key must be provided');
    }
    this.supabase = createClient(supabaseURL, supabaseAPIkey);
  }

  getSupabase() {
    return this.supabase;
  }
  async getCurrentUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user) {
      throw new Error('Invalid Credentials');
    }
    return user;
  }

  async getCurrentSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      throw new Error('Invalid Credentials');
    }
    return data;
  }

  async signInSupabaseUser(logindata: Login) {
    const { email, password } = logindata;
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error('Invalid email or password');
    }
    return data;
  }

  async signOutSupabaseUser() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw Error('Failed to sign out');
    }
  }

  async createSupabaseUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(`Supabase signup failed: ${error.message}`);
    }

    return data;
  }
}
