import { Request, Response, NextFunction } from "express";
import Vendor from "../models/vendorModel"

// createVendor
export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.status(201).json({
            success: true,
            data: vendor,
            message: "Vendor created successfully.",
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "An unknown error occurred." });
        }
    }
};

// getAllVendors
export const getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.find();
        res.status(200).json({
            success: true,
            result:vendor.length,
            data: vendor,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "An unknown error occurred." });
        }
    }
};