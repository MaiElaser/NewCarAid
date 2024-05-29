const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    carType: {
        type: String,
        required: [true, "Please enter your Car Type"],
    },
    brand: {
        type: String,
        required: [true, "Please enter your Car Brand"],
    },
    model: {
        type: String,
        required: [true, "Please Enter your Car Model"],
    },
    manufacturer: {
        type: String,
        required: [true, "Please enter your Car Manufacturer"],
    },
    plateNo: {
        type: String,
        required: [true, "Please enter your Car plate Number"],
        unique: true,
    },
    color: {
        type: String,
        required: [true, "Please enter your Car Color"],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model("Vehicle", vehicleSchema);



