import { Request, Response, NextFunction } from "express";
import Vendor from "../models/vendorModel"
import { ApplicationError } from "../error-handler/applicationError";

// createVendor
export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.status(201).json({
            success: true,
            data: vendor,
            message: "Vendor created successfully.",
        });
    } catch (error: any) {
        next(new ApplicationError((error as Error).message, 400));
      }
    };  

// getAllVendors
export const getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.find();
        res.status(200).json({
            success: true,
            result: vendor.length,
            data: vendor,
        });
    } catch (error: any) {
        next(new ApplicationError((error as Error).message, 400));
      }
    };  

// Get a vendor by ID
export const getVendorById = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            res
                .status(404)
                .json({ success: false, message: "Vendor not found." });
        }
        res.status(200).json({ success: true, data: vendor });
    } catch (error) {
        next(new ApplicationError((error as Error).message, 400));
      }
    };  
// Update Vendor by ID
export const updateVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!vendor) {
            res.status(404).json({ success: false, message: "Vendor not found." });
        }
        res.status(200).json({
            success: true,
            data: vendor,
            message: "Vendor updated successfully.",
        });
    } catch (error) {
        next(new ApplicationError((error as Error).message, 400));
      }
    };  
// delete vendor by ID
export const deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!vendor) {
            res.status(404).json({ success: false, message: "Vendor not found." });
        }
        res.status(200).json({
            success: true,
            message: "Vendor deleted successfully.",
        });
    } catch (error) {
        next(new ApplicationError((error as Error).message, 500));
      }
    };