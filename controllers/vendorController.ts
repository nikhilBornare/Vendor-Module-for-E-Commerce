import { Request, Response, NextFunction } from "express";
import Vendor from "../models/vendorModel"
import { ApplicationError } from "../error-handler/applicationError";
import getFilteredSortedPaginatedVendors from "../utils/features";
import logger from "../utils/logger";

// createVendor
export const createVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor = await Vendor.create(req.body);
    logger.info(`Vendor created: ${vendor.name}`);
    res.status(201).json({
      success: true,
      data: vendor,
      message: "Vendor created successfully.",
    });
  } catch (error: any) {
    logger.error(`Error creating vendor: ${error.message}`);
    next(new ApplicationError((error as Error).message, 400));
  }
};

// createMultipleVendors
export const createMultipleVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendors = req.body;
    if (!Array.isArray(vendors) || vendors.length === 0) {
      return next(new ApplicationError("Invalid or empty array of vendors provided.", 400));
    }

    const success = [];
    const failed = [];

    for (const vendor of vendors) {
      try {
        const newVendor = await Vendor.create(vendor);
        success.push({ id: newVendor._id, name: newVendor.name, message: "Created successfully" });
      } catch (err) {
        failed.push({ vendor, message: (err as Error).message });
      }
    }

    res.status(201).json({
      success: true,
      results: {
        created: success.length,
        failed: failed.length,
        details: {
          success,
          failed,
        },
      },
    });
  } catch (error) {
    next(new ApplicationError((error as Error).message, 500));
  }
};

// getAllVendors
export const getAllVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryFeatures = {
      search: req.query.search as string,
      rating: req.query.rating as string,
      status: req.query.status as "active" | "inactive",
      sort: req.query.sort as
        | "name"
        | "createdAtAsc"
        | "updatedAtAsc"
        | "createdAtDesc"
        | "updatedAtDesc"
        | "status"
        | "statusDesc",
      page: parseInt(req.query.page as string, 10),
      limit: parseInt(req.query.limit as string, 10),
    };

    const { vendors, total, page, limit } = await getFilteredSortedPaginatedVendors(queryFeatures);
    logger.info(`Fetched ${vendors.length} vendors from the database (Total: ${total})`);
    res.status(200).json({
      success: true,
      data: vendors,
      total,
      page,
      limit,
    });
  } catch (error) {
    logger.error(`Error fetching vendors: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 500));
  }
};

// Get a vendor by ID
export const getVendorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      res
        .status(404)
        .json({ success: false, message: "Vendor not found." });
    }
    logger.info(`Vendor with ID ${req.params.id} retrieved successfully`);
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    logger.error(`Error retrieving vendor with ID ${req.params.id}: ${(error as Error).message}`);
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
    logger.info(`Vendor with ID ${req.params.id} updated successfully`);
    res.status(200).json({
      success: true,
      data: vendor,
      message: "Vendor updated successfully.",
    });
  } catch (error) {
    logger.error(`Error updating vendor with ID ${req.params.id}: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 400));
  }
};

// updateMultipleVendors
export const updateMultipleVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
      return next(new ApplicationError("Invalid or empty array of updates provided.", 400));
    }

    const success = [];
    const failed = [];

    for (const { id, updateData } of updates) {
      try {
        const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
        if (updatedVendor) {
          success.push({ id, name: updatedVendor.name, message: "Updated successfully" });
        } else {
          failed.push({ id, message: "Vendor not found" });
        }
      } catch (err) {
        failed.push({ id, message: (err as Error).message });
      }
    }
    logger.info(`Multiple vendor updates: ${success.length} succeeded, ${failed.length} failed`);
    res.status(200).json({
      success: true,
      results: {
        updated: success.length,
        failed: failed.length,
        details: {
          success,
          failed,
        },
      },
    });
  } catch (error) {
    logger.error(`Error updating multiple vendors: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 500));
  }
};


// delete vendor by ID
export const deleteVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      res.status(404).json({ success: false, message: "Vendor not found." });
    }
    logger.info(`Vendor with ID ${req.params.id} deleted successfully`);
    res.status(200).json({
      success: true,
      message: "Vendor deleted successfully.",
    });
  } catch (error) {
    logger.error(`Error deleting vendor with ID ${req.params.id}: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 500));
  }
};

// deleteMultipleVendors
export const deleteMultipleVendors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new ApplicationError("Invalid IDs provided.", 400));
    }

    const success = [];
    const failed = [];

    for (const id of ids) {
      try {
        const vendor = await Vendor.findByIdAndDelete(id);
        if (vendor) {
          success.push({ id, message: "Deleted successfully" });
        } else {
          failed.push({ id, message: "Vendor not found" });
        }
      } catch (err) {
        failed.push({ id, message: "Invalid ID format or error during deletion" });
      }
    }

    res.status(200).json({
      success: true,
      results: {
        deleted: success.length,
        failed: failed.length,
        details: {
          success,
          failed,
        },
      },
    });
  } catch (error) {
    logger.error(`Error deleting multiple vendors: ${(error as Error).message}`);
    next(new ApplicationError((error as Error).message, 500));
  }
};