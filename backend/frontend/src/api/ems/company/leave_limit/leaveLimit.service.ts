import { MySql2Database } from 'drizzle-orm/mysql2/driver';

export class DesignationService {
  private db: MySql2Database;

  constructor(db: MySql2Database) {
    this.db = db;
  }

  // Create a new Designation
  async createDesignation(data: object) {
    console.log(data);
  }

  // Get all Designations
  async getAllDesignations() {}

  // Get a Designation by ID
  async getDesignationById(paramsId: number) {
    console.log(paramsId);
  }

  // Update a Designation by ID
  async updateDesignation(paramsId: number, data: object) {
    console.log(paramsId);
    console.log(data);
  }

  // Delete a Designation by ID
  async deleteDesignation(paramsId: number): Promise<void> {
    console.log(paramsId);
  }
}
