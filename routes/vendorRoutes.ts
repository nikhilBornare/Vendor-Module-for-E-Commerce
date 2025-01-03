import express from "express";
import { createVendor, getAllVendors, getVendorById } from "../controllers/vendorController";


const router = express.Router();

router.post("/" , createVendor);

router.get("/", getAllVendors);

router.get("/:id", getVendorById);

export default router;