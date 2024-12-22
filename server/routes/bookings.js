const express = require("express");
const Booking = require("../models/Booking");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Book a Trip
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { tripId } = req.body;

        const trip = await Trip.findById(tripId);
        if (!trip) return res.status(404).json({ msg: "Trip not found" });

        if (trip.availableSlots <= 0) {
            return res.status(400).json({ msg: "No slots available for this trip" });
        }

        const booking = new Booking({
            user: req.user.id,
            trip: tripId,
        });

        trip.availableSlots -= 1;
        await trip.save();
        await booking.save();

        res.status(201).json({ msg: "Booking confirmed", booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User Bookings
router.get("/", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate("trip");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel Booking
router.post("/:id/cancel", authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate("trip");

        if (!booking) return res.status(404).json({ msg: "Booking not found" });
        if (booking.status === "cancelled") {
            return res.status(400).json({ msg: "Booking is already cancelled" });
        }

        // Calculate refund
        const daysUntilTrip = (new Date(booking.trip.dates) - new Date()) / (1000 * 60 * 60 * 24);
        let refundAmount = 0;

        if (daysUntilTrip >= 15) refundAmount = booking.trip.price;
        else if (daysUntilTrip >= 7) refundAmount = booking.trip.price * 0.5;

        // Update booking status and refund amount
        booking.status = "cancelled";
        booking.refundAmount = refundAmount;

        // Increase trip slots
        booking.trip.availableSlots += 1;
        await booking.trip.save();
        await booking.save();

        res.json({ msg: "Booking cancelled", refundAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
