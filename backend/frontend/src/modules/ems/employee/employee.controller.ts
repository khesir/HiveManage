import { Request, Response as ExpressResponse} from 'express';
import { Pool } from 'mysql2/promise';

import { EmployeeModel } from './employee.model';
import { HttpStatus } from '../../../config/config';
import Response from '../../../domain/response';
export class EmployeeController {
    private employeeModel: EmployeeModel;

    constructor(pool : Pool) {
        this.employeeModel = new EmployeeModel(pool);
    }

    async createEmployee(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const { uuid, firstname, middlename, lastname, status } = req.body;
            const employee = { uuid, firstname, middlename, lastname, status };
            await this.employeeModel.create(employee);
            const response = new Response(
                HttpStatus.CREATED.code,
                HttpStatus.CREATED.status,
                'Employee created successfully',
                null
            );
            res.status(HttpStatus.CREATED.code).send(response);
        } catch (error: any) {
            const response = new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.status,
                'Failed to create employee',
                { error: error.message }
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }

    async getAllEmployees(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const employees = await this.employeeModel.findAll();
            const response = new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                'Employees retrieved successfully',
                employees
            );
            res.status(HttpStatus.OK.code).send(response);
        } catch (error: any) {
            const response = new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.status,
                'Failed to retrieve employees',
                { error: error.message }
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }

    async getEmployeeById(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const employee = await this.employeeModel.findById(id);
            if (employee) {
                const response = new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.status,
                    'Employee retrieved successfully',
                    employee
                );
                res.status(HttpStatus.OK.code).send(response);
            } else {
                const response = new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.status,
                    'Employee not found',
                    null
                );
                res.status(HttpStatus.NOT_FOUND.code).send(response);
            }
        } catch (error: any) {
            const response = new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.status,
                'Failed to retrieve employee',
                { error: error.message }
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }

    async updateEmployee(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const { uuid, firstname, middlename, lastname, status } = req.body;
            const employee = { uuid, firstname, middlename, lastname, status };
            await this.employeeModel.updateById(id, employee);
            const response = new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                'Employee updated successfully',
                null
            );
            res.status(HttpStatus.OK.code).send(response);
        } catch (error: any) {
            const response = new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.status,
                'Failed to update employee',
                { error: error.message }
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }

    async deleteEmployee(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            await this.employeeModel.deleteById(id);
            const response = new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                'Employee deleted successfully',
                null
            );
            res.status(HttpStatus.OK.code).send(response);
        } catch (error: any) {
            const response = new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.status,
                'Failed to delete employee',
                { error: error.message }
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }
}
