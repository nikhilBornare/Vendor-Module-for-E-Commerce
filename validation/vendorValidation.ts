import Joi from "joi";

// Define validation schema for a single vendor
const singleVendorSchema = Joi.object({
    name: Joi.string()
        .trim()
        .pattern(/^[A-Za-z0-9\s]*$/)
        .required()
        .messages({
            "string.empty": "Name is required.",
            "string.pattern.base": "Special characters are not allowed in the name.",
        }),

    email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Email must be a valid email address.",
    }),

    website: Joi.string().uri().optional().messages({
        "string.uri": "Website must be a valid URL.",
    }),

    phone: Joi.string()
        .pattern(/^\d+$/)
        .optional()
        .messages({
            "string.pattern.base": "Phone number must contain only digits.",
        }),

    address: Joi.string().required().messages({
        "string.empty": "Address is required.",
    }),

    businessType: Joi.string()
        .valid("Retail", "Wholesale")
        .required()
        .messages({
            "any.only": "Business type must be either 'Retail' or 'Wholesale'.",
            "string.empty": "Business type is required.",
        }),

    status: Joi.string()
        .valid("active", "inactive")
        .required()
        .messages({
            "any.only": "Status must be either 'active' or 'inactive'.",
            "string.empty": "Status is required.",
        }),

    totalProducts: Joi.number().integer().min(0).optional().messages({
        "number.base": "Total products must be a non-negative integer.",
        "number.min": "Total products cannot be negative.",
    }),

    availableDeliveryLocation: Joi.array().items(Joi.string().trim()).optional().messages({
        "array.base": "Available delivery locations must be an array of strings.",
    }),

    codAvailable: Joi.boolean().required().messages({
        "boolean.base": "COD availability must be true or false.",
        "any.required": "COD availability is required.",
    }),

    vendorRating: Joi.number()
        .min(0)
        .max(5)
        .optional()
        .messages({
            "number.base": "Vendor rating must be a number between 0 and 5.",
            "number.min": "Vendor rating cannot be less than 0.",
            "number.max": "Vendor rating cannot be more than 5.",
        }),
});

// Define validation schema for an array of vendors
export const vendorSchema = Joi.alternatives().try(
    singleVendorSchema,
    Joi.array().items(singleVendorSchema)
);

