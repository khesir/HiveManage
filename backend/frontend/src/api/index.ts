/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';

import { HttpStatus } from '@/lib/config';

import emsRoute from './ems/index';
import imsRoute from './inventory/inventory.route';

import log from '@/lib/logger';
import srmsRoute from './serviceses/service.route';
import jomsRoute from './jo/jo.route';
import cmsRoute from './cms/cms.route';
import smsRoute from './sales/sales.route';

const baseRoute = express.Router({ mergeParams: true });

// Employee Management System API
baseRoute.use('/ems', emsRoute);
log.info('ROUTE /ems route set');

// // Inventory Management System API
// baseRoute.use('/ims', imsRoute);
// log.info('ROUTE /ims route set');

// // Sales Management System API
// baseRoute.use('/sms', smsRoute);
// log.info('ROUTE /sms route set');

// // Service Management System API
// baseRoute.use('/srms', srmsRoute);
// log.info('ROUTE /srms');

// // Job Order Management System API
// baseRoute.use('/joms', jomsRoute);
// log.info('ROUTE /joms route set');

// // Customer Management System API
// baseRoute.use('/cms', cmsRoute);
// log.info('ROUTE /cms set');

baseRoute.get('/', (req, res) => {
  res.send({
    status: HttpStatus.OK.code,
    code: HttpStatus.OK.status,
    message: 'PCBEE Backend, v1.0.0 - All Systems Go',
  });
});

export default baseRoute;
