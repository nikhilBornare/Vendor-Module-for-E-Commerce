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
            result: vendor.length,
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

// Get a vendor by ID
export const getVendorById = async (req: Request, res: Response) => {
    try {
        const brand = await Vendor.findById(req.params.id);
        if (!brand) {
            res
                .status(404)
                .json({ success: false, message: "Vendor not found." });
        }
        res.status(200).json({ success: true, data: brand });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "An unknown error occurred." });
        }
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "An unknown error occurred." });
        }
    }
};