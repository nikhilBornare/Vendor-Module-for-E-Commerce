import express from "express";
import { createMultipleVendors, createVendor, deleteMultipleVendors, deleteVendor, getAllVendors, getVendorById, updateMultipleVendors, updateVendor } from "../controllers/vendorController";


const router = express.Router();

// Route to create vendor
router.post("/" , createVendor);

// Route to create multiple vendors
router.post("/bulk",createMultipleVendors);

// Route to get all vendors
router.get("/", getAllVendors);

// Route to get a single vendor by ID
router.get("/:id", getVendorById);

// Route to update a vendor by ID
router.put("/:id",updateVendor);

// Route to update multiple Vendors 
router.put("/bulk/", updateMultipleVendors);

// Route to delete a vendor by ID
router.delete("/:id", deleteVendor);

// Route to delete multiple vendors by ID
router.delete("/",deleteMultipleVendors);

export default router;