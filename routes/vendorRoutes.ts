import express from "express";
import { createVendor, deleteVendor, getAllVendors, getVendorById, updateVendor } from "../controllers/vendorController";


const router = express.Router();

// Route to create vendor
router.post("/" , createVendor);

// Route to get all vendors
router.get("/", getAllVendors);

// Route to get a single vendor by ID
router.get("/:id", getVendorById);

// Route to update a vendor by ID
router.put("/:id",updateVendor);

// Route to delete a vendor by ID
router.delete("/:id", deleteVendor);

export default router;