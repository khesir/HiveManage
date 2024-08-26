import express from 'express';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';

import Response from './domain/response';
import log from './util/logger'
import { HttpStatus } from './config/config';
import employeeRoute from './modules/employee/employee/employee.route';

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
const app = express();

app.use(cors({origin: '*'}));
app.use(express.json());

// 
app.use('/employee',employeeRoute)

// Put the routes here
app.get('/', (req, res) => res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Patient API, v1.0.0 - All Systems Go', [])));
app.all('*', (req, res) => res.status(HttpStatus.NOT_FOUND.code));

app.listen(PORT, () => log.info(`Server running on: ${ip.address()}:${PORT}`));