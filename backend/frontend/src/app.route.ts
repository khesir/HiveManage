import express from 'express';

import emsRoute from './ems/ems.route';
import imsRoute from './inventory/inventory.route';
import swaggerDocs from '../swagger/swaggerDocs';
import { BaseController } from './app.controller';

const baseRoute = express.Router();
const controller = new BaseController();

baseRoute.get('/', controller.TestAPI.bind(controller));

// Employee Management System API
baseRoute.use('/ems', emsRoute);

// Inventory Management System API
baseRoute.use('/ims', imsRoute);

swaggerDocs(baseRoute);

export default baseRoute;
