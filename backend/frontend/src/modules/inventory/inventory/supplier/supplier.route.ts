import { Router } from "express";
import { SupplierController } from "./supplier.controller";
import pool from "../../../../config/mysql.config";

const supplierRoute = Router({mergeParams:true})
const supplierController = new SupplierController(pool)

supplierRoute.get('/', supplierController.getAllSupplier.bind(supplierController));
supplierRoute.get('/:id', supplierController.getSupplierById.bind(supplierController));

export default supplierRoute