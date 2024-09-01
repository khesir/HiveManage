import { Request, Response as ExpressResponse } from 'express';
import { Pool } from 'mysql2/promise';

import { HttpStatus } from '../../../config/config';
import Response from '../../../lib/response';
import { ItemModel } from './inventory.query';

export class ItemController {
  private itemModel: ItemModel;

  constructor(pool: Pool) {
    this.itemModel = new ItemModel(pool);
  }

  async createItem(req: Request, res: ExpressResponse): Promise<void> {
    try {
      const { name, description, quantity, type, item_condition } = req.body;
      const item = { name, description, quantity, type, item_condition };
      await this.itemModel.create(item);
      const response = new Response(
        HttpStatus.CREATED.code,
        HttpStatus.CREATED.status,
        'Item created successfully',
        null,
      );
      res.status(HttpStatus.CREATED.code).send(response);
    } catch (error) {
      const response = new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        'Failed to create item',
        { error: error },
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
    }
  }

  async getAllItem(req: Request, res: ExpressResponse): Promise<void> {
    try {
      const items = await this.itemModel.findAllItem();
      const response = new Response(
        HttpStatus.OK.code,
        HttpStatus.OK.status,
        'Item retrieved successfully',
        items,
      );
      res.status(HttpStatus.OK.code).send(response);
    } catch (error) {
      const response = new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        'Failed to retrieve items',
        { error: error },
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
    }
  }

  async getItemById(req: Request, res: ExpressResponse): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const item = await this.itemModel.findItemById(id);
      if (item) {
        const response = new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          'Item retrieved successfully',
          item,
        );
        res.status(HttpStatus.OK.code).send(response);
      } else {
        const response = new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.status,
          'Item not found',
          null,
        );
        res.status(HttpStatus.NOT_FOUND.code).send(response);
      }
    } catch (error) {
      const response = new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        'Failed to retrieve item',
        { error: error },
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
    }
  }

  async updateItem(req: Request, res: ExpressResponse): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, description, quantity, type, item_condition } = req.body;
      const item = { name, description, quantity, type, item_condition };
      await this.itemModel.updateItemById(id, item);
      const response = new Response(
        HttpStatus.OK.code,
        HttpStatus.OK.status,
        'Item updated successfully',
        null,
      );
      res.status(HttpStatus.OK.code).send(response);
    } catch (error) {
      const response = new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        'Failed to update item',
        { error: error },
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
    }
  }

  async deleteItem(req: Request, res: ExpressResponse): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await this.itemModel.deleteItemById(id);
      const response = new Response(
        HttpStatus.OK.code,
        HttpStatus.OK.status,
        'Item deleted successfully',
        null,
      );
      res.status(HttpStatus.OK.code).send(response);
    } catch (error) {
      const response = new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        'Failed to delete item',
        { error: error },
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
    }
  }
}
