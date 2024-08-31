import { Request, Response as ExpressResponse } from "express";
import { Pool } from "mysql2/promise";

import Response from "../../../../domain/response";
import { HttpStatus } from "../../../../config/config";
import { TagItemsModel } from "./tag_items.model";

export class TagItemController {

    private tagitemModel : TagItemsModel;

    constructor(pool : Pool) {
        this.tagitemModel = new TagItemsModel(pool);
    }

    async getAllTagItems(req: Request, res: ExpressResponse) : Promise<void> {
        try {
            const tagitem = await this.tagitemModel.getAllTagItems()
            const response = new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.status,
                'Tag item retrieved successfully',
                tagitem
            );
            res.status(HttpStatus.OK.code).send(response);
        } catch (error) {
            const response = new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.status,
                'Failed to retrieve tag items',
                null
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }

    async getTagItemsById(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const { item_id } = req.params;
            const tagitems = await this.tagitemModel.getTagItemByItemId(Number(item_id));
            if( tagitems ) {
                const response = new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.status,
                    'Tag item retrieved successfully',
                    tagitems
                );
                res.status(HttpStatus.OK.code).send(response);
            } else {
                const response = new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.status,
                    'Tag items not found',
                    null
                );
                res.status(HttpStatus.NOT_FOUND.code).send(response);
            }
        } catch (error) {
            const response = new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.status,
                'Failed to  retrieved tag items',
                null
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }

    async getTagItemsBySupplierId(req: Request, res: ExpressResponse): Promise<void> {
        try {
            const { supplier_id } = req.params;
            const suppitems = await this.tagitemModel.getTagItemBySupplierId(Number(supplier_id));
            if( suppitems ) {
                const response = new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.status,
                    'Supplier Item retrieved successfully',
                    suppitems
                );
                res.status(HttpStatus.OK.code).send(response);
            } else {
                const response = new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.status,
                    'Supplier info not found',
                    null
                )
                res.status(HttpStatus.NOT_FOUND.code).send(response);
            }
        } catch (error) {
            const response = new Response(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                HttpStatus.INTERNAL_SERVER_ERROR.status,
                'Failed to retrieve supplier info',
                null
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
        }
    }
}