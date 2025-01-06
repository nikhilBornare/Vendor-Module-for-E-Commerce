import { Request, Response, NextFunction } from "express";
import Vendor from "../models/vendorModel";
import { ApplicationError } from "../error-handler/applicationError";
import { vendorSchema } from "../validation/vendorValidation";

// validation middleware
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

// Middleware for checking unique name, email, and phone
export const checkUniqueFields = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone } = req.body;
        const id = req.params?.id;

        const existingVendor = await Vendor.findOne({
            $or: [{ name }, { email }, { phone }],
            _id: { $ne: id },
        });

        const errors: object[] = [];

        if (existingVendor) {
            if (existingVendor.name === name) {
                errors.push({ field: "name", message: "Name must be unique. This name is already in use." });
            }
            if (existingVendor.email === email) {
                errors.push({ field: "email", message: "Email already exists." });
            }
            if (existingVendor.phone === phone) {
                errors.push({ field: "phone", message: "Phone number already exists." });
            }
        }

        if (errors.length > 0) {
            return next(new ApplicationError("Duplicate field error", 400, errors));
        }

        next();
    } catch (err) {
        next(new ApplicationError("Internal server error during unique validation", 500));
    }
};
