import express from "express";
import { createVendor, getAllVendors, getVendorById, updateVendor } from "../controllers/vendorController";


const router = express.Router();

router.post("/" , createVendor);

router.get("/", getAllVendors);

router.get("/:id", getVendorById);

router.put("/:id",updateVendor);

export default router;