import { Request, Response, NextFunction } from "express";
import Vendor from "../models/vendorModel";
import { ApplicationError } from "../error-handler/applicationError";
import { vendorSchema } from "../validation/vendorValidation";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const { error } = vendorSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const formattedErrors = error.details.map((detail) => ({
            field: detail.context?.key || "unknown",
            message: detail.message,
        }));
        return next(new ApplicationError("Validation failed", 400, formattedErrors));
    }
    next();
};

// Middleware for checking unique name
export const checkUniqueName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const id = req.params?.id;

        const existingVendor = await Vendor.findOne({
            name: name,
            _id: { $ne: id },
        });

        if (existingVendor) {
            return next(new ApplicationError("Name must be unique. This name is already in use.", 400));
        }
        next();
    } catch (err) {
        next(new ApplicationError("Internal server error during unique name validation", 500));
    }
};
