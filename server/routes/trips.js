const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Create Trip (Organizers Only)
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "Organizer") {
            return res.status(403).json({ msg: "Access denied: Organizers only" });
        }

        const { name, description, dates, price, availableSlots, cancellationPolicy } = req.body;

        if (!name || !description || !dates || !price || !availableSlots) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const trip = new Trip({
            name,
            description,
            dates,
            price,
            availableSlots,
            cancellationPolicy,
            createdBy: req.user.id,
        });

        await trip.save();
        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Trips
// Get All Trips with Pagination
router.get("/", async (req, res) => {
    try {
        // Get page and limit from query parameters (default to 1 and 6 if not provided)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        // Calculate the number of trips to skip based on the page
        const skip = (page - 1) * limit;

        // Fetch trips with pagination
        const trips = await Trip.find()
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email");

        // Get the total count of trips for pagination info
        const totalTrips = await Trip.countDocuments();

        // Send response with trips and pagination info
        res.json({
            trips,
            pagination: {
                totalTrips,
                currentPage: page,
                totalPages: Math.ceil(totalTrips / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get Trip Details
router.get("/:id", async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate("createdBy", "name email");
        if (!trip) return res.status(404).json({ msg: "Trip not found" });

        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Trip (Organizers Only)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "Organizer") {
            return res.status(403).json({ msg: "Access denied: Organizers only" });
        }

        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ msg: "Trip not found" });

        if (trip.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "You can only edit your own trips" });
        }

        const allowedUpdates = ["name", "description", "dates", "price", "availableSlots", "cancellationPolicy"];
        const updates = Object.keys(req.body);

        const isValidOperation = updates.every((key) => allowedUpdates.includes(key));
        if (!isValidOperation) {
            return res.status(400).json({ msg: "Invalid updates" });
        }

        updates.forEach((key) => (trip[key] = req.body[key]));
        await trip.save();

        res.json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Trip (Organizers Only)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "Organizer") {
            return res.status(403).json({ msg: "Access denied: Organizers only" });
        }

        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ msg: "Trip not found" });

        if (trip.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "You can only delete your own trips" });
        }

        await trip.remove();
        res.json({ msg: "Trip deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
