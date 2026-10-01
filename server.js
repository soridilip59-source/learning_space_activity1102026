import express from "express";
import cors from "cors";
import complaintRoutes from "./routes/complaintRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CampusConnect API is running",
        version: "1.0.0"
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

app.use("/api/complaints", complaintRoutes);

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