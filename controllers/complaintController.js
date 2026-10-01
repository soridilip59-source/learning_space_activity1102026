import { complaints } from "../data/complaints.js";

const allowedStatuses = [
    "Pending",
    "In Progress",
    "Resolved"
];

const allowedPriorities = [
    "Low",
    "Medium",
    "High",
    "Critical"
];

const allowedCategories = [
    "Internet",
    "Laptop",
    "Classroom",
    "Electricity",
    "Facilities",
    "Account"
];

function createId() {
    return `CC-${Math.floor(1000 + Math.random() * 9000)}`;
}

function validateComplaint(body) {
    const errors = [];

    if (!body.studentName || body.studentName.trim().length < 2) {
        errors.push(
            "studentName is required and must contain at least 2 characters"
        );
    }

    if (!body.title || body.title.trim().length < 5) {
        errors.push(
            "title is required and must contain at least 5 characters"
        );
    }

    if (!body.description || body.description.trim().length < 10) {
        errors.push(
            "description is required and must contain at least 10 characters"
        );
    }

    if (!allowedCategories.includes(body.category)) {
        errors.push(
            `category must be one of: ${allowedCategories.join(", ")}`
        );
    }

    if (!allowedPriorities.includes(body.priority)) {
        errors.push(
            `priority must be one of: ${allowedPriorities.join(", ")}`
        );
    }

    return errors;
}


// GET ALL COMPLAINTS
export const getComplaints = (req, res) => {

    const { status, category, priority, search } = req.query;

    let result = [...complaints];

    if (status) {
        result = result.filter(
            (item) => item.status === status
        );
    }

    if (category) {
        result = result.filter(
            (item) => item.category === category
        );
    }

    if (priority) {
        result = result.filter(
            (item) => item.priority === priority
        );
    }

    if (search) {

        const query = search.toLowerCase();

        result = result.filter(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                item.studentName.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query)
        );
    }

    res.json({
        success: true,
        count: result.length,
        data: result
    });
};


// GET SINGLE COMPLAINT
export const getComplaintById = (req, res) => {

    const complaint = complaints.find(
        (item) => item.id === req.params.id
    );

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found"
        });
    }

    res.json({
        success: true,
        data: complaint
    });
};


// CREATE COMPLAINT
export const createComplaint = (req, res) => {

    const errors = validateComplaint(req.body);

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors
        });
    }

    const complaint = {
        id: createId(),
        studentName: req.body.studentName.trim(),
        studentId: req.body.studentId?.trim() || "NOT-PROVIDED",
        category: req.body.category,
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        priority: req.body.priority,
        status: "Pending",
        location: req.body.location?.trim() || "Not provided",
        createdAt: new Date().toISOString()
    };

    complaints.unshift(complaint);

    res.status(201).json({
        success: true,
        message: "Complaint created successfully",
        data: complaint
    });
};


// UPDATE STATUS
export const updateComplaintStatus = (req, res) => {

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Use: ${allowedStatuses.join(", ")}`
        });
    }

    const index = complaints.findIndex(
        (item) => item.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found"
        });
    }

    complaints[index].status = status;

    res.json({
        success: true,
        message: "Complaint status updated",
        data: complaints[index]
    });
};


// DELETE COMPLAINT
export const deleteComplaint = (req, res) => {

    const index = complaints.findIndex(
        (item) => item.id === req.params.id
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Complaint not found"
        });
    }

    const deletedComplaint = complaints.splice(index, 1)[0];

    res.json({
        success: true,
        message: "Complaint deleted",
        data: deletedComplaint
    });
};