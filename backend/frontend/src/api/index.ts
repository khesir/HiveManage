import express from 'express';

import swaggerDocs from '../../swagger/swaggerDocs';
import { HttpStatus } from '../../lib/config';

import emsRoute from './ems/ems.route';
import imsRoute from './inventory/inventory.route';
const baseRoute = express.Router();

// Employee Management System API
baseRoute.use('/ems', emsRoute);

// Inventory Management System API
baseRoute.use('/ims', imsRoute);

swaggerDocs(baseRoute);

baseRoute.get('/', (req, res) => {
  res.send({
    status: HttpStatus.OK.code,
    code: HttpStatus.OK.status,
    message: 'PCBEE Backend, v1.0.0 - All Systems Go',
  });
});

export default baseRoute;
