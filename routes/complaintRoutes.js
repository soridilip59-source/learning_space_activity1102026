import express from "express";

import {
    getComplaints,
    getComplaintById,
    createComplaint,
    updateComplaintStatus,
    deleteComplaint
} from "../controllers/complaintController.js";

const router = express.Router();


// GET all complaints
router.get("/", getComplaints);


// GET single complaint
router.get("/:id", getComplaintById);


// CREATE complaint
router.post("/", createComplaint);


// UPDATE complaint status
router.put("/:id/status", updateComplaintStatus);


// DELETE complaint
router.delete("/:id", deleteComplaint);

export default router;