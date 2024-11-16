import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { CategoryController } from './category.controller';
import { validateCategoryID } from './category.middleware';
import { CreateCategory, UpdateCategory } from './category.model';

const categoryRoute = Router({ mergeParams: true });
const categoryController = new CategoryController(db);

categoryRoute.get(
  '/',
  categoryController.getAllCategory.bind(categoryController),
);

categoryRoute.get(
  '/:category_id',
  validateCategoryID,
  categoryController.getCategoryById.bind(categoryController),
);

categoryRoute.post(
  '/',
  [validateRequest({ body: CreateCategory })],
  categoryController.createCategory.bind(categoryController),
);

categoryRoute.put(
  '/:category_id',
  [validateRequest({ body: UpdateCategory }), validateCategoryID],
  categoryController.updateCategory.bind(categoryController),
);

categoryRoute.delete(
  '/:category_id',
  validateCategoryID,
  categoryController.deleteCategory.bind(categoryController),
);

export default categoryRoute;
