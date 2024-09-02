import { Router } from 'express';
import pool from '../../../../drizzle.config';

import { ItemController } from './inventory.controller';
import supplierRoute from './supplier/supplier.route';
import tagitemRoute from './tag_items/tag_items.route';

const itemRoute = Router({ mergeParams: true });
const itemController = new ItemController(pool);

itemRoute.post('/', itemController.createItem.bind(itemController));
itemRoute.get('/', itemController.getAllItem.bind(itemController));
itemRoute.get('/:id', itemController.getItemById.bind(itemController));
itemRoute.put('/:id', itemController.updateItem.bind(itemController));
itemRoute.delete('/:id', itemController.deleteItem.bind(itemController));

itemRoute.use('/supplier', supplierRoute);
itemRoute.use('/tag-items', tagitemRoute);

export default itemRoute;
