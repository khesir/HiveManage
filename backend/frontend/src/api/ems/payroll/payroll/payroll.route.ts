import { Router } from 'express';
import { PayrollController } from './payroll.controller';

import { db } from '../../../../../mysql/mysql.pool';

const payrollRoute = Router({ mergeParams: true });
const payrollController = new PayrollController(db);

payrollRoute.post('/', payrollController.createPayRoll.bind(payrollController));

export default payrollRoute;
