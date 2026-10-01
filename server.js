import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let complaints = [
    {
        id: "CC-1001",
        studentName: "Aman",
        studentId: "ST-101",
        category: "Internet",
        title: "Wi-Fi not working in Lab 2",
        description: "No internet connection on three machines.",
        priority: "High",
        status: "Pending",
        location: "Lab 2",
        createdAt: "2026-09-28T09:20:00.000Z"
    },
    {
        id: "CC-1002",
        studentName: "Priya",
        studentId: "ST-102",
        category: "Laptop",
        title: "Laptop not charging",
        description: "Charging indicator is not turning on.",
        priority: "Critical",
        status: "In Progress",
        location: "Lab 1",
        createdAt: "2026-09-28T10:15:00.000Z"
    },
    {
        id: "CC-1003",
        studentName: "Ravi",
        studentId: "ST-103",
        category: "Classroom",
        title: "Projector not displaying",
        description: "Projector powers on but shows no image.",
        priority: "Medium",
        status: "Resolved",
        location: "Room 204",
        createdAt: "2026-09-27T14:05:00.000Z"
    },
    {
        id: "CC-1004",
        studentName: "Neha",
        studentId: "ST-104",
        category: "Electricity",
        title: "Charging point damaged",
        description: "The socket near the last row is loose.",
        priority: "High",
        status: "Pending",
        location: "Study Hall",
        createdAt: "2026-09-26T11:30:00.000Z"
    }
];

const allowedStatuses = ["Pending", "In Progress", "Resolved"];
const allowedPriorities = ["Low", "Medium", "High", "Critical"];
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
        errors.push("studentName is required and must contain at least 2 characters");
    }

    if (!body.title || body.title.trim().length < 5) {
        errors.push("title is required and must contain at least 5 characters");
    }

    if (!body.description || body.description.trim().length < 10) {
        errors.push("description is required and must contain at least 10 characters");
    }

    if (!allowedCategories.includes(body.category)) {
        errors.push(`category must be one of: ${allowedCategories.join(", ")}`);
    }

    if (!allowedPriorities.includes(body.priority)) {
        errors.push(`priority must be one of: ${allowedPriorities.join(", ")}`);
    }

    return errors;
}

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CampusConnect API is running",
        version: "1.0.0",
        endpoints: [
            "GET /api/health",
            "GET /api/complaints",
            "GET /api/complaints/:id",
            "POST /api/complaints",
            "PUT /api/complaints/:id/status",
            "DELETE /api/complaints/:id"
        ]
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        service: "CampusConnect API",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/complaints", (req, res) => {
    const { status, category, priority, search } = req.query;

    let result = [...complaints];

    if (status) {
        result = result.filter((item) => item.status === status);
    }

    if (category) {
        result = result.filter((item) => item.category === category);
    }

    if (priority) {
        result = result.filter((item) => item.priority === priority);
    }

    if (search) {
        const query = search.toLowerCase();

        result = result.filter((item) =>
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
});

app.get("/api/complaints/:id", (req, res) => {
    const complaint = complaints.find((item) => item.id === req.params.id);

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
});

app.post("/api/complaints", (req, res) => {
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
});

app.put("/api/complaints/:id/status", (req, res) => {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Invalid status. Use: ${allowedStatuses.join(", ")}`
        });
    }

    const index = complaints.findIndex((item) => item.id === req.params.id);

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
});

app.delete("/api/complaints/:id", (req, res) => {
    const index = complaints.findIndex((item) => item.id === req.params.id);

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
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

app.use((error, req, res, next) => {
    console.error("SERVER ERROR:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`CampusConnect API running at http://localhost:${PORT}`);
});
