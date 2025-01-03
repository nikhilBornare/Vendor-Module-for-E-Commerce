import mongoose, { Schema, Document } from "mongoose";

// interface for vendor document
export interface IVendor extends Document {
    name: string;
    email: string;
    website?: string;
    phone?: string;
    address: string;
    businessType: string;
    status: string;
    totalProducts?: number;
    availableDeliveryLocation?: string[];
    codAvailable: boolean;
    vendorRating?: number;
    createdAt: Date;
    updatedAt: Date;
}

// schema for vendor model
const VendorSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        website: {
            type: String,
            required: false,
            trim: true
        },
        phone: {
            type: String,
            required: false,
            unique: true
        },
        address: {
            type: String,
            required: true
        },
        businessType: {
            type: String,
            required: true,
            enum: ["Retail", "Wholesale"]
        },
        status: {
            type: String,
            required: true,
            enum: ["active", "inactive"],
            default: "active"
        },
        totalProducts: {
            type: Number,
            required: false,
            default: 0
        },
        availableDeliveryLocation: {
            type: [String],
            required: false,
            default: []
        },
        codAvailable: {
            type: Boolean,
            required: true,
            default: false
        },
        vendorRating: {
            type: Number,
            required: false,
            default: 0,
            min: 0,
            max: 5
        },
    },
    {
        timestamps: true,
    }
);

const vendorModel = mongoose.model<IVendor>("vendor", VendorSchema);

export default vendorModel;
