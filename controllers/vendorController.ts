import { Request,Response,NextFunction } from "express";
import Vendor from "../models/vendorModel"
 
 export const createVendor = async (req:Request , res:Response , next: NextFunction) => {
    try {
        const vendor = await Vendor.create(req.body) 
    } catch (error) {
        
    }
 }