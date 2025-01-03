import express from "express";
import mongoose from "mongoose";
import {
  createMultipleVendors,
  createVendor,
  deleteMultipleVendors,
  deleteVendor,
  getAllVendors,
  getVendorById,
  updateMultipleVendors,
  updateVendor,
} from "../controllers/vendorController";

const router = express.Router();

// Middleware to check for valid ObjectId
const validateObjectId = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void => {
    const ids = req.params.id ? [req.params.id] : req.body.ids;

    if (ids && !ids.every((id: string) => mongoose.Types.ObjectId.isValid(id))) {
         res.status(400).json({
            success: false,
            message: "One or more IDs are invalid.",
        });
    }

    // Call next() to pass control to the next middleware or route handler
    next();
};


// Route to create multiple vendors
router.post("/bulk", createMultipleVendors);

// Route to update multiple vendors
router.put("/bulk", updateMultipleVendors);

// Route to delete multiple vendors by ID
router.delete("/", deleteMultipleVendors);

// Generic routes come after specific routes
// Route to create a vendor
router.post("/", createVendor);

// Route to get all vendors
router.get("/", getAllVendors);

// Route to get a single vendor by ID
router.get("/:id" , validateObjectId,getVendorById);

// Route to update a vendor by ID
router.put("/:id", updateVendor);

// Route to delete a vendor by ID
router.delete("/:id", deleteVendor);

export default router;
