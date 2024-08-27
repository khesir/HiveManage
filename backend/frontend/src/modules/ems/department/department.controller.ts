import { Request, Response as ExpressResponse } from "express";
import { Pool } from "mysql2/promise";

import { DepartmentModel } from "./department.model";
import Response from "../../../domain/response";
import { HttpStatus } from "../../../config/config";

export class DepartmentController {
    private departmentModel: DepartmentModel

    constructor(pool : Pool){
        this.departmentModel = new DepartmentModel(pool);
    }
    
    // Get all departments
    async getAllDepartments(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const departments = await this.departmentModel.getAllDepartments()
            const response = new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Departments retrieved successfully', departments);
            res.status(HttpStatus.OK.code).send(response);
        } catch (error) {
            const response = new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Failed to retrieve departments', null);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }

    // Get a department by ID
    async getDepartmentById(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const { departmentId } = req.params;
            const department = await this.departmentModel.getDepartmentById(Number(departmentId));
            if (department) {
                const response = new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Department retrieved successfully', department);
                res.status(HttpStatus.OK.code).send(response);
            } else {
                const response = new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, 'Department not found', null);
                res.status(HttpStatus.NOT_FOUND.code).send(response);
            }
        } catch (error) {
            const response = new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, 'Failed to retrieve department', null);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }
}