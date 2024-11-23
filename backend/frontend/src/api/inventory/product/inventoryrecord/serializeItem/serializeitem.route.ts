import { Router } from 'express';
import { SerializeItemController } from './serializeitem.controller';
import { db } from '@/drizzle/pool';

const serialItemRoute = Router({ mergeParams: true });
const serialItemController = new SerializeItemController(db);

serialItemRoute.get(
  '/',
  serialItemController.getAllSerializeItem.bind(serialItemController),
);
serialItemRoute.get('/:serial_id');
serialItemRoute.post('/:serial_id');
serialItemRoute.put('/:serial_id');
serialItemRoute.delete('/:serial_id');
