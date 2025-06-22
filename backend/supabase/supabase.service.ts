import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Login } from '../src/auth/auth.model';
import { generateUniqueFileName } from '@/lib/datefns';

export class SupabaseService {
  private static instance: SupabaseService;
  private supabase: SupabaseClient;

  constructor() {
    const supabaseURL = process.env.SUPABASE_URL || '';
    const supabaseAPIkey = process.env.SUPABASE_KEY || '';
    if (!supabaseURL || !supabaseAPIkey) {
      throw new Error('Supabase URL and API key must be provided');
    }
    this.supabase = createClient(supabaseURL, supabaseAPIkey);
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public getSupabase() {
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

  public async getUserFromToken(token: string) {
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new Error('Invalid or expired token');
    }
    return data.user;
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
    return {
      success: true,
      data,
    };
  }

  async signOutSupabaseUser() {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      throw Error('Failed to sign out');
    }

    return {
      success: true,
      message: 'Successfully signed out',
    };
  }

  async createSupabaseUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(`Supabase signup failed: ${error.message}`);
    }

    return {
      success: true,
      data,
    };
  }
  async uploadImageToBucket(file: Express.Multer.File) {
    const uniqueFilename = generateUniqueFileName(file.originalname);
    const bucketname = process.env.PROFILE_BUCKET;

    if (!bucketname) {
      throw new Error(
        'Image Bucket Name is not set in the env variables(PROFILE_BUCKET)',
      );
    }

    const { error } = await this.supabase.storage
      .from(bucketname)
      .upload(uniqueFilename, file.buffer, {
        contentType: file.mimetype,
      });

    const getUrl = await this.supabase.storage
      .from(bucketname)
      .getPublicUrl(uniqueFilename);

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    return getUrl.data.publicUrl;
  }
}
