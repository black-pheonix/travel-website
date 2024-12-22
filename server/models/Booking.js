const mongoose= require("mongoose");

const bookingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    trip:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Trip", 
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed",
    },
    refundAmount :{
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model("Booking", bookingSchema);