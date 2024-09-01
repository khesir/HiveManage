import { Router } from 'express';
import { DesignationController } from './designation.controller';
import pool from '../../../config/mysql.config';

const designationRoute = Router({ mergeParams: true });
const designationController = new DesignationController(pool);

designationRoute.get(
  '/',
  designationController.getAllDesignation.bind(designationController),
);
designationRoute.get(
  '/:id',
  designationController.getDepartmentById.bind(designationController),
);

export default designationRoute;
