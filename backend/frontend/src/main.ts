import express from 'express';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';

import Response from './domain/response';
import log from './util/logger'
import { HttpStatus } from './config/config';

import emsRoute from './modules/ems/ems.route';
import imsRoute from './modules/inventory/inventory.route';

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
const app = express();

app.use(cors({origin: '*'}));
app.use(express.json());

// Employee Management System API
app.use('/ems',emsRoute)

// Inventory Management System API
app.use('/ims', imsRoute)

// Put the routes here
app.get('/', (req, res) => res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Patient API, v1.0.0 - All Systems Go', [])));
app.all('*', (req, res) => res.status(HttpStatus.NOT_FOUND.code));

app.listen(PORT, () => log.info(`Server running on: ${ip.address()}:${PORT}`));