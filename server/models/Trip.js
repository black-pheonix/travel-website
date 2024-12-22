const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    dates: {
        type: Date,
        required: true,
        default: Date.now,
    },
    price: {
        type: Number,
        required: true,
    },
    availableSlots: {
        type: Number,
        required: true,
        max: [10, "Slots cannot be more than 10"],
    },
    cancellationPolicy: {
        type: String,
        default: "Standard Policy Applies",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
